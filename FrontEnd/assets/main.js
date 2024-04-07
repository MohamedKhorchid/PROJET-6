const gallery = document.querySelector(".gallery")

/**Cette fonction permet de créer la structure d'une figure et d'en faire un enfant de la galerie
*/
function createFigureArray(works) {
    const figure = document.createElement("figure")
    const figCaption = document.createElement("figcaption")
    const figImage = document.createElement("img")

    figImage.setAttribute("src", works.imageUrl)
    figImage.setAttribute("alt", works.title)
    figCaption.innerHTML = works.title
    figure.setAttribute("data-id", works.id)
    figure.setAttribute("category-id", works.categoryId)
    figure.classList.add("figure__project")

    figure.appendChild(figImage)
    figure.appendChild(figCaption)

    gallery.appendChild(figure)

    return figure
}


/**Cette fonction lance le fetch pour récupérer les projets de l'API et lance la fonction de création d'une figure pour chaque projet
 * récupéré
 */
function fetchProjectsFromApi() {
    fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then((data) => {
        data.forEach(works => {
            createFigureArray(works)
        });
    })
}

fetchProjectsFromApi()


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const divCategories = document.querySelector(".categories")

/**Cette fonction créé la structure des boutons de filtres puis, au clic sur un bouton, on lance un fetch pour récupérer les projets de
 * l'API.
 * On utilise une condition : pour chaque projet récupéré, on compare la catégorie d'id du projet à celle du bouton, et si les valeurs
 * sont exactement égales, on lance la focntion qui créé une figure
 */
function createFilter(filter) {
    const buttonFilter = document.createElement("button")
    buttonFilter.classList.add("categories__filter__style")
    buttonFilter.setAttribute("id", filter.id)
    buttonFilter.innerHTML = filter.name 

    divCategories.appendChild(buttonFilter)

    buttonFilter.addEventListener("click", function () {
        fetch("http://localhost:5678/api/works")
        .then(response => response.json())
        .then((data) => {
            data.forEach(works => {
                const figureCategoryId = works.categoryId

                if(figureCategoryId === filter.id) {
                    createFigureArray(works)
                }
            })
        })
        .catch(error => console.log(error))

        gallery.innerHTML = "" 
    })
}

/**Cette fonction récupère les catégories de l'API et lance pour chacune la fonction permettant de créer un bouton
*/
function fetchCategoriesFromApi() {
    fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then((categories) => {
        categories.forEach(filter => {
            createFilter(filter)
        })
    })
}

fetchCategoriesFromApi()


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**Cette focntion créé un bouton "tous" qui lance le fetch permettant d'afficher tous les projets au clic
*/
function showAll() {
    const allButtonFilter = document.createElement("button")
    allButtonFilter.classList.add("categories__filter__style")
    allButtonFilter.innerHTML = "Tous"
    divCategories.appendChild(allButtonFilter)

    allButtonFilter.addEventListener("click", function () {
        fetchProjectsFromApi()
        gallery.innerHTML = ""
    })
}

showAll()


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const getToken = localStorage.getItem("token")
const loginButton = document.querySelector(".login__button")
const buttonModalProjectsBox = document.querySelector(".btn__modal__projects__box")
const portfolioH2 = document.querySelector("#portfolio h2")

if(getToken) {
    const openModalButton = document.createElement("button")
    openModalButton.classList.add("open__modal__button")
    openModalButton.innerHTML = 
        `<span class="admin__edition__access">
            <i class="fa-regular fa-pen-to-square"></i>
            Mode édition
        </span>`
    buttonModalProjectsBox.appendChild(openModalButton)


    const openModalSpan = document.createElement("span")
    openModalSpan.classList.add("admin__modal__acess")
    openModalSpan.innerHTML = 
        `<i class="fa-regular fa-pen-to-square fa-square-h2"></i>
        Modifier`
    portfolioH2.appendChild(openModalSpan)


    loginButton.innerHTML = "logout"
    loginButton.addEventListener("click", function () {
        localStorage.removeItem("token")
    })
}