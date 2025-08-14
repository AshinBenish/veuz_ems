from django.urls import path
from .views import (
    FrontendAppView, 
    FormDesignerView, 
    FormListView,
    FormEditView,
    EmployeeFormView,
    EmployeeSearchView,
    LoginView,
    RegistrationView,
    ProfileView
)

urlpatterns = [
    path('', FrontendAppView.as_view(), name='dashboard'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegistrationView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),

    #Form
    path('forms/create/', FormDesignerView.as_view(), name='form_designer'),
    path('forms/list/', FormListView.as_view(), name='form_list'),
    path('forms/<int:form_id>/edit/', FormEditView.as_view(), name='form_edit'),

    #Emploee
    path('employee/create/', EmployeeFormView.as_view(), name='employee_form'),
    path('employee/search/', EmployeeSearchView.as_view(), name='employee_search'),
]