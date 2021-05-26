const login = document.querySelector("#login-field");
login.value = sessionStorage.getItem("login");
login.disabled = true;

const password = document.querySelector("#pass-field");
const confirmedPass = document.querySelector("#conf-pass-field");

const form = document.querySelector("#pass-form");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (password.value != confirmedPass.value) {
        note.textContent = "Check your confirmed password";
        note.style.display = "block";
    }
    else {
        data = {
            login: sessionStorage.getItem("login"),
            password: confirmedPass.value
        }

        $.ajax({
            type: 'POST', url: 'http://localhost:5000/account/update-password', data: data
        }).done(() => {
            window.location.href = '/account/loginPage';
        });
    }
});