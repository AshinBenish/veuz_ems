from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterAPIView, 
    UserProfileUpdateView,
    MyTokenObtainPairView,
    VeFieldTypeListApiView,
    VeDynamicFormCreateListAPIView,
    VeDynamicFormRetrieveUpdateDestroyAPIView,
    EmployeeSubmitAPIView,
    UniqueDynamicFieldsAPIView,
    EmployeeSearchAPIView,
    EmployeeRetrieveUpdateDestroyView,
    UserPasswordUpdateView,
    UserInfoView
)

urlpatterns = [
    path('auth/register/', RegisterAPIView.as_view(), name='register'),
    path('auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/profile/', UserInfoView.as_view(), name='user-info'),
    path('auth/profile/update/', UserProfileUpdateView.as_view(), name='user-profile'),
    path('auth/password/update/', UserPasswordUpdateView.as_view(), name='user-password'),
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