export function initValidation() {
    const fields = {
        'input-fullname': (val) => val.length >= 2,
        'input-phone': (val) => /^[\d\+\-\(\)\s]{6,}$/.test(val),
        'input-email': (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
    };

    Object.keys(fields).forEach(id => {
        const el = document.getElementById(id);
        const validate = () => validateField(el, fields[id]);
        el.addEventListener('input', validate);
        el.addEventListener('blur', validate);
    });
}

export function validateField(el, validator) {
    if (!validator) {
        if (el.name === 'fullname') validator = (val) => val.length >= 2;
        if (el.name === 'phone') validator = (val) => /^[\d\+\-\(\)\s]{6,}$/.test(val);
        if (el.name === 'email') validator = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }

    const isValid = validator(el.value);
    if (!isValid && el.value.length > 0) {
        el.classList.add('error');
    } else {
        el.classList.remove('error');
    }
    return isValid;
}
