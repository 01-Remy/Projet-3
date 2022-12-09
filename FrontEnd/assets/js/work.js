/**
 * Affichage et fitrage des différents travaux
 *
 * Auteur : Rémy Balland
 */

const gallery = document.getElementById("gallery");
const filtre = document.getElementById("filtre");

class Figure {
  constructor(imageUrl, title) {
    this.imageUrl = imageUrl;
    this.title = title;
  }

  build() {
    const newFigure = document.createElement("figure");
    const newImg = document.createElement("img");
    const newTitle = document.createElement("figcaption");

    /* fix pour le CORS error : a revoir, la methode est probablement mauvaise
    sans le replace : 
    
    La ressource à l’adresse « http://localhost:5678/images/appartement-paris-v1651287270508.png » a été bloquée en raison de son en-tête Cross-Origin-Resource-Policy (ou de son absence). 
    
    */
    newImg.src = this.imageUrl.replace("http://localhost:5678", "../Backend");

    newImg.alt = this.title;
    newTitle.innerText = this.title;

    newFigure.appendChild(newImg);
    newFigure.appendChild(newTitle);
    gallery.appendChild(newFigure);
  }
}

// supprime tous les enfants de l'element
function deleteChild(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}

// récupère les catégories et créer les boutons
function createBtn() {
  fetch("http://localhost:5678/api/categories")
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (categories) {
      for (let categ of categories) {
        const newCateg = document.createElement("li");
        newCateg.innerText = categ.name;
        filtre.appendChild(newCateg);

        newCateg.addEventListener("click", () => {
          deleteChild(gallery);
          createFigure(categ.id);
        });
      }
    })
    .catch((err) => console.log(err));

  // bouton "Tous"
  filtre.querySelector("li").addEventListener("click", () => {
    deleteChild(gallery);
    createFigure("all");
  });
}

// Recupère les travaux correspondant et les place dans un nouvel elem <figure>
function createFigure(id) {
  fetch("http://localhost:5678/api/works")
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (works) {
      if (id !== "all") {
        works = works.filter((work) => {
          return work.categoryId === id;
        });
      }

      for (let work of works) {
        const newWork = new Figure(work.imageUrl, work.title);
        newWork.build();
      }
    })
    .catch((err) => console.log(err));
}

createBtn();
createFigure("all");
