from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AccountViewSet, AccountGroupViewSet, JournalViewSet, 
    ContraViewSet, ReceiptViewSet, PaymentViewSet, 
    DebitNoteViewSet, CreditNoteViewSet, BillSundryViewSet,
    TrialBalanceView, LedgerView, ProfitLossView, BalanceSheetView
)

router = DefaultRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'account-groups', AccountGroupViewSet)
router.register(r'journal', JournalViewSet)
router.register(r'contra', ContraViewSet)
router.register(r'receipts', ReceiptViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'debit-notes', DebitNoteViewSet)
router.register(r'credit-notes', CreditNoteViewSet)
router.register(r'bill-sundry', BillSundryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('reports/trial-balance/', TrialBalanceView.as_view(), name='trial-balance'),
    path('reports/ledger/', LedgerView.as_view(), name='ledger'),
    path('reports/profit-loss/', ProfitLossView.as_view(), name='profit-loss'),
    path('reports/balance-sheet/', BalanceSheetView.as_view(), name='balance-sheet'),
]
