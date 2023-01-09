/**
 * Affichage du modal admin
 *
 * Auteur : Rémy Balland
 */

const body = document.body;
const modalBackground = document.getElementById("edit-modal");
const modalGalleryPreview = document.getElementById("gallery-photo");
const modalFormBox = document.getElementById("modal-form-box");
const closeSpans = document.getElementsByClassName("close");
const btnEditWorks = document.getElementById("btn-edit-works");
const addImage = document.getElementById("add-picture");
const backArrow = document.getElementById("back-arrow");

/*
 * Open modal
 */

btnEditWorks.addEventListener("click", () => {
  modalBackground.classList.add("flex");
  body.classList.add("no-scroll");
});

/**
 * Affiche le formulaire d'ajout
 */
addImage.addEventListener("click", () => {
  modalGalleryPreview.classList.add("hidden");
  modalFormBox.classList.remove("hidden");
});

/**
 * Affiche la gallerie de suppression
 */
backArrow.addEventListener("click", () => {
  modalFormBox.classList.add("hidden");
  modalGalleryPreview.classList.remove("hidden");
});

/*
  Close modal click croix ou en dehors
*/

for (let span of closeSpans) {
  span.addEventListener("click", () => {
    modalBackground.classList.remove("flex");
    body.classList.remove("no-scroll");
  });
}

window.addEventListener("click", (event) => {
  if (event.target == modalBackground) {
    modalBackground.classList.remove("flex");
    body.classList.remove("no-scroll");
  }
});
