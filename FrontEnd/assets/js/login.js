const formLogin = document.querySelector('#loginForm')
const inputPassword = document.querySelector('#input__password');
const inputEmail = document.querySelector("#input__mail");


const errorPasswordEmailErrors = document.querySelector("#inputPasswordEmailErrors");
errorPasswordEmailErrors.style.visibility = "hidden";



formLogin.addEventListener('submit', (event) => {
    event.preventDefault();

    const password = inputPassword.value;
    const email = inputEmail.value;

    let errorsFound = false;

    if (email === '') {
        errorsFound = true;
        errorPasswordEmailErrors.style.visibility = "visible";
    }


    if (password === '') {
        errorsFound = true;
        errorPasswordEmailErrors.style.visibility = "visible";
    }


    if (!errorsFound) {
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        })
            .then(response => {
                return response.json()
            })
            .then(data => {
                localStorage.setItem('token', data.token)
                if (!data.token) {
                    errorPasswordEmailErrors.style.visibility = "visible"
                } else {
                    location.href = "./index.html"
                }
            })
    }
})


