/**
 * Page de connexion
 *
 * Auteur : Rémy Balland
 */

/**
 * Formulaire login
 */

if (document.getElementById("login-form")) {
  const form = document.querySelector("#login-form form");
  const emailInput = form.querySelector("#email");
  const passwordInput = form.querySelector("#password");

  function loginUser() {
    if (emailInput.value != "" && passwordInput.value != "") {
      fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInput.value,
          password: passwordInput.value,
        }),
      })
        .then(function (res) {
          if (res.ok) {
            return res.json();
          } else {
            alert("Identifiants incorrects");
          }
        })
        .then(function (userInfo) {
          if (userInfo) {
            document.cookie =
              "userToken=" +
              userInfo.token +
              "; Max-Age=2600000; path=/; SameSite=Lax";

            document.location.href = "../index.html";
          }
        })
        .catch((err) => console.log(err));
    } else {
      alert("Merci de renseigner toutes vos informations");
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    document.cookie =
      "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
    loginUser();
  });
}

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
 * logout
 */

function logout() {
  const cookieName = "userToken";
  if (checkCookie(cookieName) && document.getElementById("log-btn")) {
    const loginBtn = document.getElementById("login_link");
    const logoutBtn = document.getElementById("logout_link");

    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");

    logoutBtn.addEventListener("click", () => {
      document.cookie =
        "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
    });
  }
}

logout();
