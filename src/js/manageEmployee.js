import { showMessage, showOptions, loading } from "./model/MyAlert.js";
import { Fetch } from "./model/bridge.js";
import config from "./model/config.js";

$(() => {});
export function ManageFunction() {
  showEmployee();
  loadDropdownPositions();
  loadDropdownTypes();
  loadDropdownRate();
  loadDropdownSchedule();
  addEmployee();

  // $("#search")
  //   .off("input")
  //   .on("input", function () {
  //     let data = $(this).val();
  //     if (data.length == 0) {
  //       showEmployee();
  //       return;
  //     }
  //   });

  $("#search")
    .off("change")
    .on("change", function () {
      let data = $(this).val();
      if (data.length == 0) {
        showEmployee();
        return;
      }
      $("#row-manageEmployee").empty();
      showEmployeeFiltered(data);
      return;
    });
}
const showEmployeeFiltered = (id) => {
  const UID = {
    id: id,
  };

  const tbl = $("#row-manageEmployee").empty();
  Fetch(
    config.showEmployeefiltered,
    "POST",
    (result) => {
      if (result.loading) {
        loading(true);
      }
      if (!result.loading) {
        loading(false);
        const data = result.data;
        $.each(data, function (index, data) {
          let td = "";
          if (data.Status == "Active") {
            td = `<td class='Active'>${data.Status}</td>`;
          } else {
            td = `<td class='Inactive'>${data.Status}</td>`;
          }
          tbl.append(
            "<tr>" +
              "<td>" +
              data.EmployeeID +
              "</td>" +
              "<td>" +
              data.Lastname +
              "</td>" +
              "<td>" +
              data.Firstname +
              "</td>" +
              "<td>" +
              data.Middlename +
              "</td>" +
              "<td>" +
              data.Suffix +
              "</td>" +
              "<td>" +
              data.Type +
              "</td>" +
              "<td>" +
              data.Position +
              "</td>" +
              "<td>" +
              data.Rate +
              "</td>" +
              "<td>" +
              data.Schedule +
              "</td>" +
              td +
              "<td class='btn-grp'>" +
              "<button class='manage-edit' data-positionid='" +
              data.PositionID +
              "' data-typeid='" +
              data.TypeID +
              "' data-fname='" +
              data.Firstname +
              "' data-mname='" +
              data.Middlename +
              "' data-lname='" +
              data.Lastname +
              "' data-suffix='" +
              data.Suffix +
              "' data-rate='" +
              data.rateID +
              "' data-status='" +
              data.Status +
              "' data-sched='" +
              data.schedID +
              "'  data-id=" +
              data.EmployeeID +
              "><i class='far fa-edit'></i></button><button class='manage-remove' data-id=" +
              data.EmployeeID +
              " ><i class='far fa-user-times'></i></button>" +
              "</td>" +
              "</tr>"
          );
        });
      }
    },
    UID
  );

  $("#row-manageEmployee").on("click", ".manage-remove", function (e) {
    e.preventDefault();
    const id = $(this).data("id");
    const data = {
      uid: id,
    };
    showOptions(
      "You want to remove this employee?",
      "You cannot revert this action",
      "warning",
      () => {
        Fetch(
          config.removeEmployee,
          "POST",
          (result) => {
            if (result.loading) {
              loading(true);
            }
            if (!result.loading) {
              loading(false);
              const res = result.data;
              if (res.Error == false) {
                showMessage(
                  "Success",
                  "Selected employee has been removed",
                  "success"
                ).then(() => {
                  showEmployee();
                });
              } else {
                showMessage(
                  "Error",
                  "Selected employee has not been removed",
                  "error"
                );
              }
            }
          },
          data
        );
      }
    );
  });
  $("#row-manageEmployee").on("click", ".manage-edit", function (e) {
    e.preventDefault();
    const id = $(this).data("id");
    const fname = $(this).data("fname");
    const mname = $(this).data("mname");
    const lname = $(this).data("lname");
    const type = $(this).data("typeid");
    const position = $(this).data("positionid");
    const suffix = $(this).data("suffix");
    const rate = $(this).data("rate");
    const sched = $(this).data("sched");
    const status = $(this).data("status");
    $(".edit_employee_modal .modal").css("display", "block");
    $(".edit_employee_modal .content").css("display", "block");

    $(".edit_employee_modal #Employeeid").val(id);
    $(".edit_employee_modal #firstname").val(fname);
    $(".edit_employee_modal #middlename").val(mname);
    $(".edit_employee_modal #lastname").val(lname);
    $(".edit_employee_modal #suffix").val(suffix);
    $(".edit_employee_modal #manage_employeetype").val(type);
    $(".edit_employee_modal #manage_employeeposition").val(position);
    $(".edit_employee_modal #employeeRate").val(rate);
    $(".edit_employee_modal #employeeSchedule").val(sched);
    $(".edit_employee_modal #employeeStatus").val(status);
  });
  $("#form-editemployee").submit(function (e) {
    e.preventDefault();
    const frmdata = new FormData(this);
    const data = {
      uid: frmdata.get("Employeeid"),
      fname: frmdata.get("firstname"),
      mname: frmdata.get("middlename"),
      lname: frmdata.get("lastname"),
      suffix: frmdata.get("suffix"),
      type: frmdata.get("manage_employeetype"),
      pos: frmdata.get("manage_employeeposition"),
      rate: frmdata.get("employeeRate"),
      sched: frmdata.get("employeeSchedule"),
      status: frmdata.get("employeeStatus"),
    };
    showOptions("Are you sure?", "", "warning", () => {
      Fetch(
        config.editEmployee,
        "POST",
        (result) => {
          if (result.loading) {
            loading(true);
          }
          if (!result.loading) {
            const res = result.data;
            if (res.Error == false) {
              $(".edit_employee_modal .modal").css("display", "none");
              $(".edit_employee_modal .content").css("display", "none");

              showMessage(
                "Success",
                "Employee information has been updated",
                "success"
              ).then(function () {
                showEmployee();
              });
            } else {
              showMessage("Error", res.msg, "error");
            }
          }
        },
        data
      );
    });
  });

  $("#editCloseModal").click(function (e) {
    e.preventDefault();
    $(".edit_employee_modal .modal").css("display", "none");
    $(".edit_employee_modal .content").css("display", "none");
  });
};
export const loadDropdownTypes = () => {
  const tbl = $(".manage_employee_modal #manage_employeetype").empty();
  const tbl1 = $(".edit_employee_modal #manage_employeetype").empty();
  tbl.append(
    " <option value=" + 0 + " disabled selected >Select Employee Type</option>"
  );
  tbl1.append(
    " <option value=" + 0 + " disabled selected >Select Employee Type</option>"
  );
  Fetch(config.showTypes, "GET", (res) => {
    if (!res.loading) {
      const result = res.data;
      $.each(result, function (index, data) {
        tbl.append("<option value=" + data.id + ">" + data.Type + "</option>");
        tbl1.append("<option value=" + data.id + ">" + data.Type + "</option>");
      });
    }
  });
};
export const loadDropdownPositions = () => {
  const tbl = $(".manage_employee_modal #manage_employeeposition").empty();
  const tbl1 = $(".edit_employee_modal #manage_employeeposition").empty();
  tbl.append(
    " <option value=" +
      0 +
      " disabled selected >Select Employee Position</option>"
  );
  tbl1.append(
    " <option value=" +
      0 +
      " disabled selected >Select Employee Position</option>"
  );
  Fetch(config.showPos, "GET", (res) => {
    if (!res.loading) {
      const result = res.data;
      $.each(result, function (index, data) {
        tbl.append(
          "<option value=" + data.id + ">" + data.Position + "</option>"
        );
        tbl1.append(
          "<option value=" + data.id + ">" + data.Position + "</option>"
        );
      });
    }
  });
};
export const loadDropdownRate = () => {
  const tbl = $(".manage_employee_modal #employeeRate").empty();
  const tbl1 = $(".edit_employee_modal #employeeRate").empty();
  tbl.append(
    " <option value=" + 0 + " disabled selected >Select Employee Rate</option>"
  );
  tbl1.append(
    " <option value=" + 0 + " disabled selected >Select Employee Rate</option>"
  );
  Fetch(config.showRates, "GET", (res) => {
    if (!res.loading) {
      const result = res.data;
      $.each(result, function (index, data) {
        tbl.append("<option value=" + data.id + ">" + data.Rate + "</option>");
        tbl1.append("<option value=" + data.id + ">" + data.Rate + "</option>");
      });
    }
  });
};

export const loadDropdownSchedule = () => {
  const tbl = $(".manage_employee_modal #employeeSchedule").empty();
  const tbl1 = $(".edit_employee_modal #employeeSchedule").empty();
  tbl.append(
    " <option value=" +
      0 +
      " disabled selected >Select Employee Schedule</option>"
  );
  tbl1.append(
    " <option value=" +
      0 +
      " disabled selected >Select Employee Schedule</option>"
  );
  Fetch(config.showSched, "GET", (res) => {
    if (!res.loading) {
      const result = res.data;
      $.each(result, function (index, data) {
        tbl.append(
          "<option value=" + data.id + ">" + data.Schedule + "</option>"
        );
        tbl1.append(
          "<option value=" + data.id + ">" + data.Schedule + "</option>"
        );
      });
    }
  });
};

const showEmployee = () => {
  const tbl = $("#row-manageEmployee").empty();
  Fetch(config.showEmployee, "GET", (result) => {
    if (result.loading) {
      loading(true);
    }
    if (!result.loading) {
      loading(false);
      const data = result.data;
      $.each(data, function (index, data) {
        let td = "";
        if (data.Status == "Active") {
          td = `<td class='Active'>${data.Status}</td>`;
        } else {
          td = `<td class='Inactive'>${data.Status}</td>`;
        }
        tbl.append(
          "<tr>" +
            "<td>" +
            data.EmployeeID +
            "</td>" +
            "<td>" +
            data.Lastname +
            "</td>" +
            "<td>" +
            data.Firstname +
            "</td>" +
            "<td>" +
            data.Middlename +
            "</td>" +
            "<td>" +
            data.Suffix +
            "</td>" +
            "<td>" +
            data.Type +
            "</td>" +
            "<td>" +
            data.Position +
            "</td>" +
            "<td>" +
            data.Rate +
            "</td>" +
            "<td>" +
            data.Schedule +
            "</td>" +
            td +
            "<td class='btn-grp'>" +
            "<button class='manage-edit' data-positionid='" +
            data.PositionID +
            "' data-typeid='" +
            data.TypeID +
            "' data-fname='" +
            data.Firstname +
            "' data-mname='" +
            data.Middlename +
            "' data-lname='" +
            data.Lastname +
            "' data-suffix='" +
            data.Suffix +
            "' data-rate='" +
            data.rateID +
            "' data-status='" +
            data.Status +
            "' data-sched='" +
            data.schedID +
            "'  data-id=" +
            data.EmployeeID +
            "><i class='far fa-edit'></i></button><button class='manage-remove' data-id=" +
            data.EmployeeID +
            " ><i class='far fa-user-times'></i></button>" +
            "</td>" +
            "</tr>"
        );
      });
    }
  });

  $("#row-manageEmployee").on("click", ".manage-remove", function (e) {
    e.preventDefault();
    const id = $(this).data("id");
    const data = {
      uid: id,
    };
    showOptions(
      "You want to remove this employee?",
      "You cannot revert this action",
      "warning",
      () => {
        Fetch(
          config.removeEmployee,
          "POST",
          (result) => {
            if (result.loading) {
              loading(true);
            }
            if (!result.loading) {
              loading(false);
              const res = result.data;
              if (res.Error == false) {
                showMessage(
                  "Success",
                  "Selected employee has been removed",
                  "success"
                ).then(() => {
                  showEmployee();
                });
              } else {
                showMessage(
                  "Error",
                  "Selected employee has not been removed",
                  "error"
                );
              }
            }
          },
          data
        );
      }
    );
  });
  $("#row-manageEmployee").on("click", ".manage-edit", function (e) {
    e.preventDefault();
    const id = $(this).data("id");
    const fname = $(this).data("fname");
    const mname = $(this).data("mname");
    const lname = $(this).data("lname");
    const type = $(this).data("typeid");
    const position = $(this).data("positionid");
    const suffix = $(this).data("suffix");
    const rate = $(this).data("rate");
    const sched = $(this).data("sched");
    const status = $(this).data("status");
    $(".edit_employee_modal .modal").css("display", "block");
    $(".edit_employee_modal .content").css("display", "block");

    $(".edit_employee_modal #Employeeid").val(id);
    $(".edit_employee_modal #firstname").val(fname);
    $(".edit_employee_modal #middlename").val(mname);
    $(".edit_employee_modal #lastname").val(lname);
    $(".edit_employee_modal #suffix").val(suffix);
    $(".edit_employee_modal #manage_employeetype").val(type);
    $(".edit_employee_modal #manage_employeeposition").val(position);
    $(".edit_employee_modal #employeeRate").val(rate);
    $(".edit_employee_modal #employeeSchedule").val(sched);
    $(".edit_employee_modal #employeeStatus").val(status);
  });
  $("#form-editemployee").submit(function (e) {
    e.preventDefault();
    const frmdata = new FormData(this);
    const data = {
      uid: frmdata.get("Employeeid"),
      fname: frmdata.get("firstname"),
      mname: frmdata.get("middlename"),
      lname: frmdata.get("lastname"),
      suffix: frmdata.get("suffix"),
      type: frmdata.get("manage_employeetype"),
      pos: frmdata.get("manage_employeeposition"),
      rate: frmdata.get("employeeRate"),
      sched: frmdata.get("employeeSchedule"),
      status: frmdata.get("employeeStatus"),
    };
    showOptions("Are you sure?", "", "warning", () => {
      Fetch(
        config.editEmployee,
        "POST",
        (result) => {
          if (result.loading) {
            loading(true);
          }
          if (!result.loading) {
            const res = result.data;
            if (res.Error == false) {
              $(".edit_employee_modal .modal").css("display", "none");
              $(".edit_employee_modal .content").css("display", "none");

              showMessage(
                "Success",
                "Employee information has been updated",
                "success"
              ).then(() => {
                showEmployee();
              });
            } else {
              showMessage("Error", res.msg, "error");
            }
          }
        },
        data
      );
    });
  });

  $("#editCloseModal").click(function (e) {
    e.preventDefault();
    $(".edit_employee_modal .modal").css("display", "none");
    $(".edit_employee_modal .content").css("display", "none");
  });
};

const addEmployee = () => {
  $("#form-addemployee")
    .off("submit")
    .on("submit", function (e) {
      e.preventDefault();
      const frmdata = new FormData(this);
      const data = {
        uid: frmdata.get("Employeeid"),
        fname: frmdata.get("firstname"),
        mname: frmdata.get("middlename"),
        lname: frmdata.get("lastname"),
        suffix: frmdata.get("suffix"),
        type: frmdata.get("manage_employeetype"),
        pos: frmdata.get("manage_employeeposition"),
        rate: frmdata.get("employeeRate"),
        sched: frmdata.get("employeeSchedule"),
        status: frmdata.get("employeeStatus"),
      };
      if (
        !inputChecker() &&
        frmdata.get("manage_employeetype") !== null &&
        frmdata.get("manage_employeeposition") !== null
      ) {
        Fetch(
          config.addEmployee,
          "POST",
          (result) => {
            const data = result.data;
            if (result.loading) {
              loading(true);
            }
            if (!result.loading) {
              loading(false);
              if (data.Error == false) {
                $(".manage_employee_modal .modal").css("display", "none");
                $(".manage_employee_modal .content").css("display", "none");
                showMessage(
                  "Success",
                  "Employee Added Successfully",
                  "success"
                ).then(() => {
                  showEmployee();
                });
                $("input[type='text']", $("#form-addemployee")).val("");
                $("#manage_employeetype")
                  .find("option[value='" + 0 + "']")
                  .prop("selected", true);
                $("#manage_employeeposition")
                  .find("option[value='" + 0 + "']")
                  .prop("selected", true);
              } else {
                showMessage("Oopsss", data.msg, "error");
              }
            }
          },
          data
        );
      } else {
        showMessage("Oopss", "Please fill out all fields", "warning");
      }
    });
};

const inputChecker = () => {
  const form = $("#form-addemployee");
  const entries = $("input[type='text']", form);
  let isEmpty = false;
  entries.each(function () {
    if ($(this).hasClass("empty")) {
      if ($(this).val() !== "") return;
    } else {
      isEmpty = $(this).val() === "" ? true : isEmpty;
    }
  });
  return isEmpty;
};
