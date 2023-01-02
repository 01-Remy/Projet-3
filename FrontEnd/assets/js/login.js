/**
 * Page de connexion
 *
 * Auteur : Rémy Balland
 */

/**
 * Formulaire login
 */

if (document.getElementById("login-form")) {
  const loginForm = document.querySelector("#login-form form");
  const emailInput = loginForm.querySelector("#email");
  const passwordInput = loginForm.querySelector("#password");
  const errorMsg = document.getElementById("form-error");

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
            errorMsg.classList.remove("hidden");
            errorMsg.innerText = "Identifiants incorrects";
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
      errorMsg.classList.remove("hidden");
      errorMsg.innerText = "Merci de renseigner toutes vos informations";
    }
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    document.cookie =
      "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
    loginUser();
  });
}
