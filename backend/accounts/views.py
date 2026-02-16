from rest_framework import viewsets
from .models import Account, AccountGroup, Journal, Contra, Receipt, Payment, DebitNote, CreditNote, BillSundry
from .serializers import (
    AccountSerializer, AccountGroupSerializer, JournalSerializer, 
    ContraSerializer, ReceiptSerializer, PaymentSerializer, 
    DebitNoteSerializer, CreditNoteSerializer, BillSundrySerializer
)

class AccountGroupViewSet(viewsets.ModelViewSet):
    queryset = AccountGroup.objects.all()
    serializer_class = AccountGroupSerializer

class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

class JournalViewSet(viewsets.ModelViewSet):
    queryset = Journal.objects.all()
    serializer_class = JournalSerializer

class ContraViewSet(viewsets.ModelViewSet):
    queryset = Contra.objects.all()
    serializer_class = ContraSerializer

class ReceiptViewSet(viewsets.ModelViewSet):
    queryset = Receipt.objects.all()
    serializer_class = ReceiptSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class DebitNoteViewSet(viewsets.ModelViewSet):
    queryset = DebitNote.objects.all()
    serializer_class = DebitNoteSerializer

class CreditNoteViewSet(viewsets.ModelViewSet):
    queryset = CreditNote.objects.all()
    serializer_class = CreditNoteSerializer

class BillSundryViewSet(viewsets.ModelViewSet):
    queryset = BillSundry.objects.all()
    serializer_class = BillSundrySerializer

# Financial Reporting Views
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Q

class TrialBalanceView(APIView):
    def get_account_totals(self, account_name, opening_bal, op_dr_cr):
        dr = opening_bal if op_dr_cr == 'Dr' else 0
        cr = opening_bal if op_dr_cr == 'Cr' else 0

        # Aggregate from all ledger models
        models_with_dc = [Journal, Contra, Receipt, DebitNote, CreditNote]
        for model in models_with_dc:
            dr += model.objects.filter(account_name=account_name, d_c='Dr').aggregate(Sum('amount'))['amount__sum'] or 0
            cr += model.objects.filter(account_name=account_name, d_c='Cr').aggregate(Sum('amount'))['amount__sum'] or 0
        
        # Payment model uses 1 for Dr and 0 for Cr (Legacy pattern)
        dr += Payment.objects.filter(account_name=account_name, d_c=1).aggregate(Sum('amount'))['amount__sum'] or 0
        cr += Payment.objects.filter(account_name=account_name, d_c=0).aggregate(Sum('amount'))['amount__sum'] or 0
        
        return dr, cr

    def get(self, request):
        accounts = Account.objects.all()
        trial_balance = []
        
        for account in accounts:
            dr, cr = self.get_account_totals(account.account_name, account.op_bal, account.dr_cr)
            
            if dr > 0 or cr > 0:
                trial_balance.append({
                    'account_name': account.account_name,
                    'group': account.group_acc,
                    'debit': dr,
                    'credit': cr
                })
        
        total_debit = sum(item['debit'] for item in trial_balance)
        total_credit = sum(item['credit'] for item in trial_balance)
        
        return Response({
            'trial_balance': trial_balance,
            'total_debit': total_debit,
            'total_credit': total_credit,
            'balanced': abs(total_debit - total_credit) < 0.01
        })

class LedgerView(APIView):
    """
    Returns ledger for a specific account with all transactions
    """
    def get(self, request):
        account_name = request.query_params.get('account_name')
        if not account_name:
            return Response({'error': 'account_name parameter required'}, status=400)
        
        account = get_object_or_404(Account, account_name=account_name)
        transactions = []
        
        # Opening entry
        transactions.append({
            'date': '2020-01-01', # Placeholder for opening
            'voucher_type': 'Opening',
            'voucher_no': 0,
            'debit': account.op_bal if account.dr_cr == 'Dr' else 0,
            'credit': account.op_bal if account.dr_cr == 'Cr' else 0,
            'narration': 'Opening Balance'
        })

        # Journal
        for journal in Journal.objects.filter(account_name=account_name).order_by('date'):
            transactions.append({
                'date': journal.date,
                'voucher_type': 'Journal',
                'voucher_no': journal.voucher_no,
                'debit': journal.amount if journal.d_c == 'Dr' else 0,
                'credit': journal.amount if journal.d_c == 'Cr' else 0,
                'narration': journal.short_narration
            })
        
        # Payments
        for pay in Payment.objects.filter(account_name=account_name).order_by('date'):
            transactions.append({
                'date': pay.date,
                'voucher_type': 'Payment',
                'voucher_no': pay.vch_no,
                'debit': pay.amount if pay.d_c == 1 else 0,
                'credit': pay.amount if pay.d_c == 0 else 0,
                'narration': pay.short_narration
            })

        # Contra
        for contra in Contra.objects.filter(account_name=account_name).order_by('date'):
            transactions.append({
                'date': contra.date,
                'voucher_type': 'Contra',
                'voucher_no': contra.voucher_no,
                'debit': contra.amount if contra.d_c == 'Dr' else 0,
                'credit': contra.amount if contra.d_c == 'Cr' else 0,
                'narration': contra.short_narration
            })

        # Receipts
        for r in Receipt.objects.filter(account_name=account_name).order_by('date'):
            transactions.append({
                'date': r.date,
                'voucher_type': 'Receipt',
                'voucher_no': r.vch_no,
                'debit': r.amount if r.d_c == 'Dr' else 0,
                'credit': r.amount if r.d_c == 'Cr' else 0,
                'narration': r.short_narration
            })

        # Debit Notes
        for dn in DebitNote.objects.filter(account_name=account_name).order_by('date'):
            transactions.append({
                'date': dn.date,
                'voucher_type': 'Debit Note',
                'voucher_no': dn.voucher_no,
                'debit': dn.amount if dn.d_c == 'Dr' else 0,
                'credit': dn.amount if dn.d_c == 'Cr' else 0,
                'narration': dn.short_narration
            })

        # Credit Notes
        for cn in CreditNote.objects.filter(account_name=account_name).order_by('date'):
            transactions.append({
                'date': cn.date,
                'voucher_type': 'Credit Note',
                'voucher_no': cn.voucher_no,
                'debit': cn.amount if cn.d_c == 'Dr' else 0,
                'credit': cn.amount if cn.d_c == 'Cr' else 0,
                'narration': cn.short_narration
            })
        
        # Sort by date
        transactions.sort(key=lambda x: str(x['date']))
        
        # Calculate running balance
        balance = 0
        for txn in transactions:
            balance += txn['debit'] - txn['credit']
            txn['balance'] = balance
        
        return Response({
            'account_name': account_name,
            'transactions': transactions,
            'closing_balance': balance
        })

class ProfitLossView(APIView):
    def get(self, request):
        tb_view = TrialBalanceView()
        revenue = 0
        expenses = 0
        
        # Revenue: Income Groups (Credit > Debit)
        income_accounts = Account.objects.filter(Q(group_acc__icontains='income') | Q(group_acc__icontains='revenue'))
        for acc in income_accounts:
            dr, cr = tb_view.get_account_totals(acc.account_name, acc.op_bal, acc.dr_cr)
            revenue += (cr - dr)
            
        # Expenses: Expense Groups (Debit > Credit)
        expense_accounts = Account.objects.filter(group_acc__icontains='expense')
        for acc in expense_accounts:
            dr, cr = tb_view.get_account_totals(acc.account_name, acc.op_bal, acc.dr_cr)
            expenses += (dr - cr)
            
        profit = revenue - expenses
        return Response({
            'revenue': max(0, revenue),
            'expenses': max(0, expenses),
            'profit': profit,
            'profit_percentage': (profit / revenue * 100) if revenue > 0 else 0
        })

class BalanceSheetView(APIView):
    def get(self, request):
        tb_view = TrialBalanceView()
        assets = 0
        liabilities = 0
        
        # Assets: Asset Groups (Debit > Credit)
        asset_accounts = Account.objects.filter(group_acc__icontains='asset')
        for acc in asset_accounts:
            dr, cr = tb_view.get_account_totals(acc.account_name, acc.op_bal, acc.dr_cr)
            assets += (dr - cr)
            
        # Liabilities: Liability Groups (Credit > Debit)
        liability_accounts = Account.objects.filter(group_acc__icontains='liability')
        for acc in liability_accounts:
            dr, cr = tb_view.get_account_totals(acc.account_name, acc.op_bal, acc.dr_cr)
            liabilities += (cr - dr)
            
        return Response({
            'assets': max(0, assets),
            'liabilities': max(0, liabilities),
            'difference': assets - liabilities
        })
