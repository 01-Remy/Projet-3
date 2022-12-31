/**
 * Affichage du modal admin
 *
 * Auteur : Rémy Balland
 */

const body = document.body;
const modal = document.getElementById("edit-modal");
const modalGalleryPreview = document.getElementById("gallery-photo");
const modalForm = document.getElementById("modal-form");
const closeSpans = document.getElementsByClassName("close");
const btnEditWorks = document.getElementById("btn-edit-works");
const addImage = document.getElementById("add-picture");
const backArrow = document.getElementById("back-arrow");

/*
 * Affichage modal
 */

btnEditWorks.onclick = function () {
  modal.classList.add("flex");
  body.classList.add("no-scroll");
};

addImage.onclick = function () {
  modalGalleryPreview.classList.add("hidden");
  modalForm.classList.remove("hidden");
};

backArrow.onclick = function () {
  modalForm.classList.add("hidden");
  modalGalleryPreview.classList.remove("hidden");
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
