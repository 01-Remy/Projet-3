/**
 * Affichage du modal admin
 *
 * Auteur : Rémy Balland
 */

const body = document.body;
const modal = document.getElementById("edit-modal");
const modalGalleryPreview = document.getElementById("gallery-photo");
const modalFormBox = document.getElementById("modal-form-box");
const closeSpans = document.getElementsByClassName("close");
const btnEditWorks = document.getElementById("btn-edit-works");
const addImage = document.getElementById("add-picture");
const backArrow = document.getElementById("back-arrow");

/*
 * Affichage modal
 */

btnEditWorks.addEventListener("click", () => {
  modal.classList.add("flex");
  body.classList.add("no-scroll");
});

addImage.addEventListener("click", () => {
  modalGalleryPreview.classList.add("hidden");
  modalFormBox.classList.remove("hidden");
});

backArrow.addEventListener("click", () => {
  modalFormBox.classList.add("hidden");
  modalGalleryPreview.classList.remove("hidden");
});

/*
  Close modal
*/

for (let span of closeSpans) {
  span.addEventListener("click", () => {
    modal.classList.remove("flex");
    body.classList.remove("no-scroll");
  });
}

window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.classList.remove("flex");
    body.classList.remove("no-scroll");
  }
});
