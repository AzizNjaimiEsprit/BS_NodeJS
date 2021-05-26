const passReset = document.querySelector("#forget_pass");
const login = document.getElementById("login-field");
let note = document.querySelector("#note");



passReset.addEventListener("click", event => {
    console.log(login.value);
    if (login == "") {
        note.textContent = "Would you please enter your login";
        note.style.display = "block";
    }else {
        data = {
            login: login.value
        }

        console.log(data);
        $.ajax({
            type: 'POST', url: 'http://localhost:5000/account/sendCode', data: data
        }).done(res =>  {
            if (res.result == 0) {
                note.textContent = res.message;
                note.style.display = "block";
            }
            else {
                sessionStorage.setItem("email", res.email);
                window.location.href = '/account/verif-code';
            }
        });
    }
});