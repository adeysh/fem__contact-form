const form = document.getElementById("contact-form");
const textInputs = form.querySelectorAll("input[type='text'], input[type='email'], textarea");


function isAlphabetic(str) {
    return /^[a-zA-Z]+$/.test(str);
}

function validateEmail(email) {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function toggleError(container, errorId, show = true) {
    const errorEl = document.getElementById(errorId);
    if (!errorEl) return;

    if (show) {
        errorEl.classList.remove("sr-only");
        errorEl.classList.add("error-visible");
        container.classList.add("error-visible");
        container.setAttribute("aria-invalid", "true");
    } else {
        errorEl.classList.add("sr-only");
        errorEl.classList.remove("error-visible");
        container.classList.remove("error-visible");
        container.removeAttribute("aria-invalid");
    }
}

function validateTextField(input) {
    const field = input.id;
    const value = input.value.trim();
    let isValid = true;

    const errorId = `${field}-error`;
    // textarea does not have any pattern
    const hasPattern = (field === "first-name" || field === "last-name" || field === "email");
    const patternId = hasPattern ? `${field}-pattern` : null;
    const patternEl = hasPattern ? document.getElementById(patternId) : null;

    if (value === "") {
        toggleError(input, errorId, true);
        isValid = false;
    } else {
        toggleError(input, errorId, false);

        if (hasPattern) toggleError(input, patternId, false);

        if ((field === "first-name" || field === "last-name") && !isAlphabetic(value)) {
            toggleError(input, patternId, true);
            isValid = false;
        } else if (patternEl) {
            toggleError(input, patternId, false);
        }

        if (field === "email" && !validateEmail(value)) {
            toggleError(input, `email-pattern`, true);
            isValid = false;
        } else if (field === "email") {
            toggleError(input, `email-pattern`, false);
        }
    }
    return isValid;
}

// for [first-name, last-name, email, message] live validation
textInputs.forEach((input) => {
    input.addEventListener("blur", () => validateTextField(input));
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    let isValid = true;

    const requiredFields = ["first-name", "last-name", "email", "message"];

    // validate text input fields
    requiredFields.forEach((field) => {
        const input = document.getElementById(field);
        const value = data[field] || "";

        const errorId = `${field}-error`;
        const patternId = `${field}-pattern`;

        if (!value.trim()) {
            toggleError(input, errorId, true);
            isValid = false;
        } else {
            toggleError(input, errorId, false);

            if ((field === "first-name" || field === "last-name") && !isAlphabetic(value)) {
                toggleError(input, patternId, true);
                isValid = false;
            } else if (field === "email" && !validateEmail(value)) {
                toggleError(input, `email-pattern`, true);
                isValid = false;
            } else {
                if (document.getElementById(`${field}-pattern`)) {
                    toggleError(input, patternId, false);
                }
            }
        }
    });

    // validate radio (query-type)
    const queryTypeFieldset = document.querySelector("fieldset.radio-group-container");

    if (!data["query-type"]) {
        toggleError(queryTypeFieldset, "query-type-error", true);
        isValid = false;
    } else {
        toggleError(queryTypeFieldset, "query-type-error", false);
    }

    // validate checkbox (consent)
    const consentInput = document.getElementById("consent");

    if (!data["consent"]) {
        toggleError(consentInput, "consent-error", true);
        isValid = false;
    } else {
        toggleError(consentInput, "consent-error", false);
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