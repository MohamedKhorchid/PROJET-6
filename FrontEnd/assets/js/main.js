//////////////////////////////////////RECUPERATION DES TRAVAUX DE L'ARCHITECTE///////////////////////////////


//fetch permet de récuprer les travaux de l'architecte
fetch("http://localhost:5678/api/works")//lien vers l'emplacement des travaux en back-end via l'API
    .then((response) => response.json())//après récupération, on précise la nature de la réponse reçue
    .then((data) => { //ensuite on indique quoi faire des données
        data.forEach((works) => { //pour chaque données, lancer la fonction "works" qui lance les instructions suivantes :
            const createFigure = createFigureArray(works);// récupérer la balise figure que l'on a crée plus haut
            portfolioGallery.appendChild(createFigure);// ajouter cette balise en tant qu'enfant de la div gallery
        });
    })
    .catch((error) => console.log("erreur"));//autrement, afficher une erreur


//cette variable permet de récupérer la div gallery que l'on a déjà en HTML
const portfolioGallery = document.querySelector(".gallery");


/*
 * cette fonction permet de créer le tableau en utilisant les valeurs que l'on a récupéré avec fetch(), 
 * en se basant sur la structure initiale qu'on avait en HTML
 */
function createFigureArray(works) {
    //déclaration de variables qui ne pourront être utilisées que dans la fonction
    const figure = document.createElement("figure");//création de la balise figure qui contiendra l'image et le sous-titre
    const figCaption = document.createElement("figcaption");//création de la balise figcaption qui contiendra le sous-titre
    const figImage = document.createElement("img");//création de la balise img qui contiendra les images

    figImage.setAttribute("src", works.imageUrl);//création d'un attribut source pour chaque image, 
    figImage.setAttribute("alt", works.title);//création d'un attribut alt pour chaque image
    figCaption.innerHTML = works.title;//création du texte sous-titre des photos
    figure.setAttribute("data-id", works.id);//création d'un attribut data-id pour chaque figure
    figure.setAttribute("category-id", works.categoryId);//création d'un attribut category-id pour chaque figure
    figure.classList.add("figure__project");

    figure.appendChild(figImage);//placement de l'image comme premier enfant de la balise figure
    figure.appendChild(figCaption);//placement de la description comme deuxième enfants de la balise figure

    return figure;
}



////////////////////////////////////////////////////////////RECUPERATION DIV DES FILTRES//////////////////////
/*const categoriesDiv = document.createElement ('div')
categoriesDiv.classList.add('categoriex')*/
const categoriesDiv = document.querySelector('.categories');



//////////////////////CREATION DES FILTRES POUR TRIER LES TRAVAUX DE L'ARCHITECTE/////////////////

//fetch permet de récupérer les catégories pour trier les travaux de l'architecte
fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((categories) => {
        categories.forEach((filter) => {
            createFilters(filter);
        });
    })
    .catch((error) => console.log("erreur"));


function createFilters(filter) {

    const buttonFilter = document.createElement("button");
    buttonFilter.classList.add("categories__filter__style");
    buttonFilter.setAttribute("id", filter.id);
    buttonFilter.innerHTML = filter.name;

    categoriesDiv.appendChild(buttonFilter);

    buttonFilter.addEventListener("click", function () {
        fetch("http://localhost:5678/api/works")
            .then((response) => response.json())
            .then((data) => {
                data.forEach((work) => {

                    //const buttonFilterId = buttonFilter.getAttribute("id"); // id_A du bouton catégorie
                    const figureCategoryId = work.categoryId; // id_B du projet dans la boucle foreach

                    if (filter.id === figureCategoryId) { // si id_A === id_B alors on créer l'affichage du projet
                        const figure = createFigureArray(work);
                        portfolioGallery.appendChild(figure);
                    } 
                });
            })
            .catch((error) => console.log("erreur"));

        portfolioGallery.innerHTML = "";
    })

    return buttonFilter;
}

function showAll() {
    const allButtonFilter = document.createElement("button")
    allButtonFilter.classList.add("categories__filter__style")
    allButtonFilter.innerHTML = "Tous"
    categoriesDiv.appendChild(allButtonFilter)

    allButtonFilter.addEventListener("click", () => {

        fetch("http://localhost:5678/api/works")
            .then((response) => response.json())
            .then((data) => {
                data.forEach((works) => {
                    const figure = createFigureArray(works)
                    portfolioGallery.appendChild(figure)
                });
            })
            .catch((error) => console.log("erreur"));/*si erreur afficher erreur sur la consol(f12)*/
            portfolioGallery.innerHTML = "";
    })
}
showAll()/**J'appel la fonction que je viens de créer pour faire apparitre le bouton créer en js pour afficher toute les figures*/


const getToken =  localStorage.getItem('token')
const loginButton = document.querySelector(".login__button")
    if (getToken){
        const createBuutonModal = document.createElement("button")
        createBuutonModal.setAttribute("id", "btnModalProjects")
        createBuutonModal.classList.add("open__modal__button")
        createBuutonModal.innerHTML=`<span class="admin__edition__access">
        <i class="fa-regular fa-pen-to-square"></i>
        Mode edition
        </span>`
        const btnModalProjectsBox= document.querySelector(".btn__modal__projects__box")
        btnModalProjectsBox.appendChild(createBuutonModal)


        const createSpanModal = document.createElement("span")
        createSpanModal.classList.add("admin__modal__acess")
        createSpanModal.innerHTML=`<i class="fa-regular fa-pen-to-square fa-square-h2"></i>
        Modifier`
        const portfolioH2 = document.querySelector("#portfolio h2")
        portfolioH2.appendChild(createSpanModal)

        loginButton.innerHTML = "logout"
        loginButton.addEventListener("click", () => {
            localStorage.removeItem("token")
        })
    }




/**
 * Quand je clique sur un bouton de filtre : 
 * --- Je vais chercher toutes les projets 
 * --- Je les parcours et ne garde que ceux qui on le bon categoryId
 * --- J'affiche tous les projets que j'ai sélectionné (bien penser à réinitialiser la div gallery => portfolioGallery.innerHTML = '')
 */
/*
const chaine = "cachalot"
let regex = new RegExp ("a-z")*/