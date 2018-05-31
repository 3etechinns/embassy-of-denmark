var countryOfBirth = document.querySelector("#countryOfBirth");
var countryOfResidence = document.querySelector("#countryOfResidence");
var fathersNationality = document.querySelector("#fathersNationality");
var mothersNationality = document.querySelector("#mothersNationality");

if (countryOfBirth) {
  countries.forEach(function(country) {
    appendOptions(countryOfBirth, country.name);
    appendOptions(countryOfResidence, country.name);
    appendOptions(mothersNationality, country.name);
    appendOptions(fathersNationality, country.name);
  });
}

function appendOptions(parent, value) {
  var option = document.createElement("option");
  option.innerHTML = value;
  parent.appendChild(option);
}

var signUpTabbedPane = document.querySelector(".tabbed-pane .sign-up");
var signInTabbedPane = document.querySelector(".tabbed-pane .sign-in");

if (signInTabbedPane) {
  signInTabbedPane.addEventListener("click", function(e) {
    location.assign("/login");
  });
}

if (signUpTabbedPane) {
  signUpTabbedPane.addEventListener("click", function(e) {
    location.assign("/");
  });
}

$().dropdown();

// if (document.querySelector("#dateOfBirth")) {
//   document
//     .querySelector("#dateOfBirth")
//     .addEventListener("change", function(e) {
//       const yearOfBirth = new Date(this.value).getFullYear();
//       const currentYear = new Date().getFullYear();
//       console.log(currentYear - yearOfBirth);
//       const age = currentYear - yearOfBirth;
//       if (age < 18) {
//         document.querySelector("#parentName").setAttribute("required", "true");
//         document
//           .querySelector("#parentAddress")
//           .setAttribute("required", "true");
//         document
//           .querySelector("#parentTelephoneNumber")
//           .setAttribute("required", "true");
//       }
//     });
// }
