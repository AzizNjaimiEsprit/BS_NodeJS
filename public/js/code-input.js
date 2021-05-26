function hideEmail(email) {
    var subs = email.substring(0, email.indexOf("@"));
    var rest = email.substring(email.indexOf("@"), email.length);
    var s = "";
    for (var i = 4; i < subs.length; i++) s += "*"; 
    return subs.substring(0, 4) + s + rest;
}

const code = document.querySelector("#code-field");
const target = document.querySelector(".email-target");
target.textContent = "An email containing verification code has been sent to : " + hideEmail(sessionStorage.getItem('email'));

const form = document.querySelector("#code-form");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    data = {
        email: sessionStorage.getItem('email'),
        code: code.value
    }
    $.ajax({
        type: 'POST', url: 'http://localhost:5000/account/verifyCode', data: data
    }).done(response => {
        if (response.result == 0) {
            note.textContent = "Wrong !! please verify your email again";
            note.style.display = "block";
        }
        else {
            sessionStorage.removeItem('email');
            sessionStorage.setItem("login", response.login);
            window.location.href = '/account/change-password';
        }
    });
});
