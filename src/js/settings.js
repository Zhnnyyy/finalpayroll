import config from "./model/config.js";
import { showMessage, showOptions, loading } from "./model/MyAlert.js";
import { Fetch } from "./model/bridge.js";
// $(() => {
//   menu();
//   types();
// });
export function SettingsFunction() {
  menu();
  types();
}
const menu = () => {
  $(".settings-btn").on("click", function () {
    const data = $(this).data("id");
    toggleContent(data);
  });
};

const toggleContent = (target) => {
  switch (target) {
    case "type":
      showContent(".type");
      types();
      break;
    case "position":
      showContent(".position");
      position();
      break;
    case "rate":
      showContent(".rate");
      rate();
      break;
    case "schedule":
      showContent(".schedule");
      schedule();
      break;
    case "contribution":
      showContent(".contribution");
      contribution();
      break;
    case "leavetypes":
      showContent(".leavetypes");
      leaveTypes();
      break;
  }
};
const leaveTypes = () => {
  showLeaveTypes();
  addLeaveTypes();
};

const showLeaveTypes = async () => {
  $("#leavename").val("");
  $("#leaveValue").val("");
  Fetch(config.showLeavetypes, "GET", (result) => {
    if (result.loading) {
      loading(true);
    }
    if (!result.loading) {
      loading(false);
      const tbl = $(".leavetypes-table").empty();
      let count = 0;
      $.each(result.data, (i, data) => {
        count++;
        tbl.append(
          ` <tr>
          <td>${count}</td>
          <td>${data.Name}</td>
          <td>${data.Credit}</td>
          <td><div class='remove-leavetypes-btn' data-id='${data.id}'>
          <i class='fa-solid fa-xmark'></i>
          </div></td>
        </tr>`
        );
      });
    }

    $(".remove-leavetypes-btn")
      .off("click")
      .on("click", function () {
        let id = $(this).data("id");
        showOptions("Warning", "Are you sure?", "warning", () => {
          removeItem("leavetypes", id, showLeaveTypes);
        });
      });
  });
};

const addLeaveTypes = async () => {
  $("#addLeavetypes")
    .off("click")
    .on("click", () => {
      const name = $("#leavename").val();
      const credit = $("#leaveValue").val();
      if (name == "" || credit == "") {
        showOptions("Warning", "Please fill all the fields", "warning");
        return;
      }
      if (
        isNaN($("#leaveValue").val()) &&
        typeof $("#leaveValue").val() !== "number"
      ) {
        showMessage("Error", "Please enter a valid number", "error");
        $("#leaveValue").val("");
        return;
      }
      const data = {
        name: $("#leavename").val(),
        value: $("#leaveValue").val(),
      };
      Fetch(
        config.addLeaveTypes,
        "POST",
        (result) => {
          if (result.loading) {
            loading(true);
          }
          if (!result.loading) {
            loading(false);
            const data = result.data;
            if (!data.Error) {
              showMessage("Success", "Item has been added", "success").then(
                () => {
                  showLeaveTypes();
                }
              );
              return;
            }

            showMessage("Error", data.msg, "error");
          }
        },
        data
      );
    });
};

const contribution = () => {
  Fetch(config.showContributions, "GET", (result) => {
    const sss = $("#sss");
    const pagibig = $("#pagibig");
    const philhealth = $("#philhealth");
    if (result.loading) {
      loading(true);
    }
    if (!result.loading) {
      loading(false);
      const data = result.data;
      $.each(data, (i, res) => {
        if (res.Name == "SSS") {
          sss.val(`${res.Value}`);
        }
        if (res.Name == "PAGIBIG") {
          pagibig.val(`${res.Value}`);
        }
        if (res.Name == "PHILHEALTH") {
          philhealth.val(`${res.Value}`);
        }
      });
    }
  });

  $("#updateContributionBtn").click(() => {
    const sss = $("#sss").val();
    const pagibig = $("#pagibig").val();
    const philhealth = $("#philhealth").val();
    const data = {
      sss: sss,
      pagibig: pagibig,
      philhealth: philhealth,
    };

    if (
      (typeof sss !== "number" && isNaN(sss)) ||
      (typeof pagibig !== "number" && isNaN(pagibig)) ||
      (typeof philhealth !== "number" && isNaN(philhealth))
    ) {
      showMessage("Oppsss", "Check your input", "warning").then(() => {
        contribution();
      });

      return;
    }
    Fetch(
      config.updateContributions,
      "POST",
      (result) => {
        if (result.loading) {
          loading(true);
        }
        if (!result.loading) {
          loading(false);
          if (result.data.Error) {
            showMessage("Error", result.data.msg, "error");
            return;
          }

          showMessage("Success", "Successfully updated", "success").then(() => {
            contribution();
          });
        }
      },
      data
    );
  });
};

const showContent = (target) => {
  $(".settings-content").css("display", "none");
  $(target).css("display", "block");
};

const types = () => {
  showtypes();
  addTypes();
};

const position = () => {
  showPosition();
  addPositon();
};

const rate = () => {
  showRate();
  addRate();
};

const schedule = () => {
  showSchedule();
  addSchedule();
};

const showSchedule = () => {
  Fetch(config.showSched, "GET", (result) => {
    const tbl = $(".schedule-table").empty();
    if (result.loading) {
      loading(true);
    }
    if (!result.loading) {
      loading(false);
      let row = 0;
      $.each(result.data, (i, data) => {
        row += 1;
        tbl.append(
          "<tr>" +
            "<td>" +
            row +
            "</td>" +
            "<td>" +
            data.Schedule +
            "</td>" +
            "<td>" +
            "<div class='remove-schedule-btn' data-id='" +
            data.id +
            "'>" +
            "<i class='fa-solid fa-xmark'></i>" +
            "</div>" +
            "</td>" +
            "</tr>"
        );
      });
    }

    $(".remove-schedule-btn").on("click", function () {
      const id = $(this).data("id");
      showOptions("Warning", "Are you sure?", "warning", () => {
        removeItem("schedule", id, showSchedule);
      });
    });
  });
};

const addSchedule = () => {
  $("#addSchedule")
    .off("click")
    .on("click", () => {
      const name = $("#schedulename").val();
      if (name == "") {
        showMessage("Ooppsss", "Please fill all fields", "warning");
        return;
      }
      const data = {
        name: name,
      };
      Fetch(
        config.addSchedule,
        "POST",
        (result) => {
          if (result.loading) {
            loading(true);
          }
          if (!result.loading) {
            loading(false);
            if (!result.data.Error) {
              $("#schedulename").val("");
              showMessage(
                "Alright",
                "Employee Schedule has been added",
                "success"
              ).then(() => {
                setTimeout(() => {
                  showSchedule();
                }, 500);
              });

              return;
            }
            showMessage("Ooppsss", result.data.msg, "error");
          }
        },
        data
      );
    });
};

const showRate = () => {
  Fetch(config.showRates, "GET", (result) => {
    const tbl = $(".rate-table").empty();
    if (result.loading) {
      loading(true);
    }
    if (!result.loading) {
      loading(false);
      let row = 0;
      $.each(result.data, (i, data) => {
        row += 1;
        tbl.append(
          "<tr>" +
            "<td>" +
            row +
            "</td>" +
            "<td>" +
            data.Rate +
            "</td>" +
            "<td>" +
            data.Value +
            "</td>" +
            "<td>" +
            "<div class='remove-rate-btn' data-id='" +
            data.id +
            "'>" +
            "<i class='fa-solid fa-xmark'></i>" +
            "</div>" +
            "</td>" +
            "</tr>"
        );
      });
    }

    $(".remove-rate-btn").on("click", function () {
      const id = $(this).data("id");
      showOptions("Warning", "Are you sure?", "warning", () => {
        removeItem("rate", id, showRate);
      });
    });
  });
};

const addRate = () => {
  $("#addRate")
    .off("click")
    .on("click", () => {
      const name = $("#ratename").val();
      const value = $("#ratevalue").val();
      if (name == "" || value == "") {
        showMessage("Ooppsss", "Please fill all fields", "warning");
        return;
      }
      const data = {
        name: name,
        value: value,
      };
      Fetch(
        config.addRate,
        "POST",
        (result) => {
          if (result.loading) {
            loading(true);
          }
          if (!result.loading) {
            loading(false);
            if (!result.data.Error) {
              showMessage(
                "Alright",
                "Employee Rate has been added",
                "success"
              ).then(() => {
                $("#ratename").val("");
                $("#ratevalue").val("");
                showRate();
              });

              return;
            }
            showMessage("Ooppsss", result.data.msg, "error");
          }
        },
        data
      );
    });
};

const showPosition = () => {
  Fetch(config.showPos, "GET", (result) => {
    const tbl = $(".positions-table").empty();
    if (result.loading) {
      loading(true);
    }
    if (!result.loading) {
      loading(false);
      let row = 0;
      $.each(result.data, (i, data) => {
        row += 1;
        tbl.append(
          "<tr>" +
            "<td>" +
            row +
            "</td>" +
            "<td>" +
            data.Position +
            "</td>" +
            "<td>" +
            "<div class='remove-position-btn' data-id='" +
            data.id +
            "'>" +
            "<i class='fa-solid fa-xmark'></i>" +
            "</div>" +
            "</td>" +
            "</tr>"
        );
      });
    }

    $(".remove-position-btn").on("click", function () {
      const id = $(this).data("id");
      showOptions("Warning", "Are you sure?", "warning", () => {
        removeItem("employeeposition", id, showPosition);
      });
    });
  });
};

const addPositon = () => {
  $("#addPosition")
    .off("click")
    .on("click", () => {
      const name = $("#positionname").val();
      if (name == "") {
        showMessage("Ooppsss", "Please fill all fields", "warning");
        return;
      }
      const data = {
        name: name,
      };
      Fetch(
        config.addPosition,
        "POST",
        (result) => {
          if (result.loading) {
            loading(true);
          }
          if (!result.loading) {
            loading(false);
            if (!result.data.Error) {
              $("#positionname").val("");
              showMessage(
                "Alright",
                "Employee Position has been added",
                "success"
              ).then(() => {
                showPosition();
              });

              return;
            }
            showMessage("Ooppsss", result.data.msg, "error");
          }
        },
        data
      );
    });
};

const addTypes = () => {
  $("#addTypes")
    .off("click")
    .on("click", () => {
      const name = $("#typename").val();
      if (name == "") {
        showMessage("Ooppsss", "Please fill all fields", "warning");
        return;
      }
      const data = {
        name: name,
      };
      Fetch(
        config.addTypes,
        "POST",
        (result) => {
          if (result.loading) {
            loading(true);
          }
          if (!result.loading) {
            loading(false);
            if (!result.data.Error) {
              $("#typename").val("");
              showMessage(
                "Alright",
                "Employee type has been added",
                "success"
              ).then(() => {
                showtypes();
              });

              return;
            }
            showMessage("Ooppsss", result.data.msg, "error");
          }
        },
        data
      );
    });
};

const showtypes = () => {
  Fetch(config.showTypes, "GET", (result) => {
    const tbl = $(".types-table").empty();
    if (result.loading) {
      loading(true);
    }
    if (!result.loading) {
      loading(false);
      let row = 0;
      $.each(result.data, (i, data) => {
        row += 1;
        tbl.append(
          "<tr>" +
            "<td>" +
            row +
            "</td>" +
            "<td>" +
            data.Type +
            "</td>" +
            "<td>" +
            "<div class='remove-types-btn' data-id='" +
            data.id +
            "'>" +
            "<i class='fa-solid fa-xmark'></i>" +
            "</div>" +
            "</td>" +
            "</tr>"
        );
      });
    }

    $(".remove-types-btn").on("click", function () {
      const id = $(this).data("id");
      showOptions("Warning", "Are you sure?", "warning", () => {
        removeItem("employeetypes", id, showtypes);
      });
    });
  });
};

const removeItem = (name, id, target) => {
  const data = {
    name: name,
    value: id,
  };
  Fetch(
    config.removeDropdown,
    "POST",
    (result) => {
      if (result.loading) {
        loading(true);
      }
      if (!result.loading) {
        loading(false);
        if (!result.data.Error) {
          showMessage("Success", "Item removed successfully", "success").then(
            () => {
              target();
            }
          );
          return;
        }
        showMessage(
          "Error",
          "Some employee have this type please change their Employee Type first!",
          "error"
        );
      }
    },
    data
  );
};
