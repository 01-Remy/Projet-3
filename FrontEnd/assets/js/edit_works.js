/**
 * Gestion de l'ajout, suppression de travaux
 *
 * Auteur : Rémy Balland
 */

/*
  Variables et constantes
*/

const body = document.body;
const modal = document.getElementById("edit-modal");
const modalGallery = document.getElementById("gallery-photo");
const modalForm = document.getElementById("modal-form");
const modalListWorks = document.getElementById("modal-list");
const btnEditWorks = document.getElementById("btn-edit-works");
const closeSpans = document.getElementsByClassName("close");
const addImage = document.getElementById("add-picture");
const backArrow = document.getElementById("back-arrow");
const modalSelect = document.getElementById("work-category");
let modalWorkArray = [];
let modalCategArray = [];

/*
 * Affichage modal
 */

btnEditWorks.onclick = function () {
  modal.classList.add("flex");
  body.classList.add("no-scroll");
};

addImage.onclick = function () {
  modalGallery.classList.add("hidden");
  modalForm.classList.remove("hidden");
};

backArrow.onclick = function () {
  modalForm.classList.add("hidden");
  modalGallery.classList.remove("hidden");
};

/*
  Close modal
*/

for (let span of closeSpans) {
  span.onclick = function () {
    modal.classList.remove("flex");
    body.classList.remove("no-scroll");
  };
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.classList.remove("flex");
    body.classList.remove("no-scroll");
  }
};

/*
  Création liste des travaux 
*/

async function createModalGallery() {
  try {
    const res = await fetch("http://localhost:5678/api/works");
    if (!res.ok) {
      return;
    }
    const works = await res.json();
    modalWorkArray = works;
  } catch (err) {
    console.log(err);
  }

  for (let work of modalWorkArray) {
    const liModal = document.createElement("li");
    modalListWorks.appendChild(liModal);

    const modalSpan = document.createElement("span");
    const spanIcon = document.createElement("i");
    spanIcon.classList.add("fa-solid");
    spanIcon.classList.add("fa-trash-can");
    spanIcon.title = "Supprimer";
    modalSpan.appendChild(spanIcon);
    liModal.appendChild(modalSpan);

    const modalImg = document.createElement("img");
    modalImg.src = work.imageUrl;
    modalImg.alt = work.title;
    modalImg.innerText = work.title;
    liModal.appendChild(modalImg);

    const modalText = document.createElement("p");
    modalText.innerText = "Éditer";
    liModal.appendChild(modalText);
  }
}

createModalGallery();

/*
  Option select catégories
*/

async function createModalOptions() {
  try {
    const res = await fetch("http://localhost:5678/api/categories");
    if (!res.ok) {
      return;
    }
    const categ = await res.json();
    modalCategArray = categ;
  } catch (err) {
    console.log(err);
  }

  for (let categ of modalCategArray) {
    const selectOption = document.createElement("option");
    selectOption.value = categ.id;
    selectOption.innerText = categ.name;

    modalSelect.appendChild(selectOption);
  }
}

createModalOptions();
