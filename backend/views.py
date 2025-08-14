from django.db.models.functions import Lower
from django.db.models import Q
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import RegisterSerializer,VeFieldTypeSerializer
from .models import VeFieldType, VeDynamicForm, VeDynamicFormField, VeEmployee
from .serializers import (
    VeDynamicFormSerializer, 
    VeEmployeeSubmitSerializer, 
    VeEmployeeSearchSerializer, 
    VeEmployeeSerializer, 
    UserProfileUpdateSerializer,
    UserPasswordUpdateSerializer,
    UserInfoSerializer
)

# Registration View
class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({"detail": "User registered successfully."}, status=status.HTTP_201_CREATED)
    
class UserInfoView(generics.RetrieveAPIView):
    serializer_class = UserInfoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

#Profile Update View
class UserProfileUpdateView(generics.UpdateAPIView):
    serializer_class = UserProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class UserPasswordUpdateView(generics.UpdateAPIView):
    serializer_class = UserPasswordUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# Custom Token Obtain Pair Serializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token

# Login View using SimpleJWT's TokenObtainPairView
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    permission_classes = [AllowAny]


# API views for Form Creation

class VeFieldTypeListApiView(generics.ListAPIView):
    queryset = VeFieldType.objects.all().order_by('id')
    serializer_class = VeFieldTypeSerializer
    permission_classes = [AllowAny]


class VeDynamicFormCreateListAPIView(generics.ListCreateAPIView):
    queryset = VeDynamicForm.objects.all().order_by('id')
    serializer_class = VeDynamicFormSerializer
    permission_classes = [permissions.IsAuthenticated]

class VeDynamicFormRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = VeDynamicForm.objects.all()
    serializer_class = VeDynamicFormSerializer
    permission_classes = [permissions.IsAuthenticated]

# API for Employee CRUD

class EmployeeSubmitAPIView(generics.CreateAPIView):
    serializer_class = VeEmployeeSubmitSerializer
    permission_classes = [permissions.IsAuthenticated]

class UniqueDynamicFieldsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Fetch all fields ordered by lowercase label
        fields = VeDynamicFormField.objects.all().order_by(Lower('label'))

        seen = set()
        unique_labels = []
        for f in fields:
            label_lower = f.label.lower()
            if label_lower not in seen:
                unique_labels.append(f.label)
                seen.add(label_lower)

        return Response(unique_labels)
    

class EmployeeSearchAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request):
        serializer = VeEmployeeSearchSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        filters = serializer.validated_data.get('filters', {})
        keyword = serializer.validated_data.get('keyword', '').strip()
        employees = VeEmployee.objects.all().prefetch_related('field_values__form_field')

        if filters:
            q_objects = Q()
            for label, value in filters.items():
                q_objects &= Q(
                    field_values__form_field__label__iexact=label,
                    field_values__value__icontains=value
                )
            employees = employees.filter(q_objects).distinct()
        elif keyword:
            # search keyword in all field values
            employees = employees.filter(
                field_values__value__icontains=keyword
            ).distinct()

        # Prepare response
        results = []
        for emp in employees:
            results.append({
                "id": emp.id,
                "form": emp.form.name,
                "created_by": emp.created_by.username if emp.created_by else None,
                "created_at": emp.created_at,
                "fields": {fv.form_field.label: fv.value for fv in emp.field_values.all()}
            })

        return Response(results)
    
class EmployeeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = (
        VeEmployee.objects
        .select_related('form')
        .prefetch_related(
            'field_values__form_field__field_type'
        )
    )
    serializer_class = VeEmployeeSerializer
    # permission_classes = [permissions.IsAuthenticated]