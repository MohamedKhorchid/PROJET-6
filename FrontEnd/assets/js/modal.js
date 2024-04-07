if(getToken) {
    const openModalButton = document.querySelector(".open__modal__button")
    openModalButton.addEventListener("click", function () {
        firstModal()
    })

    const openModalSpan = document.querySelector(".admin__modal__acess")
    openModalSpan.addEventListener("click", function () {
        firstModal()
    })
}

function firstModal() {
    const modal = document.createElement("div")
    modal.classList.add("modal")
    modal.innerHTML = 
        `<div class="modal__content">
            <button class="modal__close__btn">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <h2 class="modal__title">Galerie Photo</h2>
            <div class="modal__galerie">
            </div>    
            <button class="next__modal__btn" id="btnNextModal">Ajouter une photo</button>
        </div>`

    document.body.append(modal)

    const modalCloseButton = document.querySelector(".modal__close__btn")
    modalCloseButton.addEventListener("click", function () {
        modal.remove()
    })

    const nextModalButton = document.querySelector(".next__modal__btn")
    nextModalButton.addEventListener("click", function () {
        modal.remove()
        secondModal()
    })

    fillModalWithProjects()
}

function fillModalWithProjects() {
    fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then((data) => {
        data.forEach(works => {
            const modalFigure = document.createElement("figure")
            modalFigure.classList.add("modal__figure")
            modalFigure.setAttribute("data-id", works.id)
            modalFigure.setAttribute("category-id", works.categoryId)

            const modalRemoveBox = document.createElement("div")
            modalRemoveBox.classList.add("modal__remove__box")
            modalRemoveBox.innerHTML = 
                `<i class="fa-solid fa-trash-can fa-xs"></i>`
            modalFigure.appendChild(modalRemoveBox)

            const modalFigImage = document.createElement("img")
            modalFigImage.classList.add("modal__image")
            modalFigImage.setAttribute("src", works.imageUrl)
            modalFigImage.setAttribute("alt", works.title)
            modalFigure.appendChild(modalFigImage)

            const modalGalerie = document.querySelector(".modal__galerie")
            modalGalerie.appendChild(modalFigure)

            modalRemoveBox.addEventListener("click", function () {
                deleteProject(works)
            })
        })
    })
    .catch(error => console.log(error))
}

function deleteProject(works) {
    fetch(`http://localhost:5678/api/works/${works.id}`, {
        method: "DELETE", 
        headers: {
            "Authorization": `Bearer ${getToken}`
        }
    })
    .then(response => response.json())
    .then((data) => {
        console.log("élément supprimé avec succès", data)
    })
    .catch(error => console.log(error))
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function fetchCategoriesOptionFromApi() {
    fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then((categories) => {
        categories.forEach(filter => {
            const selectCategory = document.querySelector(".select__category")

            const optionForm = document.createElement("option")
            optionForm.setAttribute("value", filter.id)
            optionForm.innerHTML = filter.name
            selectCategory.appendChild(optionForm)
        })
    })
    .catch(error => console.log(error))
}

function secondModal() {
    const modal = document.createElement("div")
    modal.classList.add("modal")
    modal.innerHTML = 
        `<div class="modal__content">
            <button class="modal__close__btn">
                <i class ="fa-solid fa-xmark"></i>
            </button>
            <button class="previous__modal__btn">
                <i class="fa-solid fa-arrow-left fa-xl"></i>
            </button>
            <h2 class="modal__title">Ajout photo</h2>
            <div class="project__preview">
                <img src="../FrontEnd/assets/images/picture-svgrepo-com 1.jpg" id="output"/>
                <input type="file" accept="image/*" id="load__image" class="input__load__image" onchange="loadFile(event)">
                <label for="load__image" class="modal__input__text">+ Ajouter photo </label>
                <p class="modal__input__size">jpg, png : 4mo max </p>
            </div>
            <form id="modalForm" class="modal__form">
                <label class="modal__form__label" for="modal__form__name">Titre</label>
                <input type="textaera" id="modal__form__name" class="modal__form__input">

                <label class="modal__form__label" for="modal__form__category">Categorie</label>

                <select id="modal__form__category" class="modal__form__input select__category">
                ${fetchCategoriesOptionFromApi()}<!--je fais venir la fonction qui permet d'afficher les catégorie du tableau en backend-->
                </select>

                <input type="submit" value="Valider" class="modal__form__submit">
            </form> 
        </div>`
    
    document.body.append(modal)

    const modalCloseButton = document.querySelector(".modal__close__btn")
    modalCloseButton.addEventListener("click", function () {
        modal.remove()
    })

    const nextModalButton = document.querySelector(".previous__modal__btn")
    nextModalButton.addEventListener("click", function () {
        modal.remove()
        firstModal()
    })

    const modalForm = document.querySelector(".modal__form")
    modalForm.addEventListener("submit", function () {
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

        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getToken}`,
                "Accept": "application/json"
            },
            body: formData
        })
        .then(response => response.json())
        .then(works => {
                createFigureArray(works)
            })
        .catch(error => console.log("une erreur est apparue"))
    })
}

function loadFile(event) {
    let reader = new FileReader()
    reader.onload = function() {
        let output = document.getElementById("output")
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