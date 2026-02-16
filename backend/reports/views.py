from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from students.models import Student
# from school_admin.models import OrganisationInfo # Commented out to avoid potential import errors if models.py is broken
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_certificate(request, student_id, type):
    student = get_object_or_404(Student, id=student_id)
    
    # Defaults
    org_name = "School ERP Modern"
    org_address = "Sector 62, Noida, UP"

    # Try to fetch Org Info safely
    try:
        from school_admin.models import OrganisationInfo
        org = OrganisationInfo.objects.first()
        if org:
            org_name = org.name
            # org_address = getattr(org, 'address_1', org_address) # Safe access
    except ImportError:
        pass
    except Exception as e:
        print(f"Error fetching Org Info: {e}")
    
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    # Draw Border
    p.setLineWidth(3)
    p.strokeColoredRGB(0.1, 0.1, 0.6)
    p.rect(0.5*inch, 0.5*inch, width-1*inch, height-1*inch)
    
    # Header
    p.setFillColorRGB(0, 0, 0)
    p.setFont("Helvetica-Bold", 30)
    p.drawCentredString(width/2, height-1.5*inch, org_name.upper())
    
    p.setFont("Helvetica", 12)
    p.drawCentredString(width/2, height-1.8*inch, org_address)
    
    p.setLineWidth(1)
    p.line(1*inch, height-2.2*inch, width-1*inch, height-2.2*inch)

    # Certificate Title
    title_y = height - 3*inch
    p.setFont("Helvetica-Bold", 24)
    if type == 'bonafide':
        title = "BONAFIDE CERTIFICATE"
    elif type == 'transfer':
        title = "TRANSFER CERTIFICATE"
    elif type == 'character':
        title = "CHARACTER CERTIFICATE"
    else:
        title = "CERTIFICATE"
    
    p.setFillColorRGB(0.6, 0.1, 0.1) # Dark Red title
    p.drawCentredString(width/2, title_y, title)
    
    # Content Body
    p.setFillColorRGB(0, 0, 0)
    p.setFont("Helvetica", 14)
    text_y = title_y - 1*inch
    line_height = 25
    
    # Common Student Info
    full_name = f"{student.student_first_name} {student.student_last_name}"
    father_name = f"{student.fathers_first_name}"
    cls = f"{student.student_class} - {student.student_section}"
    adm_no = f"{student.admission_no}"
    
    lines = []
    
    if type == 'bonafide':
        lines.append(f"This is to certify that Master/Miss {full_name},")
        lines.append(f"Son/Daughter of Mr. {father_name},")
        lines.append(f"is a bonafide student of this institution.")
        lines.append(f"")
        lines.append(f"He/She is styling in Class {cls}.")
        lines.append(f"Admission Number: {adm_no}")
        lines.append(f"")
        lines.append(f"His/Her date of birth as per written record is {student.student_dob}.")

    elif type == 'transfer':
        lines.append(f"This is to certify that Master/Miss {full_name},")
        lines.append(f"Son/Daughter of Mr. {father_name},")
        lines.append(f"was a student of this school from {student.date_admission} to Present.")
        lines.append(f"")
        lines.append(f"He/She has passed the Class {student.student_class} examination.")
        lines.append(f"")
        lines.append(f"He/She has paid all dues to the school.")
        lines.append(f"Character: Good")

    elif type == 'character':
        lines.append(f"This is to certify that Master/Miss {full_name},")
        lines.append(f"Son/Daughter of Mr. {father_name},")
        lines.append(f"has been a student of this institution.")
        lines.append(f"")
        lines.append(f"During his/her stay, his/her character and conduct have been Good.")
        lines.append(f"He/She bears a good moral character.")

    # Draw Text
    for line in lines:
        p.drawCentredString(width/2, text_y, line)
        text_y -= line_height

    # Footer / Signatures
    sig_y = 2*inch
    p.setFont("Helvetica-Bold", 12)
    
    import datetime
    today = datetime.date.today()
    
    p.drawString(1.5*inch, sig_y, f"Date: {today}")
    p.drawRightString(width-1.5*inch, sig_y, "Principal Signature")
    
    p.setLineWidth(1)
    p.line(width-3.5*inch, sig_y + 0.2*inch, width-1.5*inch, sig_y + 0.2*inch) # Line for signature

    p.showPage()
    p.save()
    
    buffer.seek(0)
    filename = f"{type}_certificate_{student.admission_no or 'new'}.pdf"
    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response
