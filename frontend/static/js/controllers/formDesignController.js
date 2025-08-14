app.controller('formDesignController', ['$scope', 'ApiService', 'ToastService', '$timeout', function ($scope, ApiService, ToastService, $timeout) {
    $scope.getFieldTyeps = function () {
        ApiService.getFieldTypes().then(function (response) {
            $scope.fieldTypes = response.data;
        }).catch(function (error) {
            console.log(error);
        }).finally(function () {
            // isFormEdit and formId variables are declared in html file
            if ($scope.isFormEdit) {
                $scope.fetchFormData();
            }
        })
    }

    $scope.fields = [
        // { label: 'Full Name', placeholder: 'Enter Values', type: '1', type_name: 'text', required: true, order: 1 },
        // { label: 'Email Address', placeholder: 'Enter Values', type: '3', type_name: 'email', required: true, order: 2 },
        // { label: 'Phone Number', placeholder: 'Enter Values', type: '6', type_name: 'phone', required: false, order: 3 }
    ];

    $scope.removeField = function (index) {
        $scope.fields.splice(index, 1);
        updateOrder();
    };

    function updateOrder() {
        $scope.fields.forEach(function (field, index) {
            field.order = index + 1;
        });
    }

    $scope.updateFieldTypeName = function (field) {
        var type_name = $scope.fieldTypes.find(data => data.id == field.field_type);
        field.type_name = type_name ? type_name.name : '';
    }

    $timeout(function () {
        new Sortable(document.getElementById('field-list'), {
            animation: 150,
            onEnd: function (evt) {
                const movedItem = $scope.fields.splice(evt.oldIndex, 1)[0];
                $scope.fields.splice(evt.newIndex, 0, movedItem);
                updateOrder();
                $scope.$apply();
            }
        });
    });

    $scope.addField = function () {
        let missingFields = [];
        if (!$scope.field_label) missingFields.push('Field label');
        if (!$scope.field_type) missingFields.push('Field type');

        if (missingFields.length) {
            ToastService.show('error', `${missingFields.join(' and ')} ${missingFields.length > 1 ? 'are' : 'is'} required.`);
            return;
        }

        var type_name = $scope.fieldTypes.find(data => data.id == $scope.field_type);
        $scope.fields.push({
            label: $scope.field_label,
            field_type: $scope.field_type,
            type_name: type_name ? type_name.name : '',
            required: $scope.field_is_required === 'true' ? true : false,
            placeholder: $scope.field_placeholder,
            order: $scope.fields.length + 1
        })
        $scope.field_label = null;
        $scope.field_type = null;
        $scope.field_placeholder = null;
        $scope.field_is_required = 'true';
    }

    $scope.saveForm = function () {
        if (!$scope.form_name) {
            ToastService.show('error', 'Form name is required.');
            return;
        }

        if (!$scope.fields.length) {
            ToastService.show('error', 'Form fields are required.');
            return;
        }
        var payload = {
            name: $scope.form_name,
            description: $scope.form_description,
            fields: $scope.fields
        }

        if ($scope.isFormEdit) {
            $scope.updateForm(payload);
            return;
        }

        ApiService.createForm(payload).then(function (response) {
            ToastService.show('success', 'Form created successfully.');
            $scope.form_name = null;
            $scope.form_description = null;
            $scope.fields = [];
            $timeout(function () {
                window.location = '/forms/list';
            }, 1000);
        }).catch(function (error) {
            console.log(error);
            ToastService.show('error', 'Something went wrong.');
        }).finally(function () {
        })
    }

    $scope.updateForm = function (payload) {
        ApiService.updateForm($scope.formId, payload).then(function (response) {
            ToastService.show('success', 'Form updated successfully.');
            $timeout(function () {
                window.location = '/forms/list';
            }, 1000);
        }).catch(function (error) {
            if (error.data && Array.isArray(error.data) && typeof error.data[0] === 'string') {
                ToastService.show('error', error.data[0]);
            } else {
                ToastService.show('error', 'Something went wrong.');
            }
        }).finally(function () {
        })
    }

    $scope.setForm = function () {
        if (!$scope.fields) return;

        $scope.fields.forEach(function (field) {
            $scope.updateFieldTypeName(field);
        });
    }

    $scope.fetchFormData = function () {
        ApiService.getFormData($scope.formId).then(function (response) {
            $scope.formData = response.data;
            if (!$scope.formData || !$scope.formData.fields.length) {
                ToastService.show('error', 'No data found.');
                return;
            }
            $scope.form_name = $scope.formData.name;
            $scope.form_description = $scope.formData.description;
            $scope.fields = $scope.formData.fields;
            $scope.setForm();
        }).catch(function (error) {
            ToastService.show('error', 'Something went wrong.');
        }).finally(function () {
        })
    }

    $scope.field_label = null;
    $scope.field_type = null;
    $scope.field_placeholder = null;
    $scope.field_is_required = 'true';
    $scope.formData = [];
    $scope.isFormEdit = isFormEdit;
    $scope.formId = formId;

    $scope.getFieldTyeps();
}]);