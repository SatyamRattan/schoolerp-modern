import re
import os
import sys
from django.core.management.base import BaseCommand
from django.db import transaction
from accounts.models import AccountGroup, Account
from students.models import Class, Section, Student, Caste, Category, House, Family, Subject, Assessment, Term
from fees.models import FeesHead, FeesHeadGroup, FeesPlan, FeesReceipt
from attendance.models import Attendance
from enquiry.models import Enquiry
from transport.models import Route, Vehicle
from django.utils import timezone

class Command(BaseCommand):
    help = 'Migrates data from the legacy MySQL dump to PostgreSQL'

    def log(self, message, style=None):
        if style:
            self.stdout.write(style(message))
        else:
            self.stdout.write(message)
        sys.stdout.flush()

    def add_arguments(self, parser):
        parser.add_argument('sql_file', type=str, help='Path to the SQL dump file')

    def handle(self, *args, **options):
        sql_file_path = options['sql_file']
        if not os.path.exists(sql_file_path):
            self.log(f'File {sql_file_path} does not exist', self.style.ERROR)
            return

        self.log(f'Starting migration from {sql_file_path}...', self.style.SUCCESS)
        
        with open(sql_file_path, 'r', encoding='latin1') as f:
            content = f.read()

        self.log(f'Read {len(content)} characters from SQL file')

        self.migrate_account_groups(content)
        self.migrate_accounts(content)
        self.migrate_classes(content)
        self.migrate_sections(content)
        self.migrate_castes(content)
        self.migrate_categories(content)
        self.migrate_houses(content)
        self.migrate_families(content)
        self.migrate_students(content)
        self.migrate_subjects(content)
        self.migrate_assessments(content)
        self.migrate_terms(content)
        self.migrate_fees_head_groups(content)
        self.migrate_fees_heads(content)
        self.migrate_fees_plans(content)
        self.migrate_fees_receipts(content)
        self.migrate_fees_receipts(content)
        self.migrate_attendance(content)
        self.migrate_enquiries(content)
        self.migrate_routes(content)

    def extract_inserts(self, table_name, content):
        """Helper to extract INSERT INTO statements for a given table."""
        self.stdout.write(f'  Extracting inserts for {table_name}...')
        pattern = rf"INSERT INTO `{table_name}` \((.*?)\) VALUES"
        match = re.search(pattern, content, re.IGNORECASE)
        if not match:
            return []

        columns = [c.strip('` ') for c in match.group(1).split(',')]
        start_index = match.end()
        end_index = content.find(';', start_index)
        if end_index == -1:
            return []
        
        values_str = content[start_index:end_index].strip()
        
        raw_rows = []
        in_string = False
        in_parens = False
        buffer = ""
        
        idx = 0
        while idx < len(values_str):
            char = values_str[idx]
            if char == "'" and (idx == 0 or values_str[idx-1] != "\\"):
                in_string = not in_string
            
            if not in_string:
                if char == "(":
                    in_parens = True
                    buffer = ""
                elif char == ")":
                    in_parens = False
                    raw_rows.append(buffer)
                elif in_parens:
                    buffer += char
            else:
                buffer += char
            idx += 1

        data = []
        for raw_row in raw_rows:
            vals = []
            curr_val = ""
            row_in_string = False
            for c in raw_row:
                if c == "'" and (not curr_val or curr_val[-1] != "\\"):
                    row_in_string = not row_in_string
                    curr_val += c
                elif c == "," and not row_in_string:
                    vals.append(curr_val.strip())
                    curr_val = ""
                else:
                    curr_val += c
            vals.append(curr_val.strip())
            
            processed_values = []
            for v in vals:
                if v.startswith("'") and v.endswith("'"):
                    # Unescape single quotes
                    processed_values.append(v[1:-1].replace("''", "'").replace("\\'", "'"))
                elif v.upper() == "NULL":
                    processed_values.append(None)
                else:
                    processed_values.append(v)
            
            if len(columns) == len(processed_values):
                data.append(dict(zip(columns, processed_values)))
        return data

    def parse_date(self, date_str):
        if not date_str or date_str == '0000-00-00':
            return None
        return date_str

    @transaction.atomic
    def migrate_account_groups(self, content):
        self.log('Migrating Account Groups...')
        groups = self.extract_inserts('account_group', content)
        count = 0
        for g in groups:
            AccountGroup.objects.get_or_create(
                id=g['account_group_id'],
                defaults={'account_group_name': g['account_group_name']}
            )
            count += 1
        self.log(f'Successfully migrated {count} Account Groups', self.style.SUCCESS)

    @transaction.atomic
    def migrate_accounts(self, content):
        self.log('Migrating Accounts...')
        accounts = self.extract_inserts('account', content)
        count = 0
        for a in accounts:
            Account.objects.get_or_create(
                id=a['account_id'],
                defaults={
                    'account_name': a['account_name'],
                    'print_name': a['print_name'],
                    'group_acc': a['group_acc'],
                    'op_bal': int(a['op_bal']) if a['op_bal'] else 0,
                    'dr_cr': a['dr_cr'],
                    'address': a['address'],
                    'address1': a.get('address1', ''),
                    'city': a['city'],
                    'state': a['state'],
                    'email': a['email'] if '@' in a['email'] else 'info@school.com',
                    'phone': a['phone'] if a['phone'] and a['phone'] != '0' else '',
                    'mobile': a['mobile'] if a['mobile'] and a['mobile'] != '0' else '',
                    'contact_per': a.get('contact_per', ''),
                    'birthday_on': self.parse_date(a.get('birthday_on')),
                    'anniv_on': self.parse_date(a.get('anniv_on')),
                    'bank_name': a.get('bank_name', ''),
                    'bank_acc_no': a.get('bank_acc_no', ''),
                    'cheque_p_name': a.get('cheque_p_name', ''),
                }
            )
            count += 1
        self.log(f'Successfully migrated {count} Accounts', self.style.SUCCESS)

    @transaction.atomic
    def migrate_classes(self, content):
        self.log('Migrating Classes...')
        classes = self.extract_inserts('class', content)
        count = 0
        for c in classes:
            Class.objects.get_or_create(
                id=c['class_id'],
                defaults={
                    'class_num': int(c['class']),
                    'prefix': c['prefix'],
                    'start_from': self.parse_date(c['start_from']) or '2020-01-01',
                    'incharge': c['incharge']
                }
            )
            count += 1
        self.log(f'Successfully migrated {count} Classes', self.style.SUCCESS)

    @transaction.atomic
    def migrate_sections(self, content):
        self.log('Migrating Sections...')
        sections = self.extract_inserts('section', content)
        count = 0
        for s in sections:
            Section.objects.get_or_create(
                id=s['section_id'],
                defaults={'section_name': s['section_name']}
            )
            count += 1
        self.log(f'Successfully migrated {count} Sections', self.style.SUCCESS)

    @transaction.atomic
    def migrate_castes(self, content):
        self.log('Migrating Castes...')
        castes = self.extract_inserts('caste', content)
        count = 0
        for c in castes:
            Caste.objects.get_or_create(
                id=c['caste_id'],
                defaults={'caste_name': c['caste_name']}
            )
            count += 1
        self.log(f'Successfully migrated {count} Castes', self.style.SUCCESS)

    @transaction.atomic
    def migrate_categories(self, content):
        self.log('Migrating Categories...')
        categories = self.extract_inserts('category', content)
        count = 0
        for c in categories:
            Category.objects.get_or_create(
                id=c['category_id'],
                defaults={'category_name': c['category_name']}
            )
            count += 1
        self.log(f'Successfully migrated {count} Categories', self.style.SUCCESS)

    @transaction.atomic
    def migrate_houses(self, content):
        self.log('Migrating Houses...')
        houses = self.extract_inserts('house', content)
        count = 0
        for h in houses:
            House.objects.get_or_create(
                id=h['house_id'],
                defaults={'house_name': h['house_name']}
            )
            count += 1
        self.log(f'Successfully migrated {count} Houses', self.style.SUCCESS)

    @transaction.atomic
    def migrate_families(self, content):
        self.log('Migrating Families...')
        families = self.extract_inserts('family', content)
        count = 0
        for f in families:
            Family.objects.get_or_create(
                id=f['family_id'],
                defaults={'family_name': f['family_name']}
            )
            count += 1
        self.log(f'Successfully migrated {count} Families', self.style.SUCCESS)

    @transaction.atomic
    def migrate_students(self, content):
        self.log('Migrating Students...')
        students = self.extract_inserts('student', content)
        count = 0
        for s in students:
            Student.objects.update_or_create(
                id=s['student_id'],
                defaults={
                    'student_first_name': s['student_first_name'],
                    'student_middle_name': s.get('student_middle_name', ''),
                    'student_last_name': s.get('student_last_name', ''),
                    'student_class': s['student_class'],
                    'student_section': s['student_section'],
                    'student_roll_no': int(s['student_roll_no']) if s['student_roll_no'] else 0,
                    'route': s.get('route', ''),
                    'caste': s['caste'],
                    'category': s['category'],
                    'house': s['house'],
                    'admission_no': int(s['admission_no']),
                    'gender': s['gender'],
                    'student_dob': self.parse_date(s['student_dob']) or '2000-01-01',
                    'house_no': s.get('house_no', ''),
                    'street_name': s.get('street_name', ''),
                    'other_info': s.get('other_info', ''),
                    'zip_code': s.get('zip_code', ''),
                    'city': s.get('city', ''),
                    'state': s.get('state', ''),
                    'country': s.get('country', ''),
                    'fathers_first_name': s.get('fathers_first_name', ''),
                    'fathers_middle_name': s.get('fathers_middle_name', ''),
                    'fathers_last_name': s.get('fathers_last_name', ''),
                    'f_mobile': s.get('f_mobile', ''),
                    'f_qual': s.get('f_qual', ''),
                    'f_occu': s.get('f_occu', ''),
                    'f_dob': self.parse_date(s.get('f_dob')),
                    'mothers_first_name': s.get('mothers_first_name', ''),
                    'mothers_middle_name': s.get('mothers_middle_name', ''),
                    'mothers_last_name': s.get('mothers_last_name', ''),
                    'm_mobile': s.get('m_mobile', ''),
                    'm_qual': s.get('m_qual', ''),
                    'm_occu': s.get('m_occu', ''),
                    'm_dob': self.parse_date(s.get('m_dob')),
                    'parents_wedding_date': self.parse_date(s.get('parents_wedding_date')),
                    'las': s.get('las', ''),
                    'remarks': s.get('remarks', ''),
                    'last_exam_given': s.get('last_exam_given', ''),
                    'year': self.parse_date(s.get('year')) or '2023-01-01',
                    'status': s.get('status', 'active'),
                    'marks': int(s['marks']) if s.get('marks') else 0,
                    'board': s.get('board', ''),
                    'bg': s.get('bg', ''),
                    'vl': int(s['vl']) if s.get('vl') else 0,
                    'vr': int(s['vr']) if s.get('vr') else 0,
                    'height': int(s['height']) if s.get('height') else 0,
                    'weight': int(s['weight']) if s.get('weight') else 0,
                    'dental_hy': s.get('dental_hy', ''),
                    'tc': s.get('tc') == '1',
                    'cc': s.get('cc') == '1',
                    'report_cc': s.get('report_cc') == '1',
                    'dob_certificate': s.get('dob_certificate') == '1',
                    'admission_form_no': int(s['admission_form_no']) if s.get('admission_form_no') else 0,
                    'date_admission': self.parse_date(s.get('date_admission')) or '2023-01-01',
                    'ledger_balance': int(s['ledger_balance']) if s.get('ledger_balance') else 0,
                    'fees_balance': int(s['fees_balance']) if s.get('fees_balance') else 0,
                    'comments': s.get('comments', ''),
                    'hostel_room_no': s.get('hostel_room_no', ''),
                    'bed_no': int(s['bed_no']) if s.get('bed_no') else 0,
                    'scholarship_no': int(s['scholarship_no']) if s.get('scholarship_no') else 0,
                    'aadhar_uid': s.get('aadhar_uid', ''),
                    'family': s.get('family', ''),
                    'status_adm': s.get('status_adm', ''),
                    'discontinue_date': self.parse_date(s.get('discontinue_date')),
                }
            )
            count += 1
        self.log(f'Successfully migrated {count} Students', self.style.SUCCESS)

    @transaction.atomic
    def migrate_fees_head_groups(self, content):
        self.log('Migrating Fees Head Groups...')
        groups = self.extract_inserts('fees_head_group', content)
        count = 0
        for g in groups:
            FeesHeadGroup.objects.get_or_create(
                id=g['fees_head_group_id'],
                defaults={'fees_head_group_name': g['fees_head_group_name']}
            )
            count += 1
        self.log(f'Successfully migrated {count} Fees Head Groups', self.style.SUCCESS)

    @transaction.atomic
    def migrate_fees_heads(self, content):
        self.log('Migrating Fees Heads...')
        heads = self.extract_inserts('fees_head', content)
        count = 0
        for h in heads:
            FeesHead.objects.get_or_create(
                id=h['fees_head_id'],
                defaults={
                    'fees_heading': h['fees_heading'],
                    'group_name': h['group_name'],
                    'account_name': h['account_name'],
                    'frequency': h['frequency'],
                    'january': int(h['january']) if h.get('january') else None,
                    'february': int(h['february']) if h.get('february') else None,
                    'march': int(h['march']) if h.get('march') else None,
                    'april': int(h['april']) if h.get('april') else None,
                    'may': int(h['may']) if h.get('may') else None,
                    'june': int(h['june']) if h.get('june') else None,
                    'july': int(h['july']) if h.get('july') else None,
                    'august': int(h['august']) if h.get('august') else None,
                    'september': int(h['september']) if h.get('september') else None,
                    'october': int(h['october']) if h.get('october') else None,
                    'november': int(h['november']) if h.get('november') else None,
                    'december': int(h['december']) if h.get('december') else None,
                }
            )
            count += 1
        self.log(f'Successfully migrated {count} Fees Heads', self.style.SUCCESS)

    @transaction.atomic
    def migrate_fees_plans(self, content):
        self.log('Migrating Fees Plans...')
        plans = self.extract_inserts('fees_plan', content)
        count = 0
        for p in plans:
            FeesPlan.objects.create(
                fees_heading=p.get('fees_heading'),
                value=int(p['value']) if p.get('value') else 0,
                category=p.get('category'),
                class_name=p.get('class')
            )
            count += 1
        self.log(f'Successfully migrated {count} Fees Plans', self.style.SUCCESS)

    @transaction.atomic
    def migrate_fees_receipts(self, content):
        self.log('Migrating Fees Receipts...')
        receipts = self.extract_inserts('fees_reciept', content)
        count = 0
        for r in receipts:
            FeesReceipt.objects.update_or_create(
                id=r['reciept_id'],
                defaults={
                    'date': self.parse_date(r['date']) or '2023-01-01',
                    'receipt_no': int(r['reciept_no']),
                    'admission_no': int(r['admission_no']),
                    'jan': int(r['jan']),
                    'feb': int(r['feb']),
                    'mar': int(r['mar']),
                    'apr': int(r['apr']),
                    'may': int(r['may']),
                    'jun': int(r['jun']),
                    'jul': int(r['jul']),
                    'aug': int(r['aug']),
                    'sep': int(r['sep']),
                    'oct': int(r['oct']),
                    'nov': int(r['nov']),
                    'dece': int(r['dece']),
                }
            )
            count += 1
        self.log(f'Successfully migrated {count} Fees Receipts', self.style.SUCCESS)

    @transaction.atomic
    def migrate_attendance(self, content):
        self.log('Migrating Attendance...')
        attendance_data = self.extract_inserts('attendance', content)
        count = 0
        for a in attendance_data:
            Attendance.objects.create(
                date=self.parse_date(a['date']) or '2023-01-01',
                class_name=a['class'],
                section=a['section'],
                student_id=int(a['student_id']),
                status=a['status']
            )
            count += 1
        self.log(f'Successfully migrated {count} Attendance records', self.style.SUCCESS)

    @transaction.atomic
    def migrate_subjects(self, content):
        self.log('Migrating Subjects...')
        subjects = self.extract_inserts('subject', content)
        count = 0
        for s in subjects:
            Subject.objects.get_or_create(
                id=s['subject_id'],
                defaults={'subject_name': s['subject_name']}
            )
            count += 1
        self.log(f'Successfully migrated {count} Subjects', self.style.SUCCESS)

    @transaction.atomic
    def migrate_assessments(self, content):
        self.log('Migrating Assessments...')
        assessments = self.extract_inserts('assessment', content)
        count = 0
        for a in assessments:
            Assessment.objects.get_or_create(
                id=a['assessment_id'],
                defaults={'assessment_name': a['assessment_name']}
            )
            count += 1
        self.log(f'Successfully migrated {count} Assessments', self.style.SUCCESS)

    @transaction.atomic
    def migrate_terms(self, content):
        self.log('Migrating Terms...')
        terms = self.extract_inserts('terms', content)
        count = 0
        for t in terms:
            Term.objects.get_or_create(
                id=t['term_id'],
                defaults={'term_name': t['term_name']}
            )
            count += 1
        self.log(f'Successfully migrated {count} Terms', self.style.SUCCESS)

    @transaction.atomic
    def migrate_enquiries(self, content):
        self.log('Migrating Enquiries (Contact Us)...')
        contacts = self.extract_inserts('contact_us', content)
        count = 0
        for c in contacts:
            Enquiry.objects.get_or_create(
                student_name=c['name'],
                phone=str(c['mobile']),
                email=c['email'],
                defaults={
                    'class_applying_for': 'N/A',
                    'remarks': c['message'],
                    'status': 'NEW'
                }
            )
            count += 1
        self.log(f'Successfully migrated {count} Enquiries', self.style.SUCCESS)

    @transaction.atomic
    def migrate_routes(self, content):
        self.log('Migrating Routes...')
        routes = self.extract_inserts('route', content)
        
        # Create a default vehicle if none exists
        default_vehicle, _ = Vehicle.objects.get_or_create(
            registration_number='LEGACY-BUS-01',
            defaults={
                'driver_name': 'Unknown',
                'contact_number': '0000000000',
                'capacity': 50
            }
        )

        count = 0
        for r in routes:
            Route.objects.get_or_create(
                name=r['route_name'],
                defaults={
                    'vehicle': default_vehicle,
                    'start_point': 'School',
                    'end_point': r['route_name'], 
                    'description': f"Freq: {r['freq']}"
                }
            )
            count += 1
        self.log(f'Successfully migrated {count} Routes', self.style.SUCCESS)
