
const token = localStorage.getItem('token') // Récupération


if(token){
////////////premiere modale////////////////////
const btnModalProjects = document.querySelector('#btnModalProjects')
btnModalProjects.addEventListener('click', () => {
    createProjectsModal()
})


const btnModalAcess = document.querySelector(".admin__modal__acess")
btnModalAcess.addEventListener('click', () => {
    createProjectsModal()
})



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
            modalRemoveBox.innerHTML=`<i class="fa-solid fa-trash-can fa-xs"><i>`
            newProject.appendChild(modalRemoveBox)

            const modalImage= document.createElement("img")
            modalImage.classList.add("modal__image")
            modalImage.setAttribute("src", work.imageUrl)
            modalImage.setAttribute("alt", work.title)
            newProject.appendChild(modalImage)
            
            modalGalerie.append(newProject)

            modalRemoveBox.addEventListener("click", () =>{
                fetch(`http://localhost:5678/api/works/${work.id}`,{
                    method:"DELETE",
                    headers:{
                        "Authorization": `Bearer ${token}`
                    }
                })
                .then(response => response.json())
                .then(data => {
                    console.log("élément supprimé avec succès", data);
                })
                .catch(error => {
                    console.log(error);
                })
            })

            
       

            // Mettre le listener pour supprimer un projet
            // Route sécurisé => donc on dois envoyer le token
            /*
            fetch(`http://localhost:5678/api/works/${work.id}`, {
                method: 'DELETE',
                headers: {Authorization: `Bearer ${token}`}
            })
            .then(resp => resp.json())
               */
        });
    })
    .catch((error) => console.log("erreur"));//autrement, afficher une erreur
}

            
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











    
////////////////deuxieme modal//////////////////////////////////////////

/**
 * Qu'es-ce que ça fais ?
 */
function createFormModal() {
    const chooseCategory = fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((categories) => {
        categories.forEach((filter) => {
          const selectCatgory = document.querySelector(".select__category")

          const createOption = document.createElement("option")
          createOption.setAttribute("value", filter.id)
          createOption.innerHTML=filter.name
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
        <div class="project__preview">

            <i class="fa-regular fa-image fa-2xl"></i>
            <input type="file" accept="image/*" id="load__image" class="input__load__image">
            <label for="load__image" class="modal__input__text">+ Ajouter photo </label>
            <p class="modal__input__size">jpg, png : 4mo max </p>

        </div>
        <form id="modalForm" class="modal__form">
            <label class="modal__form__label" for="modal__form__name">Titre</label>
            <input type="textaera" id="modal__form__name" class="modal__form__input">

            <label class="modal__form__label" for="modal__form__category">Categorie</label>

            <select id="modal__form__category" class="modal__form__input select__category">
            <option value=""></option>
            ${chooseCategory}<!--je fais venir la variable qui permet d'afficher les catégorie du tableau en backend-->
            </select>

            <input type="submit" value="Valider" class="modal__form__submit">
        </form> 

    </div>`; 

    document.body.append(modal)


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
            const createFigure = createFigureArray(works)
            const portfolioGallery = document.querySelector(".gallery")
            portfolioGallery.appendChild(createFigure)
            alert("Projet ajouté avec succès")
        })
        .catch(error => {
            console.log("erreur", error);
        })

    })

}



/*

TODO : 
- Terminer l'affichage de la première modal (avec projets)
- Terminer l'affichage de la seconde modale (avec formulaire + preview + les catégories (select) proviennent du serveur)
    -- Si tout est ok on fait le fetch pour créer un projet
    -- si l'un des champs est vide (title, catégorie, image) alors on affiche une erreur

<input type="file" accept="image/*" onchange="loadFile(event)">
<img id="output"/>
<script>
  var loadFile = function(event) {
    var reader = new FileReader();
    reader.onload = function(){
      var output = document.getElementById('output');
      output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  };
</script>

 */

}
