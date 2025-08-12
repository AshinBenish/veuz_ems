from django.contrib import admin
from .models import VeDynamicForm, VeFieldType, VeDynamicFormField, VeEmployee, VeEmployeeFieldValue

admin.site.register(VeDynamicForm)
admin.site.register(VeFieldType)
admin.site.register(VeDynamicFormField)
admin.site.register(VeEmployee)
admin.site.register(VeEmployeeFieldValue)
