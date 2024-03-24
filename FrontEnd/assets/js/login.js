
const formLogin = document.querySelector('#loginForm')
const inputPassword = document.querySelector('#input__password');
const inputEmail = document.querySelector("#input__mail");

const errorMail = document.querySelector("#inputEmailErrors");
errorMail.style.visibility = "hidden";

const errorPassword = document.querySelector("#inputPasswordErrors");
errorPassword.style.visibility = "hidden";



/**
 * Evènement de la soumission du formulaire
 * Attention, par défaut la soumission = changement de page
 */
formLogin.addEventListener('submit', (event) => {
    event.preventDefault(); // Empêche le comportement par default soit le rechargement de la page

    // Récupération des valeurs du formulaire
    const password = inputPassword.value;
    const email = inputEmail.value;
    
    /*let regex = new RegExp("^[a-z]$")
    let resultat = regex.test(password)*/

    let errorsFound = false;

    //Vérification du mail
    if(email === ''){
        // Affichage d'un message d'erreur concernant l'email
        errorsFound = true;
        errorMail.style.visibility = "visible";
    }

    // Vérification du mot de passe
    if(password === ''){
        // Affiche d'un message d'erreur concernant le mot passe
        errorsFound = true;
        errorPassword.style.visibility = "visible";
    }


    if(!errorsFound){
        fetch("http://localhost:5678/api/users/login", {
            method:"POST", 
            headers:{
                "Content-Type": "application/json"
            },            
            body:JSON.stringify({
                "email" : email,
                "password" : password
            })
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            localStorage.setItem('token', data.token)
            if (!data.token) {
                alert("erreur") 
            } else {
                location.href = "./index.html"
            }
            // Redirection vers la page d'accueil
        })
    }
})


