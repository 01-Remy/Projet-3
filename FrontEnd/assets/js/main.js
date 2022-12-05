/**
 * Auteur : Rémy Balland
 */

const gallery = document.getElementById("gallery");

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
    sans le replace : La ressource à l’adresse « http://localhost:5678/images/appartement-paris-v1651287270508.png » a été bloquée en raison de son en-tête Cross-Origin-Resource-Policy (ou de son absence). */
    newImg.src = this.imageUrl.replace("http://localhost:5678", "../Backend");

    newImg.alt = this.title;
    newTitle.innerText = this.title;

    newFigure.appendChild(newImg);
    newFigure.appendChild(newTitle);
    gallery.appendChild(newFigure);
  }
}

// Recupère les travaux et les place dans un nouvel elem <figure>
fetch("http://localhost:5678/api/works")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (works) {
    console.log(works);
    for (let work of works) {
      const newWork = new Figure(work.imageUrl, work.title);
      newWork.build();
    }
  })
  .catch(function (err) {
    // Une erreur est survenue
  });

/**
 * TODO : - fetch categ
 *        - créer filtre
 */
