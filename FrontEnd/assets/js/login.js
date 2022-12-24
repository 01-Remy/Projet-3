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
