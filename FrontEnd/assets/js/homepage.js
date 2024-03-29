/**
 * Gestion de la homepage
 *
 * Affichage et fitrage des différents travaux
 * Ajout et suppression des travaux via modal admin
 *
 * Auteur : Rémy Balland
 */

const mainGallery = document.getElementById("gallery");
const modalGallery = document.getElementById("modal-list");
const modalForm = document.getElementById("new-work-form");
const previewBox = document.getElementById("preview-image");
const imageInputBox = document.getElementById("image-modal-input");

let worksArray = [];
let categArray = [];
let worksToDel = new Set();
let worksToAdd = new Set();

/**
 * Galleries
 */
class Figure {
  constructor(imageUrl, title, idNumber) {
    this.imageUrl = imageUrl;
    this.title = title;
    this.idNumber = idNumber;
  }

  build(galleryName) {
    let newFigure;
    let gallery;
    let descriptionElem = "";
    let descriptionContent = "";

    switch (galleryName) {
      case "mainGallery":
        newFigure = document.createElement("figure");
        gallery = mainGallery;
        descriptionElem = "figcaption";
        descriptionContent = this.title;
        break;
      case "modalGallery":
        newFigure = document.createElement("li");
        gallery = modalGallery;
        descriptionElem = "p";
        descriptionContent = "Éditer";
        createModalSpan(newFigure);
        deleteWork(newFigure);
        break;
      default:
        break;
    }

    createImg(this.imageUrl, this.title, newFigure);
    createDescription(descriptionElem, descriptionContent, newFigure);
    newFigure.setAttribute("id", galleryName + "-" + this.idNumber);
    gallery.appendChild(newFigure);
  }
}

function createImg(url, title, parent) {
  const img = document.createElement("img");

  img.src = url;
  img.alt = title;
  parent.appendChild(img);
}

function createDescription(htmlTagName, content, parent) {
  const description = document.createElement(htmlTagName);

  description.innerText = content;
  parent.appendChild(description);
}

function createGallery(workArray, galleryName, element) {
  deleteAllChilds(element);
  for (let work of workArray) {
    const newWork = new Figure(work.imageUrl, work.title, work.id);
    newWork.build(galleryName);
  }
}

/**
 * Filtre les travaux correspondant à la categoryId du bouton cliqué
 */
function filterWorks(categId) {
  if (categId !== 0) {
    let WorksArrayFiltered = worksArray.filter((work) => {
      return work.categoryId === categId;
    });
    createGallery(WorksArrayFiltered, "mainGallery", mainGallery);
  } else {
    createGallery(worksArray, "mainGallery", mainGallery);
  }
}

/**
 * Supprime tous les enfants de @param elem
 */
function deleteAllChilds(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}

/**
 * Crée les boutons de fitrage et leurs events
 */

function createButtons(btnArray) {
  let x = 0;

  for (let bouton of btnArray) {
    const newCateg = document.createElement("li");
    newCateg.innerText = bouton.name;
    filtre.appendChild(newCateg);

    if (x === 0) {
      newCateg.classList.add("active");
      x = 1;
    }

    newCateg.addEventListener("click", () => {
      deleteAllChilds(mainGallery);
      filterWorks(bouton.id);
      removeClassActive();
      newCateg.classList.add("active");
    });
  }
}

function removeClassActive() {
  const boutons = filtre.querySelectorAll("li");

  for (let btn of boutons) {
    btn.classList.remove("active");
  }
}

/**
 * Creation des boutons delete du modal
 * Gestion de l'affichage du modal dans le fichier : modal-form.js
 */

function createModalSpan(parent) {
  const modalSpan = document.createElement("span");
  const spanIcon = document.createElement("i");

  spanIcon.classList.add("fa-solid");
  spanIcon.classList.add("fa-trash-can");
  spanIcon.classList.add("delete-btn");
  spanIcon.title = "Supprimer";

  modalSpan.appendChild(spanIcon);
  parent.appendChild(modalSpan);
}

/**
 * Crée les options du select du modal
 * @param optionsArray tableau des catégories
 */
function createModalOptions(optionsArray) {
  const modalSelect = document.getElementById("new-work-category");

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
 * Suppression des travaux
 * Ajoute event au bouton enfant de @param parent
 * Filtre en local & ajoute le travail à supprimer au set()
 */
function deleteWork(parent) {
  const deleteBtn = parent.querySelector(".delete-btn");
  let idNumber;

  deleteBtn.addEventListener("click", function () {
    const figureModal = deleteBtn.parentElement.parentElement;

    idNumber = parseInt(
      figureModal.getAttribute("id").replace("modalGallery-", "")
    );

    worksArray = worksArray.filter((object) => {
      return object.id !== idNumber;
    });

    createGallery(worksArray, "mainGallery", mainGallery);
    createGallery(worksArray, "modalGallery", modalGallery);

    worksToDel.add(idNumber);
  });
}

/**
 * Gestion formulaire modal
 * Crée un objet et l'ajoute en local & stock Formdata dans un Set()
 * Recrée les galleries & reset formulaire
 */
function addWork() {
  const imageSelector = document.getElementById("new-work-image");
  const titleSelector = document.getElementById("new-work-title");
  const categIdSelector = document.getElementById("new-work-category");
  const errorMsgModal = document.getElementById("modal-form-error");

  let imageUrl = "";

  // preview image
  imageSelector.addEventListener("change", (e) => {
    const fileList = e.target.files;
    imageName = fileList[0].name;

    if (fileList && fileList[0]) {
      imageInputBox.classList.add("hidden");
      previewBox.classList.remove("hidden");

      let reader = new FileReader();

      reader.onload = function (e) {
        imageUrl = e.target.result;
        deleteAllChilds(previewBox);
        createImg(imageUrl, "your image", previewBox);
      };
      reader.readAsDataURL(fileList[0]);
    }
  });

  modalForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (
      !imageSelector.value ||
      !titleSelector.value ||
      !categIdSelector.value
    ) {
      errorMsgModal.innerText = "Merci de renseigner toutes les informations";
      errorMsgModal.classList.remove("invisible");
    } else {
      // close modal
      modalBackground.classList.remove("flex");
      body.classList.remove("no-scroll");

      const newWork = {
        categoryId: parseInt(categIdSelector.value),
        imageUrl: imageUrl,
        title: titleSelector.value,
        id: worksArray.length + 1, // temporaire pour pouvoir supprimer le travail s'il n'a pas été POST
      };

      worksArray.push(newWork);

      const fetchData = new FormData(modalForm);

      worksToAdd.add(fetchData);

      createGallery(worksArray, "mainGallery", mainGallery);
      createGallery(worksArray, "modalGallery", modalGallery);
      resetModalForm();
    }
  });
}

function resetModalForm() {
  modalForm.reset();
  imageInputBox.classList.remove("hidden");
  previewBox.classList.add("hidden");
}

/**
 * Gestion du bouton de publication
 * Fetch delete et/ou post si les set() ne sont pas vide
 */

function publishChanges() {
  const publishBtn = document.getElementById("publish-btn");

  publishBtn.addEventListener("click", function () {
    if (checkCookie("userToken")) {
      const bearerToken = getCookie("userToken");
      if (worksToDel.size > 0) {
        worksToDel.forEach((workId) => {
          const url = "http://localhost:5678/api/works/" + workId;
          fetch(url, {
            method: "DELETE",
            headers: {
              Accept: "*/*",
              Authorization: "Bearer " + bearerToken,
            },
          }).catch((err) => {
            console.log(err);
          });
        });
      }
      if (worksToAdd.size > 0) {
        worksToAdd.forEach((work) => {
          fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + bearerToken,
            },
            body: work,
          }).catch((err) => {
            console.log(err);
          });
        });
      }
    }
  });
}

/**
 * Gestion des cookies
 * Recupère tous les cookies et boucle pour chercher si cookieName existe
 * Return le contenu du cookie
 */
function getCookie(cookieName) {
  let name = cookieName + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) == " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) == 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
}

function checkCookie(cookieName) {
  let cookie = getCookie(cookieName);
  let response = false;
  if (cookie) {
    response = true;
  }
  return response;
}

/**
 * Modifie bouton login -> logout du header + supprime cookie userToken onclick
 * Affiche les interfaces admin du site si user loggedIn
 */

function checkLogin() {
  const cookieName = "userToken";
  if (checkCookie(cookieName) && document.getElementById("log-btn")) {
    const loginBtn = document.getElementById("login_link");
    const logoutBtn = document.getElementById("logout_link");
    const header = document.querySelector("header");
    const editBanner = document.getElementById("edit-mode");
    let modifBtns = document.getElementsByClassName("modif");

    for (let btn of modifBtns) {
      btn.classList.remove("hidden");
    }
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    editBanner.classList.remove("hidden");
    header.classList.add("edit-mode-header");

    logoutBtn.addEventListener("click", () => {
      document.cookie =
        "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
    });
  }
}

/**
 * Création de la page
 * Un seul appel par API et stockage résultats en local
 * Fitrage sur l'array local
 */

async function initPage() {
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

  // Reset formulaire modal au reload
  document.addEventListener("DOMContentLoaded", () => {
    resetModalForm();
  });

  createButtons(categArray);
  createGallery(worksArray, "mainGallery", mainGallery);
  createGallery(worksArray, "modalGallery", modalGallery);

  createModalOptions(categArray);
  addWork();
  publishChanges();
  checkLogin();
}

initPage();
