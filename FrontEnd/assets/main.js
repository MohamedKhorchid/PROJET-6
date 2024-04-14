//////////////////////////////////////RECUPERATION DES TRAVAUX DE L'ARCHITECTE///////////////////////////////
//cette variable permet de récupérer la div gallery que l'on a déjà en HTML
const portfolioGallery = document.querySelector(".gallery");


/*cette fonction permet de créer le tableau en utilisant les valeurs que l'on a récupéré avec fetch(), 
en se basant sur la structure initiale qu'on avait en HTML*/
function createFigureArray(works) {
    //déclaration de variables qui ne pourront être utilisées que dans la fonction
    const figure = document.createElement("figure");//création de la balise figure qui contiendra l'image et le sous-titre

    /*
figure.innerHTML = `
    <img src="${works.imageUrl}" alt="${works.title}" />
    <figcaption>Mon nom</figcaption>    
`
*/

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

    return figure;//affiche la balise figure sous sa forme finale, une fois complétée
}


//fetch permet de récuprer les travaux de l'architecte
fetch("http://localhost:5678/api/works")//lien vers l'emplacement des travaux en back-end via l'API
    .then((response) => response.json())//après récupération, on précise la nature de la réponse reçue
    .then((data) => { //ensuite on indique quoi faire des données
        data.forEach((works) => { //pour chaque données, lancer la fonction "works" qui lance les instructions suivantes :
            const figure = createFigureArray(works);// récupérer la balise figure que l'on a crée plus haut
            portfolioGallery.appendChild(figure);// ajouter cette balise en tant qu'enfant de la div gallery
        });
    })
    .catch((error) => console.log("erreur"));//autrement, afficher une erreur



//////////////////////////CREATION DIV DES FILTRES//////////////////////
const categoriesDiv = document.querySelector('.categories');


//////////////////////CREATION DES FILTRES POUR TRIER LES TRAVAUX DE L'ARCHITECTE/////////////////
function createFilters(filter) {

    const buttonFilter = document.createElement("button");
    buttonFilter.classList.add("categories__filter__style");
    buttonFilter.setAttribute("id", filter.id);
    buttonFilter.innerHTML = filter.name;

    categoriesDiv.appendChild(buttonFilter);

    buttonFilter.addEventListener("click", function() {
        fetch("http://localhost:5678/api/works")
            .then((response) => response.json())
            .then((data) => {
                data.forEach((works) => {
                    const figure = createFigureArray(works);
                    portfolioGallery.appendChild(figure);
                });
            })
            .catch((error) => console.log("erreur"));
        
        portfolioGallery.innerHTML = "";
        
        const figure = document.querySelector(".figure__project");

        const figureCatId = figure.getAttribute("category-id");
        


    })
    
    return buttonFilter;
}

//fetch permet de récupérer les catégories pour trier les travaux de l'architecte
fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((categories) => {
        categories.forEach((filter) => {
            createFilters(filter);
        });
    })
    .catch((error) => console.log("erreur"));



    /**
     * Quand je clique sur un bouton de filtre : 
     * --- Je vais chercher toutes les projets 
     * --- Je les parcours et ne garde que ceux qui on le bon categoryId
     * --- J'affiche tous les projets que j'ai sélectionné (bien penser à réinitialiser la div gallery => portfolioGallery.innerHTML = '')
     */
