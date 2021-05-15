/*
function proposeLogIn(text) {
    const words = text.split(" ");

    words.map((word) => { 
        return word[0].toUpperCase() + word.substring(1); 
    }).join(" ");
}

$("#fullname-field").on('change', function() {
    let text = $(this).val();
    $("#prop").text('You can use : ' + text);
    $("#prop").css("display", "block");
});

*/


const form = document.querySelector("#register-form");
form.addEventListener('submit', registerUser);

function registerUser(event) {
    event.preventDefault();
    const fullName = document.getElementById("fullname-field").value;
    const login = document.getElementById("login-field").value;
    const email = document.getElementById("email-field").value;
    const phoneNumber = document.getElementById("phone-field").value;
    const pwd = document.getElementById("pwd-field").value;

    const data = {
        fullName: fullName,
        email: email,
        phoneNumber: phoneNumber,
        login: login,
        password: pwd,
        role: 0,
        adress: null,
        zipCode: 0
    }

    $.ajax({
        type: 'POST',
        url: 'http://localhost:5000/account/registerUser',
        data: data
    }).done(res => {
        alert(res);
        window.location.href = '/account';
    });
}

