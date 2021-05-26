const codeForm = document.querySelector("#pass_reset_form");
codeForm.addEventListener("submit", );

function verifCode (event) {
    event.preventDefault();
    const code = document.querySelector("#code-field");
    data = {
        email: sessionStorage.getItem("email"),
        code: code
    }
    $.ajax({
        type: "POST", url: "http://localhost:5000/account/verifCode", data: data
    }).done(res => {
        if (res.result == 1) {
            sessionStorage.setItem("login", res.login);
        } else {
            let note = document.querySelector("#note");
            note.textContent = "Wrong code !";
            note.style.display = "block";
        }
    });
}