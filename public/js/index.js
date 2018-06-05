var data = {};
var inputFields = document.querySelectorAll("input");
var selectFields = document.querySelectorAll("select");

inputFields.forEach(function(input) {
  if (input.type === "radio" && !input.checked) {
    return;
  } else {
    data[input.name] = input.value;
  }
});

selectFields.forEach(function(select) {
  data[select.name] = select.value;
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
