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

// stripe checkout
var handler = StripeCheckout.configure({
  key: "pk_test_AZLJ6GOzlzvtcrxBWn8WAqLh",
  image: "/img/logo.png",
  locale: "auto",
  allowRememberMe: false,
  token: function(token) {
    var data = {};
    for (key in document.forms) {
      data[key] = document.forms[key];
    }

    console.log(data);
    // axios.post("/forms/payment", { data, token });
    // $.post("/forms/payment", { data, token });
  }
});
console.log(document.querySelectorAll("input"));

document.getElementById("customButton").addEventListener("click", function(e) {
  // Open Checkout with further options:
  handler.open({
    name: "Embassy of Denmark",
    description: "Pay for Passport form",
    amount: 2000
  });
  e.preventDefault();
});

// Close Checkout on page navigation:
window.addEventListener("popstate", function() {
  handler.close();
});

// bootstrap code for handling showing of file name

$("input[type=file]").change(function() {
  var fieldVal = $(this).val();
  console.log($(this).val());

  // Change the node's value by removing the fake path (Chrome)
  fieldVal = fieldVal.replace("C:\\fakepath\\", "");

  if (fieldVal != undefined || fieldVal != "") {
    $(this)
      .next(".custom-file-label")
      .attr("data-content", fieldVal)
      .text(fieldVal);
  }
});

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
