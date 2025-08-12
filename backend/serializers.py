from django.contrib.auth.models import User
from rest_framework import serializers
from .models import VeFieldType

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email is already registered.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user

class VeFieldTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VeFieldType
        fields = ['id', 'name', 'display_name', 'html_input_type', 'description']
