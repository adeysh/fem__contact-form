const form = document.getElementById("contact-form");


function isAlphabetic(str) {
    return /^[a-zA-Z]+$/.test(str);
}

function validateEmail(email) {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    console.log(data);
    let isValid = true;

    for (const field in data) {
        const fieldValue = data[field];
        let input = null;

        if (field == 'query-type') {
            input = document.getElementById(fieldValue);
        } else {
            input = document.getElementById(field);
        }
        const errorEl = document.getElementById(`${field}-error`);

        if (!('query-type' in data)) {
            isValid = false;
            const errorEl = document.getElementById("query-type-error");
            errorEl.classList.remove("sr-only");
            errorEl.classList.add("error-visible");
            input.classList.add("error-visible");
            input.setAttribute("aria-invalid", "true");
        }

        if (!('consent' in data)) {
            isValid = false;
            const errorEl = document.getElementById("consent-error");
            errorEl.classList.remove("sr-only");
            errorEl.classList.add("error-visible");
            input.classList.add("error-visible");
            input.setAttribute("aria-invalid", "true");
        }



        if (fieldValue === '') {
            isValid = false;
            errorEl.classList.remove("sr-only");
            errorEl.classList.add("error-visible");
            input.classList.add("error-visible");
            input.setAttribute("aria-invalid", "true");
        } else {
            errorEl.classList.remove("error-visible");
            errorEl.classList.add("sr-only");
            input.classList.remove("error-visible");
            input.removeAttribute("aria-invalid");

            if (field === "first-name" || field === "last-name") {
                const isInputValid = isAlphabetic(fieldValue);
                const errorMessageEl = document.getElementById(`${field}-pattern`);
                if (!isInputValid) {
                    console.log(errorMessageEl);
                    errorMessageEl.classList.remove("sr-only");
                    errorMessageEl.classList.add("error-visible");
                    console.log(input);
                    input.classList.add("error-visible");
                    input.setAttribute("aria-invalid", "true");
                    isValid = false;
                } else {
                    errorMessageEl.classList.add("sr-only");
                    errorMessageEl.classList.remove("error-visible");
                    console.log(input);
                    input.classList.remove("error-visible");
                    input.removeAttribute("aria-invalid");
                }
            }

            if (field === "email") {
                const isEmailValid = validateEmail(fieldValue);
                const errorMessageEl = document.getElementById("email-pattern");

                if (!isEmailValid) {
                    errorMessageEl.classList.remove("sr-only");
                    errorMessageEl.classList.add("error-visible");

                    input.classList.add("error-visible");
                    input.setAttribute("aria-invalid", "true");
                    isValid = false;
                } else {
                    errorMessageEl.classList.add("sr-only");
                    errorMessageEl.classList.remove("error-visible");
                    console.log(input);
                    input.classList.remove("error-visible");
                    input.removeAttribute("aria-invalid");
                }
            }
        }
    }

    if (isValid) {
        showNotification();
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