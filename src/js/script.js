const form = document.getElementById("contact-form");
const inputs = form.querySelectorAll("input[type='text'], input[type='email']");

function isAlphabetic(str) {
    return /^[a-zA-Z]+$/.test(str);
}

function validateEmail(email) {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function showError(container, errorId) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
        errorEl.classList.remove("sr-only");
        errorEl.classList.add("error-visible");
    }
    container.classList.add("error-visible");
    container.setAttribute("aria-invalid", "true");
}

function hideError(container, errorId) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
        errorEl.classList.add("sr-only");
        errorEl.classList.remove("error-visible");
    }
    container.classList.remove("error-visible");
    container.removeAttribute("aria-invalid");
}

function validateField(input) {
    const field = input.id;
    const value = input.value.trim();
    let isValid = true;

    const errorId = `${field}-error`;
    const patternId = `${field}-pattern`;
    const patternEl = document.getElementById(patternId);

    if (value === "") {
        showError(input, errorId);
        isValid = false;
    } else {
        hideError(input, patternId);
        hideError(input, errorId);

        if ((field === "first-name" || field === "last-name") && !isAlphabetic(value)) {
            showError(input, patternId);
            isValid = false;
        } else if (patternEl) {
            hideError(input, patternId);
        }

        if (field === "email" && !validateEmail(value)) {
            showError(input, `email-pattern`);
            isValid = false;
        } else if (field === "email") {
            hideError(input, `email-pattern`);
        }
    }

    return isValid;

}

inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    let isValid = true;

    const requiredFields = ["first-name", "last-name", "email", "message"];

    requiredFields.forEach((field) => {
        const input = document.getElementById(field);
        const value = data[field] || "";

        if (!value.trim()) {
            showError(input, `${field}-error`);
            isValid = false;
        } else {
            hideError(input, `${field}-error`);

            if ((field === "first-name" || field === "last-name") && !isAlphabetic(value)) {
                showError(input, `${field}-pattern`);
                isValid = false;
            } else if (field === "email" && !validateEmail(value)) {
                showError(input, `email-pattern`);
                isValid = false;
            } else {
                if (document.getElementById(`${field}-pattern`)) {
                    hideError(input, `${field}-pattern`);
                }
            }
        }
    });

    // validate radio (query-type)
    const queryTypeFieldset = document.querySelector("fieldset.radio-group-container");

    if (!data["query-type"]) {
        showError(queryTypeFieldset, "query-type-error");
        isValid = false;
    } else {
        hideError(queryTypeFieldset, "query-type-error");
    }

    // validate checkbox (consent)
    const consentInput = document.getElementById("consent");
    if (!data["consent"]) {
        showError(consentInput, "consent-error");
        isValid = false;
    } else {
        hideError(consentInput, "consent-error");
    }

    if (isValid) {
        showNotification();
        form.reset();
    }
});

function showNotification() {
    const toast = document.querySelector(".contact-form-success");
    toast.classList.add("visible");
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
        toast.classList.remove("visible");
    }, 2000);
}