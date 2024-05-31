import { showMessage, showOptions, loading } from "./model/MyAlert.js";
$(() => {
  $("#submit").on("click", () => {

    const uname = $("#username").val();
    const pass = $("#password").val();
    if (uname == "" || pass == "") {
      showMessage("Error", "All fields are required", "error");
      return;
    }

    if (uname == "Admin" && pass == "Admin") {
      showMessage("Success", "Login Successful", "success");
      localStorage.setItem("isLoggedin", true);
    } else {
      showMessage("Error", "Invalid Credentials", "error");
    }
  });
});
