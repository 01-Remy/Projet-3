/**
 * Affichage et fitrage des différents travaux
 *
 * Auteur : Rémy Balland
 */

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
        gallery = document.getElementById("gallery");
        descriptionElem = "figcaption";
        descriptionContent = this.title;
        break;
      case "modalGallery":
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
    newFigure.setAttribute("id", galleryName + "-" + this.idNumber);
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
    const newWork = new Figure(work.imageUrl, work.title, work.id);
    newWork.build(galleryName);
  }
}

function filterWorks(id) {
  if (id !== 0) {
    let WorksArrayFiltered = worksArray.filter((test) => {
      return test.categoryId === id;
    });
    createGallery(WorksArrayFiltered, "mainGallery");
  } else {
    createGallery(worksArray, "mainGallery");
  }
}

/**
 * Boutons
 */
const filtre = document.getElementById("filtre");

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
 * Modal
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

function deleteWork() {
  const modalGallery = document.getElementById("modal-list");
  const deleteBtns = modalGallery.getElementsByClassName("delete-btn");
  let idNumber;

  for (let btn of deleteBtns) {
    btn.onclick = function () {
      const figureModal = btn.parentElement.parentElement;
      workIdMainGallery = figureModal
        .getAttribute("id")
        .replace("modalGallery", "mainGallery");
      idNumber = parseInt(workIdMainGallery.replace("mainGallery-", ""));
      const figureMain = document.getElementById(workIdMainGallery);

      // figureMain.classList.add("hidden");
      // figureModal.classList.add("hidden");

      const workToDelIndex = worksArray.findIndex(
        (Object) => Object.id === idNumber
      );

      if (workToDelIndex >= 0) {
        worksArray.splice(workToDelIndex, 1);

        // delete gallery avant de rebuild -> revoir les utils deletechild()

        createGallery(worksArray, "mainGallery");
        createGallery(worksArray, "modalGallery");
      }

      worksToDel.add(idNumber);
    };
  }
}

function publishChanges() {
  const publishBtn = document.getElementById("publish-btn");

  publishBtn.onclick = function () {
    if (worksToDel.size > 0 && checkCookie("userToken")) {
      const bearerToken = getCookie("userToken");

      worksToDel.forEach((workId) => {
        const url = "http://localhost:5678/api/works/" + workId;

        console.log(url);

        fetch(url, {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            Authorization: "Bearer " + bearerToken,
          },
        });
      });
    } else {
      console.log("Pas de changement à publier");
    }
  };
}

/**
 * Un seul appel par API et stockage résultats[]
 * Fitrage sur l'array stocké
 */

let worksArray = [];
let categArray = [];
let worksToDel = new Set();
let worksToAdd = [];

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
  createGallery(worksArray, "mainGallery");
  createGallery(worksArray, "modalGallery");

  deleteWork();
  publishChanges();

  function addWork() {
    const form = document.getElementById("new-work-form");

    form.onsubmit = function (e) {
      e.preventDefault();
      const image = document.getElementById("new-work-image").value;
      const title = document.getElementById("new-work-title").value;
      const categId = document.getElementById("new-work-category").value;

      const body = new FormData();
      body.append("image", image);
      body.append("title", title);
      body.append("category", categId);

      console.log(body);
    };
  }
  addWork();
}

showWorks();

/**
 * Gestion des cookies
 */

// recupère tous les cookies et boucle pour chercher si le cookie demandé existe
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

checkLogin();
