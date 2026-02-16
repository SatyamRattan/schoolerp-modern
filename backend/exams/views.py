from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.template.loader import get_template
# from xhtml2pdf import pisa
from io import BytesIO

from .models import ExamType, Grade, Exam, ExamSchedule, Marks, StudentExamRegistration
from .serializers import (
    ExamTypeSerializer, GradeSerializer, ExamSerializer, 
    ExamScheduleSerializer, MarksSerializer, StudentExamRegistrationSerializer
)
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

class ExamTypeViewSet(viewsets.ModelViewSet):
    queryset = ExamType.objects.all()
    serializer_class = ExamTypeSerializer

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        exam = self.get_object()
        exam.result_published = True
        exam.save()
        return Response({'status': 'result published'})

    @action(detail=True, methods=['post'])
    def unpublish(self, request, pk=None):
        exam = self.get_object()
        exam.result_published = False
        exam.save()
        return Response({'status': 'result unpublished'})

    @action(detail=True, methods=['get'])
    def generate_report_card(self, request, pk=None):
        return Response({'error': 'PDF generation temporarily disabled due to missing dependencies'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

class ExamScheduleViewSet(viewsets.ModelViewSet):
    queryset = ExamSchedule.objects.all()
    serializer_class = ExamScheduleSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        exam_id = self.request.query_params.get('exam_id')
        if exam_id:
            queryset = queryset.filter(exam_id=exam_id)
        return queryset

class MarksViewSet(viewsets.ModelViewSet):
    queryset = Marks.objects.all()
    serializer_class = MarksSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        exam_schedule_id = self.request.query_params.get('exam_schedule_id')
        student_id = self.request.query_params.get('student_id')
        if exam_schedule_id:
            queryset = queryset.filter(exam_schedule_id=exam_schedule_id)
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        return queryset

class StudentExamRegistrationViewSet(viewsets.ModelViewSet):
    queryset = StudentExamRegistration.objects.all()
    serializer_class = StudentExamRegistrationSerializer

from rest_framework.views import APIView
from students.models import Student

class GenerateReportCardView(APIView):
    def get(self, request, student_id, exam_id):
        student = get_object_or_404(Student, id=student_id)
        exam = get_object_or_404(Exam, id=exam_id)
        
        # Fetch all schedules for this exam
        schedules = ExamSchedule.objects.filter(exam=exam)
        
        data = [['Subject', 'Max', 'Pass', 'Obtained', 'Grade', 'Remarks']]
        total_max = 0
        total_obtained = 0
        
        for schedule in schedules:
            mark = Marks.objects.filter(student=student, exam_schedule=schedule).first()
            obtained = float(mark.marks_obtained) if mark else 0.0
            max_v = float(schedule.max_marks)
            pass_v = float(schedule.passing_marks)
            
            grade = "F"
            if mark and not mark.is_absent:
                perc = (obtained / max_v) * 100 if max_v > 0 else 0
                if perc >= 90: grade = "A+"
                elif perc >= 80: grade = "A"
                elif perc >= 70: grade = "B"
                elif perc >= 60: grade = "C"
                elif perc >= 50: grade = "D"
                elif perc >= 33: grade = "E"
                else: grade = "F"
            elif mark and mark.is_absent:
                grade = "ABS"
            
            data.append([
                schedule.subject.subject_name if schedule.subject else "N/A",
                str(schedule.max_marks),
                str(schedule.passing_marks),
                str(obtained),
                grade,
                mark.remarks if mark else ""
            ])
            
            total_max += max_v
            total_obtained += obtained
            
        final_percentage = (total_obtained / total_max * 100) if total_max > 0 else 0
        data.append(['TOTAL', str(total_max), '', str(total_obtained), f"{round(final_percentage, 2)}%", ''])

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        elements = []
        styles = getSampleStyleSheet()

        # Header
        elements.append(Paragraph("SCHOOL ERP MODERN", styles['Title']))
        elements.append(Paragraph(f"REPORT CARD: {exam.name}", styles['Heading2']))
        elements.append(Spacer(1, 0.2*inch))

        # Student Details
        elements.append(Paragraph(f"<b>Name:</b> {student.student_first_name} {student.student_last_name}", styles['Normal']))
        elements.append(Paragraph(f"<b>Admission No:</b> {student.admission_no}", styles['Normal']))
        elements.append(Paragraph(f"<b>Class/Section:</b> {student.student_class} - {student.student_section}", styles['Normal']))
        elements.append(Spacer(1, 0.3*inch))

        # Table
        t = Table(data, colWidths=[2.5*inch, 0.8*inch, 0.8*inch, 1*inch, 0.8*inch, 1.5*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        elements.append(t)
        
        elements.append(Spacer(1, 1*inch))
        elements.append(Paragraph("________________________", styles['Normal']))
        elements.append(Paragraph("Principal Signature", styles['Normal']))

        doc.build(elements)
        buffer.seek(0)
        
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="ReportCard_{student.admission_no}_{exam.name}.pdf"'
        return response
