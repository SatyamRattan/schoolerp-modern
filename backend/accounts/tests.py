from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from .models import AccountGroup, Account

class AccountAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_superuser(username='admin', password='adminpassword', email='admin@test.com')
        self.client.force_authenticate(user=self.user)
        
        self.group = AccountGroup.objects.create(account_group_name='Test Group')
        self.account = Account.objects.create(
            account_name='Test Account',
            print_name='TA',
            group_acc='Test Group',
            op_bal=1000,
            dr_cr='dr',
            address='Test Address',
            city='Test City',
            state='Test State',
            email='test@example.com',
            phone='1234567890',
            mobile='0987654321'
        )

    def test_get_account_groups(self):
        url = reverse('accountgroup-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['account_group_name'], 'Test Group')

    def test_get_accounts(self):
        url = reverse('account-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['account_name'], 'Test Account')

    def test_create_account(self):
        url = reverse('account-list')
        data = {
            'account_name': 'New Account',
            'print_name': 'NA',
            'group_acc': 'Test Group',
            'op_bal': 500,
            'dr_cr': 'cr',
            'address': 'New Address',
            'city': 'New City',
            'state': 'New State',
            'email': 'new@example.com',
            'phone': '1112223333',
            'mobile': '4445556666'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Account.objects.count(), 2)
        self.assertEqual(Account.objects.get(account_name='New Account').city, 'New City')
