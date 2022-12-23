/**
 * Affichage et fitrage des différents travaux
 *
 * Auteur : Rémy Balland
 */

const filtre = document.getElementById("filtre");

class Figure {
  constructor(imageUrl, title) {
    this.imageUrl = imageUrl;
    this.title = title;
  }

  build(galleryName) {
    let newFigure;
    let gallery;
    let descriptionElem = "";
    let descriptionContent = "";
    switch (galleryName) {
      case "main":
        newFigure = document.createElement("figure");
        gallery = document.getElementById("gallery");
        descriptionElem = "figcaption";
        descriptionContent = this.title;
        break;
      case "modal":
        newFigure = document.createElement("li");
        gallery = document.getElementById("modal-list");
        descriptionElem = "p";
        descriptionContent = "Éditer";
        createModalSpan(newFigure);
        break;
      default:
        break;
    }

    createImg(this.imageUrl, this.title, newFigure);
    createDescription(descriptionElem, descriptionContent, newFigure);
    gallery.appendChild(newFigure);
  }
}

function createImg(url, title, parent) {
  const img = document.createElement("img");
  img.src = url;
  img.alt = title;
  img.innerText = title;
  parent.appendChild(img);
}

function createDescription(elemName, content, parent) {
  const description = document.createElement(elemName);
  description.innerText = content;
  parent.appendChild(description);
}

function createGallery(array, galleryName) {
  for (let work of array) {
    const newWork = new Figure(work.imageUrl, work.title);
    newWork.build(galleryName);
  }
}

function filterWorks(id) {
  if (id !== 0) {
    let WorksArrayFiltered = worksArray.filter((test) => {
      return test.categoryId === id;
    });
    createGallery(WorksArrayFiltered, "main");
  } else {
    createGallery(worksArray, "main");
  }
}

function deleteAllChilds(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}

function removeClassActive() {
  const boutons = filtre.querySelectorAll("li");
  for (let btn of boutons) {
    btn.classList.remove("active");
  }
}

function createButtons(array) {
  let x = 0;
  for (let bouton of array) {
    const newCateg = document.createElement("li");
    newCateg.innerText = bouton.name;
    filtre.appendChild(newCateg);

    if (x === 0) {
      newCateg.classList.add("active");
      x = 1;
    }
    newCateg.addEventListener("click", () => {
      deleteAllChilds(gallery);
      filterWorks(bouton.id);
      removeClassActive();
      newCateg.classList.add("active");
    });
  }
}

/**
 * MODAL ADMIN
 */

const modalSelect = document.getElementById("work-category");

function createModalSpan(parent) {
  const modalSpan = document.createElement("span");
  const spanIcon = document.createElement("i");
  spanIcon.classList.add("fa-solid");
  spanIcon.classList.add("fa-trash-can");
  spanIcon.title = "Supprimer";

  modalSpan.appendChild(spanIcon);
  parent.appendChild(modalSpan);
}

/*
  Création des options du select
*/

function createModalOptions(optionsArray) {
  for (let option of optionsArray) {
    if (option.name !== "Tous") {
      const selectOption = document.createElement("option");
      selectOption.value = option.id;
      selectOption.innerText = option.name;

      modalSelect.appendChild(selectOption);
    }
  }
}

/**
 * Un seul appel par API et stockage résultats[]
 * Fitrage sur l'array stocké
 */

let worksArray = [];
let categArray = [];

async function showWorks() {
  try {
    const res = await fetch("http://localhost:5678/api/categories");
    if (!res.ok) {
      return;
    }
    const categories = await res.json();
    categArray = categories;
    categArray.unshift({ id: 0, name: "Tous" });
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

  createButtons(categArray);
  createModalOptions(categArray);
  createGallery(worksArray, "main");
  createGallery(worksArray, "modal");
}

showWorks();
