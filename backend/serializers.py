from django.contrib.auth.models import User
from django.contrib.auth import password_validation
from rest_framework import serializers
from .models import VeFieldType, VeDynamicForm, VeDynamicFormField, VeEmployee, VeEmployeeFieldValue

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
    
class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']

    def validate_username(self, value):
        user = self.context['request'].user
        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        user = self.context['request'].user
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

class UserPasswordUpdateSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def validate_new_password(self, value):
        password_validation.validate_password(value)
        return value

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
    
class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

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
        fields = ['id','label', 'placeholder', 'field_type', 'required', 'order']

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
    
class VeEmployeeFieldValueSerializer(serializers.ModelSerializer):
    # Map 'field_id' from JSON to the 'form_field' ForeignKey
    field_id = serializers.PrimaryKeyRelatedField(
        source='form_field',
        queryset=VeDynamicFormField.objects.all()
    )

    class Meta:
        model = VeEmployeeFieldValue
        fields = ['field_id', 'value']

class VeEmployeeSubmitSerializer(serializers.ModelSerializer):
    fields = VeEmployeeFieldValueSerializer(many=True, write_only=True)
    form_id = serializers.PrimaryKeyRelatedField(
        queryset=VeDynamicForm.objects.all(),
        source='form'
    )

    class Meta:
        model = VeEmployee
        fields = ['form_id', 'fields']

    def validate(self, attrs):
        form = attrs['form']
        fields_data = attrs.get('fields', [])

        # Build a mapping of field_id -> value from submitted data
        submitted_field_map = {f['form_field'].id: f['value'] for f in fields_data}

        # Check required fields
        for field in form.fields.filter(required=True):
            value = submitted_field_map.get(field.id, None)
            if value is None or str(value).strip() == "":
                raise serializers.ValidationError({
                    "fields": f"The field '{field.label}' is required and cannot be empty."
                })

        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        fields_data = validated_data.pop('fields')
        form = validated_data.pop('form')

        # Create Employee instance
        employee = VeEmployee.objects.create(form=form, created_by=user)

        # Create associated field values
        for field_data in fields_data:
            VeEmployeeFieldValue.objects.create(employee=employee, **field_data)

        return employee

class VeEmployeeSearchSerializer(serializers.Serializer):
    filters = serializers.DictField(
        child=serializers.CharField(),
        required=False,
        help_text="Dictionary of {field_label: value_to_search}"
    )
    keyword = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text="General search keyword for all fields if no filters are applied"
    )


class VeEmployeeFieldValueRetriveSerializer(serializers.ModelSerializer):
    form_field = serializers.PrimaryKeyRelatedField(
        queryset=VeDynamicFormField.objects.all()
    )
    label = serializers.CharField(source='form_field.label', read_only=True)
    placeholder = serializers.CharField(source='form_field.placeholder', read_only=True)
    field_type = serializers.CharField(source='form_field.field_type.pk', read_only=True)
    required = serializers.BooleanField(source='form_field.required', read_only=True)
    order = serializers.IntegerField(source='form_field.order', read_only=True)
    field_type_name = serializers.CharField(source='form_field.field_type.name', read_only=True)


    class Meta:
        model = VeEmployeeFieldValue
        fields = ['form_field', 'value','label', 'placeholder', 'field_type', 'required', 'order', 'field_type_name']

class VeEmployeeSerializer(serializers.ModelSerializer):
    fields = VeEmployeeFieldValueRetriveSerializer(many=True, source='field_values')

    class Meta:
        model = VeEmployee
        fields = ['id', 'form_id', 'fields']

    def update(self, instance, validated_data):
        fields_data = validated_data.pop('field_values', [])
        instance = super().update(instance, validated_data)

        # Bulk update fields
        existing_fields = {fv.form_field_id: fv for fv in instance.field_values.all()}
        for field_data in fields_data:
            form_field = field_data['form_field']
            value = field_data['value']
            if form_field.id in existing_fields:
                existing_fields[form_field.id].value = value
                existing_fields[form_field.id].save()
            else:
                VeEmployeeFieldValue.objects.create(employee=instance, form_field=form_field, value=value)
        return instance