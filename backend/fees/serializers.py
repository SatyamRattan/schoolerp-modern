from rest_framework import serializers
from .models import FeesHead, FeesHeadGroup, FeesPlan, FeesPlanCategory, FeesReceipt

class FeesHeadGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeesHeadGroup
        fields = '__all__'

class FeesHeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeesHead
        fields = '__all__'

class FeesPlanCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FeesPlanCategory
        fields = '__all__'

class FeesPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeesPlan
        fields = '__all__'

class FeesReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeesReceipt
        fields = '__all__'
