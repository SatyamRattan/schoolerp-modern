from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from .models import Student, StudentLeavingCertificate
from school_admin.models import OrganisationInfo
import io

class TransferCertificatePDFView(APIView):
    """
    Generates Transfer Certificate PDF for a student
    """
    def get(self, request):
        student_id = request.query_params.get('student_id')
        if not student_id:
            return Response({'error': 'student_id parameter required'}, status=400)
        
        try:
            student = Student.objects.get(id=student_id)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=404)
        
        # Get organization info
        try:
            org = OrganisationInfo.objects.first()
            org_name = org.name if org else "School Name"
            org_address = f"{org.address_1}, {org.city}" if org else "School Address"
        except:
            org_name = "School Name"
            org_address = "School Address"
        
        # Create PDF
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        story = []
        styles = getSampleStyleSheet()
        
        # Title
        title = Paragraph(f"<b>{org_name}</b>", styles['Title'])
        story.append(title)
        story.append(Spacer(1, 0.2*inch))
        
        address = Paragraph(org_address, styles['Normal'])
        story.append(address)
        story.append(Spacer(1, 0.3*inch))
        
        cert_title = Paragraph("<b>TRANSFER CERTIFICATE</b>", styles['Heading1'])
        story.append(cert_title)
        story.append(Spacer(1, 0.3*inch))
        
        # Certificate content
        content = f"""
        This is to certify that <b>{student.student_first_name} {student.student_last_name}</b>, 
        Son/Daughter of <b>{student.fathers_first_name} {student.fathers_last_name}</b> and 
        <b>{student.mothers_first_name} {student.mothers_last_name}</b> was a bonafide student 
        of this school studying in Class <b>{student.student_class}</b>, Section <b>{student.student_section}</b>.
        <br/><br/>
        Date of Birth: <b>{student.student_dob}</b><br/>
        Admission Number: <b>{student.admission_no}</b><br/>
        Date of Admission: <b>{student.date_admission}</b><br/>
        <br/>
        He/She has paid all fees dues to the school and is granted this Transfer Certificate.
        <br/><br/>
        Character: <b>Good</b><br/>
        Conduct: <b>Satisfactory</b>
        """
        
        para = Paragraph(content, styles['Normal'])
        story.append(para)
        story.append(Spacer(1, 0.5*inch))
        
        # Signature
        signature = Paragraph("<br/><br/>Principal's Signature<br/>Date: ___________", styles['Normal'])
        story.append(signature)
        
        doc.build(story)
        buffer.seek(0)
        
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="TC_{student.admission_no}.pdf"'
        return response

class CharacterCertificatePDFView(APIView):
    """
    Generates Character Certificate PDF for a student
    """
    def get(self, request):
        student_id = request.query_params.get('student_id')
        if not student_id:
            return Response({'error': 'student_id parameter required'}, status=400)
        
        try:
            student = Student.objects.get(id=student_id)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=404)
        
        # Get organization info
        try:
            org = OrganisationInfo.objects.first()
            org_name = org.name if org else "School Name"
            org_address = f"{org.address_1}, {org.city}" if org else "School Address"
        except:
            org_name = "School Name"
            org_address = "School Address"
        
        # Create PDF
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        story = []
        styles = getSampleStyleSheet()
        
        # Title
        title = Paragraph(f"<b>{org_name}</b>", styles['Title'])
        story.append(title)
        story.append(Spacer(1, 0.2*inch))
        
        address = Paragraph(org_address, styles['Normal'])
        story.append(address)
        story.append(Spacer(1, 0.3*inch))
        
        cert_title = Paragraph("<b>CHARACTER CERTIFICATE</b>", styles['Heading1'])
        story.append(cert_title)
        story.append(Spacer(1, 0.3*inch))
        
        # Certificate content
        content = f"""
        This is to certify that <b>{student.student_first_name} {student.student_last_name}</b>, 
        Son/Daughter of <b>{student.fathers_first_name} {student.fathers_last_name}</b> and 
        <b>{student.mothers_first_name} {student.mothers_last_name}</b> was a student of this school 
        from <b>{student.date_admission}</b> studying in Class <b>{student.student_class}</b>.
        <br/><br/>
        Admission Number: <b>{student.admission_no}</b><br/>
        Date of Birth: <b>{student.student_dob}</b><br/>
        <br/>
        During his/her stay in this institution, his/her character and conduct have been <b>Good</b>.
        <br/><br/>
        He/She bears a good moral character and is well-behaved.
        """
        
        para = Paragraph(content, styles['Normal'])
        story.append(para)
        story.append(Spacer(1, 0.5*inch))
        
        # Signature
        signature = Paragraph("<br/><br/>Principal's Signature<br/>Date: ___________", styles['Normal'])
        story.append(signature)
        
        doc.build(story)
        buffer.seek(0)
        
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="CC_{student.admission_no}.pdf"'
        return response
