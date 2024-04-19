const token = localStorage.getItem('token')


if (token) {
    const btnModalProjects = document.querySelector('#btnModalProjects')
    btnModalProjects.addEventListener('click', () => {
        createProjectsModal()
    })


    const btnModalAcess = document.querySelector(".admin__modal__acess")
    btnModalAcess.addEventListener('click', () => {
        createProjectsModal()
    })
}


/**
 * Cette fonction permet de remplir la première modale avec les projets, de créer une corbeille sur chacun de projets et de permettre
 * la suppression d'un projet au clic sur la corbeille.
 */
function fillModalWithProjects() {
    fetch("http://localhost:5678/api/works")
        .then((response) => response.json())
        .then((data) => {
            const modalGalerie = document.querySelector('.modal__galerie')

            data.forEach((work) => {
                const newProject = document.createElement('figure')
                newProject.classList.add('modal__figure')
                newProject.setAttribute("data-id", work.id);
                newProject.setAttribute("category-id", work.categoryId);

                const modalRemoveBox = document.createElement("div")
                modalRemoveBox.classList.add("modal__remove__box")
                modalRemoveBox.innerHTML = `<i class="fa-solid fa-trash-can fa-xs"><i>`
                newProject.appendChild(modalRemoveBox)

                const modalImage = document.createElement("img")
                modalImage.classList.add("modal__image")
                modalImage.setAttribute("src", work.imageUrl)
                modalImage.setAttribute("alt", work.title)
                newProject.appendChild(modalImage)

                modalGalerie.append(newProject)

                modalRemoveBox.addEventListener("click", () => {
                    fetch(`http://localhost:5678/api/works/${work.id}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    })
                        .then(response => response.json())
                        .then(data => {

                            // Supprimer la vignette sur la 1ère modal 
                            const vignette = document.querySelector(`.modal__figure[data-id="${work.id}"]`)
                            vignette.remove()

                            // Supprimer la vignette sur la modal d'accueil
                            const vignetteHome = document.querySelector(`.figure__project[data-id="${work.id}"]`)
                            vignetteHome.remove()

                            console.log("élément supprimé avec succès", data);
                        })
                        .catch(error => {
                            console.log(error);
                        })
                })
            });
        })
        .catch((error) => console.log("erreur"));
}


/**
 * Cette fonction permet de créer la structure de la première modale qui affiche les projets et permet la suppression ainsi que la
 * redirection vers la deuxième modale.
 */
function createProjectsModal() {
    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.innerHTML = `<div class="modal__content">
    <button class="modal__close__btn" id="btnModalClose"><i class ="fa-solid fa-xmark"></i></button>
    <h2 class="modal__title">Galerie Photo</h2>
    <div class="modal__galerie"></div>
    <button class="next__modal__btn" id="btnNextModal">Ajouter une photo</button>
    </div>`;

    document.body.append(modal)

    const btnClose = document.querySelector('#btnModalClose')
    btnClose.addEventListener('click', () => {
        modal.remove();
    })

    const btnNextModal = document.querySelector('#btnNextModal')
    btnNextModal.addEventListener('click', () => {
        modal.remove();
        createFormModal();
    })

    fillModalWithProjects()
}

let loadFile = function (event) {
    let reader = new FileReader()
    reader.onload = function () {
        let output = document.getElementById('output')
        output.setAttribute("src", reader.result)

        const label = document.querySelector(".modal__input__text")
        const inputSize = document.querySelector(".modal__input__size")
        label.style.visibility = "hidden"
        inputSize.style.visibility = "hidden"
        output.style.width = "129px"
        output.style.height = "100%"
    }
    reader.readAsDataURL(event.target.files[0])
}

/**
 * Cette fonction créé la structure de la deuxième modale qui permet d'ajouter un nouveau projet.
 */
function createFormModal() {
    const chooseCategory = fetch("http://localhost:5678/api/categories")
        .then((response) => response.json())
        .then((categories) => {
            categories.forEach((filter) => {
                const selectCatgory = document.querySelector(".select__category")

                const createOption = document.createElement("option")
                createOption.setAttribute("value", filter.id)
                createOption.innerHTML = filter.name
                selectCatgory.appendChild(createOption)
            });
        })
        .catch((error) => console.log("erreur"));


    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.innerHTML = `<div class="modal__content">
        <button class="modal__close__btn" id="btnModalClose"><i class ="fa-solid fa-xmark"></i></button>
        <button class="previous__modal__btn" id="btnPreviousModal"><i class="fa-solid fa-arrow-left fa-xl"></i></button>
        <h2 class="modal__title">Ajout photo</h2>
        <p class="modal__empty__file">Les champs sont manquants</p>
        <div class="project__preview">

            <img src="./assets/images/picture-svgrepo-com 1.jpg" id="output"/>
            <input type="file" accept="image/*" id="load__image" class="input__load__image" onchange="loadFile(event)">
            <label for="load__image" class="modal__input__text">+ Ajouter photo </label>
            <p class="modal__input__size">jpg, png : 4mo max </p>

        </div>
        <form id="modalForm" class="modal__form">
            <label class="modal__form__label" for="modal__form__name">Titre</label>
            <input type="textaera" id="modal__form__name" class="modal__form__input">

            <label class="modal__form__label" for="modal__form__category">Categorie</label>

            <select id="modal__form__category" class="modal__form__input select__category">
            ${chooseCategory}<!--je fais venir la variable qui permet d'afficher les catégorie du tableau en backend-->
            </select>

            <input type="submit" value="Valider" class="modal__form__submit">
        </form> 

    </div>`;

    document.body.append(modal)


    const modalEmptyFile = document.querySelector(".modal__empty__file")
    modalEmptyFile.style.visibility = "hidden"

    const btnClose = document.querySelector('#btnModalClose')
    btnClose.addEventListener('click', () => {
        modal.remove();
    })

    const btnPreviousModal = document.querySelector('#btnPreviousModal')
    btnPreviousModal.addEventListener('click', () => {
        modal.remove();
        createProjectsModal();
    })

    const modalFormAdd = document.querySelector("#modalForm")
    modalFormAdd.addEventListener("submit", (event) => {
        event.preventDefault()

        const projectTitle = document.querySelector(".modal__form__input")
        const projectTitleValue = projectTitle.value


        const projectCategory = document.querySelector(".select__category")
        const projectCategoryValue = projectCategory.value


        const projectImage = document.querySelector(".input__load__image")
        const projectImageValue = projectImage.files[0]


        const formData = new FormData(modalForm)
        formData.append("title", projectTitleValue)
        formData.append("category", projectCategoryValue)
        formData.append("image", projectImageValue)

        let emptyFile = false

        if(projectTitleValue === "") {
            emptyFile = true
            modalEmptyFile.style.visibility = "visible"
        }

        if(projectCategoryValue === "") {
            emptyFile = true
            modalEmptyFile.style.visibility = "visible"
        }

        if(projectImageValue === "") {
            emptyFile = true
            modalEmptyFile.style.visibility = "visible"
        }

        if(!emptyFile) {
            fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
                body: formData
            })
            .then((response => response.json()))
            .then(works => {

                // Ajout sur la page d'accueil <QUE SI la catégorie du projet est celle affichée sur l'accueil>
                const createFigure = createFigureArray(works)
                const portfolioGallery = document.querySelector(".gallery")
                portfolioGallery.appendChild(createFigure)

                // Fermer la modalForm et ouvrir la première modal
                modal.remove()
                createProjectsModal()
            })
            .catch(error => {
                console.log("erreur", error);
            })
        }

    })

}