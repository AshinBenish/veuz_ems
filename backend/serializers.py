from django.contrib.auth.models import User
from rest_framework import serializers
from .models import VeFieldType, VeDynamicForm, VeDynamicFormField

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

class VeDynamicFormFieldSerializer(serializers.ModelSerializer):
    field_type = serializers.PrimaryKeyRelatedField(
        queryset=VeFieldType.objects.all()
    )

    class Meta:
        model = VeDynamicFormField
        fields = ['label', 'placeholder', 'field_type', 'required', 'order']

class VeDynamicFormSerializer(serializers.ModelSerializer):
    fields = VeDynamicFormFieldSerializer(many=True)

    class Meta:
        model = VeDynamicForm
        fields = ['id', 'name', 'description', 'fields','created_at']

    def create(self, validated_data):
        fields_data = validated_data.pop('fields')
        form = VeDynamicForm.objects.create(**validated_data)
        for field_data in fields_data:
            VeDynamicFormField.objects.create(form=form, **field_data)
        return form

    def update(self, instance, validated_data):
        fields_data = validated_data.pop('fields', None)
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        if fields_data is not None:
            # delete existing fields and recreate
            instance.fields.all().delete()
            for field_data in fields_data:
                VeDynamicFormField.objects.create(form=instance, **field_data)
        return instance