function skillsMember() {
  var skills = document.getElementById("skills").value;
  if (skills == "") {
    document.getElementById("skillsError").innerHTML =
      "Please enter your skills";
  } else {
    document.getElementById("skillsError").innerHTML = "";
  }
}