from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterAPIView, 
    MyTokenObtainPairView,
    VeFieldTypeListApiView,
    VeDynamicFormCreateListAPIView,
    VeDynamicFormRetrieveUpdateDestroyAPIView,
    EmployeeSubmitAPIView,
    UniqueDynamicFieldsAPIView,
    EmployeeSearchAPIView,
    EmployeeRetrieveUpdateDestroyView
)

urlpatterns = [
    path('auth/register/', RegisterAPIView.as_view(), name='register'),
    path('auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #Form 
    path('field-types/', VeFieldTypeListApiView.as_view(), name='field_types_list'),
    path('forms/', VeDynamicFormCreateListAPIView.as_view(), name='form-list-create'),
    path('forms/<int:pk>/', VeDynamicFormRetrieveUpdateDestroyAPIView.as_view(), name='form-detail'),
    path('dynamic/fields/', UniqueDynamicFieldsAPIView.as_view(), name='unique-dynamic-fields'),
    #Employee
    path('employee/create/', EmployeeSubmitAPIView.as_view(), name='employee-create'),
    path('employee/search/', EmployeeSearchAPIView.as_view(), name='employee-search'),
    path('employee/<int:pk>/', EmployeeRetrieveUpdateDestroyView.as_view(), name='employee-crud'),
]