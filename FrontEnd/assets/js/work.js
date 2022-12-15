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

    newImg.src = this.imageUrl;
    newImg.alt = this.title;
    newTitle.innerText = this.title;

    newFigure.appendChild(newImg);
    newFigure.appendChild(newTitle);
    gallery.appendChild(newFigure);
  }
}

// Crée les <figure> a partir d'un array
function createGallery(array) {
  for (let work of array) {
    const newWork = new Figure(work.imageUrl, work.title);
    newWork.build();
  }
}

// Supprime tous les enfants de l'element
function deleteChild(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}

// Retire la classe 'active' des boutons
function removeBtnActif() {
  const boutons = filtre.querySelectorAll("li");
  for (let btn of boutons) {
    btn.classList.remove("active");
  }
}

/**
 * Un seul appel par API et stockage résultats[]
 * Fitrage sur l'array stocké
 */

let worksArray = [];
let boutonsArray = [];

async function showWorks() {
  try {
    const res = await fetch("http://localhost:5678/api/categories");
    if (!res.ok) {
      return;
    }
    const categories = await res.json();
    boutonsArray = categories;
    boutonsArray.unshift({ id: 0, name: "Tous" });
  } catch (err) {
    console.log(err);
  }

  try {
    const res = await fetch("http://localhost:5678/api/works");
    if (!res.ok) {
      return;
    }
    const works = await res.json();
    worksArray = works;
  } catch (err) {
    console.log(err);
  }

  let x = 0;
  for (let bouton of boutonsArray) {
    const newCateg = document.createElement("li");
    newCateg.innerText = bouton.name;
    filtre.appendChild(newCateg);
    if (x === 0) {
      newCateg.classList.add("active");
      x = 1;
    }
    newCateg.addEventListener("click", () => {
      deleteChild(gallery);
      filterWorks(bouton.id);
      removeBtnActif();
      newCateg.classList.add("active");
    });
  }

  // Filtre et crée les <figures> en fonction de l'id
  function filterWorks(id) {
    if (id !== 0) {
      let WorksArrayFiltered = worksArray.filter((test) => {
        return test.categoryId === id;
      });
      createGallery(WorksArrayFiltered);
    } else {
      createGallery(worksArray);
    }
  }
  filterWorks(0);
}

showWorks();
