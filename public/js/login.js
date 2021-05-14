const form = document.getElementById("login-form");
form.addEventListener("submit", loginUser);
		
function loginUser(e) {
    e.preventDefault();
    const login = document.getElementById("login-field").value;
    const pwd = document.getElementById("pwd-field").value;
    
    data = {
        login: login,
        password: pwd
    };
    
    $.ajax({
        type: 'POST', url: 'http://localhost:5000/account/login', data: data
    }).done(res => {
        if (res.result == 1) {
            let obj = {
                full_name : res.data.full_name,
                userId : res.data.id,
                numTel  : res.data.telephone,
                email : res.data.email,
                role : res.data.role
            }
            sessionStorage.setItem("currentUser", JSON.stringify(obj));
            console.log(JSON.parse(sessionStorage.currentUser).userId);
            window.location.href = '/home';
        }
        
    });
}
