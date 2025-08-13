from django.urls import path
from .views import (
    FrontendAppView, 
    FormDesignerView, 
    FormListView,
    FormEditView,
    EmployeeFormView
)

urlpatterns = [
    path('', FrontendAppView.as_view(), name='frontend_app'),
    path('forms/create/', FormDesignerView.as_view(), name='form_designer'),
    path('forms/list/', FormListView.as_view(), name='form_list'),
    path('forms/<int:form_id>/edit/', FormEditView.as_view(), name='form_edit'),

    #Emploee
    path('employee/create/', EmployeeFormView.as_view(), name='employee_form'),
]