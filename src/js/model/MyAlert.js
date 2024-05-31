export const showMessage = (title, meesage, icon) => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: title,
      text: meesage,
      icon: icon,
      didClose: () => {
        resolve();
      },
    });
  });
};

export const showOptions = (title, message, icon, response) => {
  Swal.fire({
    title: title,
    text: message,
    icon: icon,
    showCancelButton: true,
    confirmButtonColor: "#eaaa00",
    cancelButtonColor: "#ccc",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      response();
    }
  });
};
let swalInstance = null;

export const loading = (showLoading) => {
  if (swalInstance !== null) {
    Swal.close();
    swalInstance = null;
    if (!showLoading) {
      return;
    }
  }

  const swalOptions = {
    title: "Fetching Data",
    html: "Please wait...",
    timerProgressBar: true,
    showConfirmButton: false,
    didOpen: () => {
      if (showLoading) {
        Swal.showLoading();
      }
    },
  };

  if (showLoading) {
    swalInstance = Swal.fire(swalOptions).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });
  }
};

export const payrollStartup = (viewpayroll, makepayroll) => {
  Swal.fire({
    title: "Please Choose",
    showDenyButton: true,
    showCancelButton: false,
    icon: "question",
    confirmButtonText: "View Payroll",
    denyButtonText: `Make Payroll`,
  }).then((result) => {
    if (result.isConfirmed) {
      makepayroll();
    } else if (result.isDenied) {
      viewpayroll();
    }
  });
};
