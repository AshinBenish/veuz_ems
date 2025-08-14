from django.shortcuts import render
from django.views.generic import TemplateView

class FrontendAppView(TemplateView):
    template_name = 'index.html'

class LoginView(TemplateView):
    template_name = 'login.html'

class RegistrationView(TemplateView):
    template_name = 'register.html'

class FormDesignerView(TemplateView):
    template_name = 'form_designer.html'

class FormListView(TemplateView):
    template_name = 'form_list.html'

class FormEditView(TemplateView):
    template_name = 'form_designer.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        form_id = self.kwargs.get('form_id')
        context['form_id'] = form_id
        return context
    
class EmployeeFormView(TemplateView):
    template_name = 'employee_create.html'

class EmployeeSearchView(TemplateView):
    template_name = 'employee_search.html'