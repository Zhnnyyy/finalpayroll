import { Fetch } from "./model/bridge.js";
import { showMessage, showOptions, loading } from "./model/MyAlert.js";
import config from "./model/config.js";
// $(() => {

// });
export function AttendanceFunction() {
  loadTables();
  onChangeDate();
}

const loadTables = () => {
  Fetch(config.showAttendance, "GET", (result) => {
    if (result.loading) {
    }
    if (!result.loading) {
      const res = result.data;
      const tbl = $("#timesheetTable").empty();
      $.each(res, (index, data) => {
        const mtimein = data.TimeIn == null ? "--" : data.TimeIn;
        const mtimeout = data.TimeOut == null ? "--" : data.TimeOut;
        tbl.append(
          "<tr>" +
            "<td>" +
            data.EmployeeID +
            "</td>" +
            "<td>" +
            data.name +
            "</td>" +
            "<td>" +
            mtimein +
            "</td>" +
            "<td>" +
            mtimeout +
            "</td>" +
            "<td>" +
            wrkhrs(data.WorkHours) +
            "</td>" +
            "<td>" +
            data.Status +
            "</td>" +
            "<td>" +
            data.Date +
            "</td>" +
            "<td>" +
            `<button class='editAttendance' data-id='${data.id}' data-timein='${
              data.TimeIn
            }' data-timeout='${data.TimeOut}' data-wrkhrs='${wrkhrs(
              data.WorkHours
            )}' ><i class='far fa-edit'></i></button>` +
            "</td>" +
            "</tr>"
        );
      });
    }

    $(".editAttendance")
      .off("click")
      .on("click", function () {
        const id = $(this).data("id");
        const timein = $(this).data("timein");
        const timeout = $(this).data("timeout");
        const wrkhrs = $(this).data("wrkhrs");
        $("#timein").val("");
        $("#timeout").val("");
        $(".attendance-modal .modal").css("display", "block");
        $(".attendance-modal .content").css("display", "block");
        $("#timein").val(C24Format(timein));
        $("#timeout").val(C24Format(timeout));
        $("#saveAttendance").data("id", id);
      });

    $("#attendanceClosemodal").on("click", () => {
      $(".attendance-modal .modal").css("display", "none");
    });

    $("#saveAttendance")
      .off("click")
      .on("click", () => {
        const id = $("#saveAttendance").data("id");
        const data = {
          id: id,
          time1: C12Format($("#timein").val()),
          time2: C12Format($("#timeout").val()),
          wrkhrs: CWrkhrs($("#timein").val(), $("#timeout").val()),
        };

        Fetch(
          config.updateAttendance,
          "POST",
          (result) => {
            if (result.loading) {
              loading(true);
            }
            if (!result.loading) {
              loading(false);
              const res = result.data;
              if (!res.Error) {
                showMessage(
                  "Success",
                  "Attendance has been updated",
                  "success"
                ).then(() => {});
                return;
              }
              showMessage("Error", res.msg, "error");
            }
          },
          data
        );
      });
  });
};

function CWrkhrs(time1, time2) {
  const [hours1, minutes1] = time1.split(":").map(Number);
  const [hours2, minutes2] = time2.split(":").map(Number);
  const totalMinutes1 = hours1 * 60 + minutes1;
  const totalMinutes2 = hours2 * 60 + minutes2;
  const differenceInMinutes = Math.abs(totalMinutes2 - totalMinutes1);
  return differenceInMinutes;
}
function C12Format(timeStr) {
  let [hours, minutes] = timeStr.split(":");
  hours = parseInt(hours, 10);
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  hours = hours.toString().padStart(2, "0");
  minutes = minutes.padStart(2, "0");

  return `${hours}:${minutes} ${period}`;
}

function C24Format(timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");

  if (modifier === "PM" && hours !== "12") {
    hours = parseInt(hours, 10) + 12;
  } else if (modifier === "AM" && hours === "12") {
    hours = "00";
  }

  hours = hours.toString().padStart(2, "0");
  minutes = minutes.toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

function wrkhrs(minutes) {
  if (minutes - 60 <= 0) {
    return "";
  }
  var hours = Math.floor(minutes / 60);
  var minutes = minutes % 60;
  return `${hours}hrs and ${minutes}mins`;
}

setInterval(() => {
  const startDate = $("#startDate").val();
  const endDate = $("#endDate").val();
  if (
    startDate == "" ||
    (startDate == null && endDate == "") ||
    endDate == null
  ) {
    loadTables();
  }
}, 10000);

const onChangeDate = () => {
  $("#endDate").on("change", () => {
    let startDate = $("#startDate").val();
    let endDate = $("#endDate").val();
    let validate1 = false;
    let validate2 = false;
    if (endDate) {
      if (startDate.length == 0) {
        showMessage("Oppsss", "Please select start date first!", "info").then(
          () => {
            $("#endDate").val("");
            return;
          }
        );
      } else {
        validate1 = true;
      }
      if (startDate > endDate) {
        showMessage(
          "Oppsss",
          "End date should be greater than start date!",
          "info"
        ).then(() => {
          $("#endDate").val("");
          return;
        });
      } else {
        validate2 = true;
      }

      if (validate1 && validate2) {
        loadFilteredTable(startDate, endDate);
      } else {
        loadTables();
      }
    }
    // if (startDate.length == 0 && endDate.length > 0) {
    //   showMessage("Oppsss", "Please select start date first!", "info").then(
    //     () => {
    //       $("#endDate").val("");
    //     }
    //   );
    // }
    // if (startDate.length != 0 && startDate > endDate) {
    //   showMessage("Oppsss", "Invalid Date", "info").then(() => {
    //     $("#endDate").val("");
    //   });
    // } else {
    //   loadFilteredTable(startDate, endDate);
    // }
  });
};

const loadFilteredTable = (date1, date2) => {
  const data = {
    date1: date1,
    date2: date2,
  };
  Fetch(
    config.filteredAttendance,
    "POST",
    (result) => {
      if (result.loading) {
        loading(true);
      }
      if (!result.loading) {
        loading(false);
        const res = result.data;
        console.log(res);
        const tbl = $("#timesheetTable").empty();
        $.each(res, (index, data) => {
          tbl.append(
            "<tr>" +
              "<td>" +
              data.EmployeeID +
              "</td>" +
              "<td>" +
              data.name +
              "</td>" +
              "<td>" +
              data.TimeIn +
              "</td>" +
              "<td>" +
              data.TimeOut +
              "</td>" +
              "<td>" +
              wrkhrs(data.WorkHours) +
              "</td>" +
              "<td>" +
              data.Status +
              "</td>" +
              "<td>" +
              data.Date +
              "</td>" +
              "</tr>"
          );
        });
      }
    },
    data
  );
};
