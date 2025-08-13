from django.db import models
from django.conf import settings

# Create your models here.
class BaseModel(models.Model):
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True

class VeDynamicForm(BaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    class Meta:
        db_table = "ve_dynamic_form"

class VeFieldType(models.Model):
    name = models.CharField(max_length=50, unique=True)
    display_name = models.CharField(max_length=100)
    html_input_type = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.display_name

    class Meta:
        db_table = 've_field_type'

class VeDynamicFormField(BaseModel):
    form = models.ForeignKey(VeDynamicForm, on_delete=models.CASCADE, related_name='fields')
    label = models.CharField(max_length=255)
    placeholder = models.CharField(max_length=255)
    field_type = models.ForeignKey(VeFieldType, on_delete=models.SET_NULL, null=True)
    required = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.label} - {self.field_type}"

    class Meta:
        db_table = 've_dynamic_form_field'

class VeEmployee(BaseModel):
    form = models.ForeignKey(VeDynamicForm, on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = 've_employee'

class VeEmployeeFieldValue(BaseModel):
    employee = models.ForeignKey(VeEmployee, on_delete=models.CASCADE, related_name="field_values")
    form_field = models.ForeignKey(VeDynamicFormField, on_delete=models.CASCADE)
    value = models.TextField()

    class Meta:
        db_table = 've_employee_field_value'