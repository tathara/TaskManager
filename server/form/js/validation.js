const form = document.querySelector('form');

form.addEventListener('submit', e => {
    e.preventDefault();

    if (isValidData()) {
        console.log('Form is valid. Submitting...');
        form.submit();
    }
    else {
        console.log('Form is unvalid!');
    }
});

function isValidData() {
    const fields = form.querySelectorAll('input, select, textarea');
    const isValid = getValidationStatus(fields);

    return isValid;
};

function getValidationStatus(fields) {
    const validationStatus = Array.from(fields).map(field => {
        const fieldName = field.getAttribute('name');
        const fieldValue = field.value.trim();

        switch (fieldName) {
            case 'fullName':
                return isValidName(field, fieldValue);
            case 'login':
                return isValidAlphanumeric(field, fieldValue);
            case 'organization':
                return isValidOrganization(field, fieldValue);
            case 'role':
                return isValidRole(field, fieldValue);
            case 'password':
                return isValidPassword(field, fieldValue);
            case 'password-validation':
                return isValidPasswordValidation(field, fieldValue);
        }
    });

    const isValid = validationStatus.every(status => {
        return status;
    });

    return isValid;
}

function isValidName(field, value) {
    let isValid;
    const nameRegex = /^[a-zA-Zа-яА-Я\s]+$/;

    if (value === '') {
        isValid = setError(field, 'Введите вашу фамилию и имя!');
    } else if (!nameRegex.test(value)) {
        isValid = setError(field, 'Имя и фамилия не должны содержать цифры или знаки препинания!');
    } else {
        isValid = setSuccess(field);
    }

    return isValid;
};

function isValidAlphanumeric(field, value) {
    let isValid;
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;

    if (value === '') {
        isValid = setError(field, 'Введите логин!');
    } else if (!alphanumericRegex.test(value)) {
        isValid = setError(field, 'Логин должен состоять только из букв и цифр!');
    } else {
        isValid = setSuccess(field);
    }

    return isValid;
};

function isValidOrganization(field, value) {
    let isValid;
    const organizationRegex = /^[a-zA-Zа-яА-Я0-9.\-\s]+$/;

    if (value === '') {
        isValid = setError(field, 'Введите организацию!');
    } else if (!organizationRegex.test(value)) {
        isValid = setError(field, 'Название организации может только состоять из букв, цифр, точек и тире!');
    } else {
        isValid = setSuccess(field);
    }

    return isValid;
};

function isValidRole(field, value) {
    let isValid;
    const roleRegex = /^[a-zA-Zа-яА-Я.\-\s]+$/;

    if (value === '') {
        isValid = setError(field, 'Введите роль!');
    } else if (!roleRegex.test(value)) {
        isValid = setError(field, 'Роль должна состоять только из букв, точек и тире!');
    } else {
        isValid = setSuccess(field);
    }

    return isValid;
};

function isValidPassword(field, value) {
    let isValid;
    const passwordRegex = /^[a-zA-Z0-9]+$/;

    if (value === '') {
        isValid = setError(field, 'Введите пароль!');
    } else if (value.length < 8) {
        isValid = setError(field, 'Пароль должен содержать минимум 8 символов!');
    } else if (!passwordRegex.test(value)) {
        isValid = setError(field, 'Пароль должен состоять только из букв и цифр!');
    } else {
        isValid = setSuccess(field);
    }

    return isValid;
};

function isValidPasswordValidation(field, value) {
    let isValid;
    const passwordValue = form.querySelector('[name="password"]').value.trim();

    if (value === '') {
        isValid = setError(field, 'Подтвердите пароль!');
    } else if (value !== passwordValue) {
        isValid = setError(field, 'Пароли не совпадают!');
    } else {
        isValid = setSuccess(field);
    }

    return isValid;
};

function setError(element, message) {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');

    const isValid = false;

    return isValid;
};

function setSuccess(element) {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');

    const isValid = true;

    return isValid;
};