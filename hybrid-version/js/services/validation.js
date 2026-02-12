/**
 * Form Validation Service (Hybrid Version)
 */

export function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
        const value = input.value.trim();
        const errorMsg = input.nextElementSibling;
        let fieldValid = true;

        if (!value) {
            fieldValid = false;
        } else if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) fieldValid = false;
        } else if (input.type === 'tel') {
            const phoneRegex = /^[\d\s\+\-\(\)]{7,}$/;
            if (!phoneRegex.test(value)) fieldValid = false;
        }

        if (!fieldValid) {
            input.classList.add('error');
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.style.display = 'block';
            }
            isValid = false;
        } else {
            input.classList.remove('error');
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.style.display = 'none';
            }
        }
    });

    return isValid;
}

export function initValidation() {
    console.log('🛡️ Validation initialized');

    // Auto-clear errors on input
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('error')) {
            e.target.classList.remove('error');
            const errorMsg = e.target.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.style.display = 'none';
            }
        }
    });
}
