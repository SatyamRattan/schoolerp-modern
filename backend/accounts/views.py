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
    """
    Returns Trial Balance: List of all accounts with their debit/credit totals
    """
    def get(self, request):
        accounts = Account.objects.all()
        trial_balance = []
        
        for account in accounts:
            # Calculate totals from all transaction types
            journal_dr = Journal.objects.filter(account_name=account.account_name, d_c='Dr').aggregate(Sum('amount'))['amount__sum'] or 0
            journal_cr = Journal.objects.filter(account_name=account.account_name, d_c='Cr').aggregate(Sum('amount'))['amount__sum'] or 0
            
            contra_dr = Contra.objects.filter(account_name=account.account_name, d_c='Dr').aggregate(Sum('amount'))['amount__sum'] or 0
            contra_cr = Contra.objects.filter(account_name=account.account_name, d_c='Cr').aggregate(Sum('amount'))['amount__sum'] or 0
            
            receipt_dr = Receipt.objects.filter(account_name=account.account_name, d_c='Dr').aggregate(Sum('amount'))['amount__sum'] or 0
            receipt_cr = Receipt.objects.filter(account_name=account.account_name, d_c='Cr').aggregate(Sum('amount'))['amount__sum'] or 0
            
            payment_dr = Payment.objects.filter(account_name=account.account_name, d_c=1).aggregate(Sum('amount'))['amount__sum'] or 0  # Assuming 1=Dr
            payment_cr = Payment.objects.filter(account_name=account.account_name, d_c=0).aggregate(Sum('amount'))['amount__sum'] or 0  # Assuming 0=Cr
            
            total_dr = account.op_bal if account.dr_cr == 'Dr' else 0
            total_dr += journal_dr + contra_dr + receipt_dr + payment_dr
            
            total_cr = account.op_bal if account.dr_cr == 'Cr' else 0
            total_cr += journal_cr + contra_cr + receipt_cr + payment_cr
            
            if total_dr > 0 or total_cr > 0:
                trial_balance.append({
                    'account_name': account.account_name,
                    'group': account.group_acc,
                    'debit': total_dr,
                    'credit': total_cr
                })
        
        total_debit = sum(item['debit'] for item in trial_balance)
        total_credit = sum(item['credit'] for item in trial_balance)
        
        return Response({
            'trial_balance': trial_balance,
            'total_debit': total_debit,
            'total_credit': total_credit,
            'balanced': total_debit == total_credit
        })

class LedgerView(APIView):
    """
    Returns ledger for a specific account with all transactions
    """
    def get(self, request):
        account_name = request.query_params.get('account_name')
        if not account_name:
            return Response({'error': 'account_name parameter required'}, status=400)
        
        transactions = []
        
        # Collect all transactions for this account
        for journal in Journal.objects.filter(account_name=account_name).order_by('date'):
            transactions.append({
                'date': journal.date,
                'voucher_type': 'Journal',
                'voucher_no': journal.voucher_no,
                'debit': journal.amount if journal.d_c == 'Dr' else 0,
                'credit': journal.amount if journal.d_c == 'Cr' else 0,
                'narration': journal.short_narration
            })
        
        for contra in Contra.objects.filter(account_name=account_name).order_by('date'):
            transactions.append({
                'date': contra.date,
                'voucher_type': 'Contra',
                'voucher_no': contra.voucher_no,
                'debit': contra.amount if contra.d_c == 'Dr' else 0,
                'credit': contra.amount if contra.d_c == 'Cr' else 0,
                'narration': contra.short_narration
            })
        
        # Sort by date
        transactions.sort(key=lambda x: x['date'])
        
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
    """
    Returns Profit & Loss statement
    """
    def get(self, request):
        # This is a simplified version - in production, you'd filter by account groups
        # Revenue accounts (typically Credit balance)
        revenue_accounts = Account.objects.filter(group_acc__icontains='income')
        revenue = sum(acc.op_bal for acc in revenue_accounts if acc.dr_cr == 'Cr')
        
        # Expense accounts (typically Debit balance)
        expense_accounts = Account.objects.filter(group_acc__icontains='expense')
        expenses = sum(acc.op_bal for acc in expense_accounts if acc.dr_cr == 'Dr')
        
        profit = revenue - expenses
        
        return Response({
            'revenue': revenue,
            'expenses': expenses,
            'profit': profit,
            'profit_percentage': (profit / revenue * 100) if revenue > 0 else 0
        })

class BalanceSheetView(APIView):
    """
    Returns Balance Sheet
    """
    def get(self, request):
        # Assets (Debit balance accounts)
        asset_accounts = Account.objects.filter(group_acc__icontains='asset')
        assets = sum(acc.op_bal for acc in asset_accounts if acc.dr_cr == 'Dr')
        
        # Liabilities (Credit balance accounts)
        liability_accounts = Account.objects.filter(group_acc__icontains='liability')
        liabilities = sum(acc.op_bal for acc in liability_accounts if acc.dr_cr == 'Cr')
        
        return Response({
            'assets': assets,
            'liabilities': liabilities,
            'difference': assets - liabilities
        })
