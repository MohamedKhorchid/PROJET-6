//////////////////////////////////////RECUPERATION DES TRAVAUX DE L'ARCHITECTE///////////////////////////////
fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
        data.forEach((works) => {
            const createFigure = createFigureArray(works);
            portfolioGallery.appendChild(createFigure);
        });
    })
    .catch((error) => console.log("erreur"));



const portfolioGallery = document.querySelector(".gallery");


/**
 * Cette fontion permet de créer un projet (une figure) pour chacune des données du tableau "works"
 */
function createFigureArray(works) {
    const figure = document.createElement("figure");
    const figCaption = document.createElement("figcaption");
    const figImage = document.createElement("img");

    figImage.setAttribute("src", works.imageUrl);
    figImage.setAttribute("alt", works.title);
    figCaption.innerHTML = works.title;
    figure.setAttribute("data-id", works.id);
    figure.setAttribute("category-id", works.categoryId);
    figure.classList.add("figure__project");

    figure.appendChild(figImage);
    figure.appendChild(figCaption);

    return figure;
}



////////////////////////////////////////////////////////////RECUPERATION DIV DES FILTRES//////////////////////
const categoriesDiv = document.querySelector('.categories');



//////////////////////CREATION DES FILTRES POUR TRIER LES TRAVAUX DE L'ARCHITECTE/////////////////
fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((categories) => {
        categories.forEach((filter) => {
            createFilters(filter);
        });
    })
    .catch((error) => console.log("erreur"));



/**
 * Cette fonction créé un bouton pour chacune des données du tableau "filter". Au clic sur un bouton, un filtrage des projets a lieu.
 */
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

                    
                    const figureCategoryId = work.categoryId; 

                    if (filter.id === figureCategoryId) { 
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


/**
 * Cette fonction créé un bouton qui affiche tous les projets au clic.
 */
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
showAll()


const getToken = localStorage.getItem('token')
const loginButton = document.querySelector(".login__button")
if (getToken) {
    const createBuutonModal = document.createElement("button")
    createBuutonModal.setAttribute("id", "btnModalProjects")
    createBuutonModal.classList.add("open__modal__button")
    createBuutonModal.innerHTML = `<span class="admin__edition__access">
        <i class="fa-regular fa-pen-to-square"></i>
        Mode edition
        </span>`
    const btnModalProjectsBox = document.querySelector(".btn__modal__projects__box")
    btnModalProjectsBox.appendChild(createBuutonModal)


    const createSpanModal = document.createElement("span")
    createSpanModal.classList.add("admin__modal__acess")
    createSpanModal.innerHTML = `<i class="fa-regular fa-pen-to-square fa-square-h2"></i>
        Modifier`
    const portfolioH2 = document.querySelector("#portfolio h2")
    portfolioH2.appendChild(createSpanModal)

    loginButton.innerHTML = "logout"
    loginButton.addEventListener("click", () => {
        localStorage.removeItem("token")
    })
}

