import {
  payrollStartup,
  showMessage,
  loading,
  showOptions,
} from "./model/MyAlert.js";
import { Fetch } from "./model/bridge.js";
import config from "./model/config.js";
export function PayrollFunction() {
  $("#makepayroll").click(() => {
    Swal.fire({
      title: "Payroll Cut Off",
      html:
        "<center>First Cutoff : 26-10</center>" +
        "<center>Second Cutoff : 11-25</center>" +
        '<label for="date1">Start Date</label>' +
        '<input id="date1" class="swal2-input" type="date"><br>' +
        '<label for="date2">End Date</label>' +
        '<input id="date2" class="swal2-input" type="date">',
      showCancelButton: true,
      confirmButtonText: "Next",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const date1 = document.getElementById("date1").value;
        const date2 = document.getElementById("date2").value;
        // if ((date1.length = 0 || date2.length == 0)) {

        // }
        const data = {
          startDate: date1,
          endDate: date2,
        };
        return data;
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        if (
          result.value.startDate.length == 0 ||
          result.value.endDate.length == 0
        ) {
          showMessage("Error", "Invalid Date", "error");
          return;
        }

        if (result.value.startDate > result.value.endDate) {
          showMessage("Error", "Invalid Date", "error");
          return;
        }
        const startdate = new Date(result.value.startDate);
        const enddate = new Date(result.value.endDate);
        const startDay = startdate.getDate();
        const endDay = enddate.getDate();

        //first cutoff 11-25 second cutoff 26-10
        if (
          `${startDay}-${endDay}` == "11-25" ||
          `${startDay}-${endDay}` == "26-10"
        ) {
          localStorage.clear();
          localStorage.setItem("startDate", result.value.startDate);
          localStorage.setItem("endDate", result.value.endDate);
          localStorage.setItem("cutoff", `${startDay}-${endDay}`);
          localStorage.setItem("setPayroll", true);
          window.open(`payroll.html`, "_blank");
        } else {
          showMessage("Oopss", "Incorrect Cutoff", "info");
        }
      }
    });
  });

  loadLogs();

  setInterval(async () => {
    let defaultCount = localStorage.getItem("payrollcount");
    const count = await fetch(config.payrollLogs, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!count.ok) throw new console.error("Cannot connect to server");
    const result = await count.json();
    if (result.length != defaultCount) {
      localStorage.setItem("payrollcount", result.length);
      loadLogs();
    }
  }, 3000);
}
const loadLogs = () => {
  Fetch(config.payrollLogs, "GET", (result) => {
    if (result.loading) {
      loading(true);
    }
    if (!result.loading) {
      loading(false);
      const data = result.data;
      localStorage.setItem("payrollcount", data.length);
      const table = $(".payroll-details").empty();
      $.each(data, (i, res) => {
        table.append(
          "<details data-id='" +
            res.Cutoff +
            "' class='myindex'>" +
            "<summary>" +
            "<div class='parent'>" +
            "<div class='child-parent'>" +
            "<div class='left'>" +
            `Created: ${res.Created}------------Cutoff: ${res.Cutoff}` +
            "</div>" +
            "<div class='right'>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</summary>" +
            "<div class='other-details'>" +
            "</div>" +
            "</details>"
        );
      });
    }

    $(".myindex").on("click", function () {
      const id = $(this).data("id");
      const content = $(this).find(".other-details");
      if (!$(this).prop("open")) {
        const data = {
          cutoff: id,
        };
        Fetch(
          config.payrollCutoffLogs,
          "POST",
          (result) => {
            if (result.loading) {
              loading(true);
            }
            if (!result.loading) {
              setTimeout(() => {
                loadDetails(content, result, id);
                loading(false);
              }, 500);
            }
          },
          data
        );
      }
    });
  });
};

const loadDetails = (element, result, cutoff) => {
  const content = element.empty();
  content.append(
    '<div class="table-container">' +
      '<table class="payroll-tables">' +
      "<thead>" +
      "<tr>" +
      "<th>#</th>" +
      "<th>ID</th>" +
      "<th>Name</th>" +
      "<th>Rate</th>" +
      "<th>Working Days</th>" +
      "<th>Undertime</th>" +
      "<th>Leave</th>" +
      "<th>Basic Pay</th>" +
      "<th>RegularHoliday</th>" +
      "<th>RegularPay</th>" +
      "<th>SpecialHoliday</th>" +
      "<th>SpecialPay</th>" +
      "<th>Overtime Hrs</th>" +
      "<th>Overtime Pay</th>" +
      "<th>Allowance</th>" +
      "<th>Salary Adj</th>" +
      "<th>Total Earnings</th>" +
      "<th>Gross Pay</th>" +
      "<th>PAG-IBIG</th>" +
      "<th>PHILHEALTH</th>" +
      "<th>SSS</th>" +
      "<th>TAX</th>" +
      "<th>Deduction</th>" +
      "<th>Total Deduct</th>" +
      "<th>NetPay</th>" +
      "</tr>" +
      "</thead>" +
      '<tbody class="payroll-table"></tbody>' +
      "</table>" +
      "</div>" +
      "<button class='exportCutoff' data-id='" +
      cutoff +
      "'>Export</button>" +
      "<button class='deleteCutoff' data-id='" +
      cutoff +
      "'>Delete</button>"
  );

  $(".exportCutoff").on("click", function () {
    const cutoff = $(this).data("id");
    const tableContainer = $(this).prev(".table-container");
    console.log(tableContainer);
    if (tableContainer.length > 0) {
      const table = tableContainer.find(".payroll-tables");
      TableToExcel.convert(table[0], {
        name: "Payroll.xlsx",
        sheet: {
          name: cutoff,
        },
      });
    }
  });

  $(".deleteCutoff").on("click", function () {
    const id = $(this).data("id");
    const data = {
      cutoff: id,
    };
    showOptions(
      id,
      "You want to delete this generated payroll?",
      "info",
      () => {
        Fetch(
          config.deleteCutoff,
          "POST",
          (result) => {
            console.log(result);
            if (result.loading) {
              loading(true);
            }

            if (!result.loading) {
              loading(false);
              if (result.data.Error) {
                showMessage("Error", result.data.msg, "error");
                return;
              }

              showMessage(
                "Success",
                "Payroll has been deleted",
                "success"
              ).then(() => {
                PayrollFunction();
              });
            }
          },
          data
        );
      }
    );
  });

  const tbl = content.find(".payroll-table").empty();
  let count = 0;
  $.each(result.data, (i, res) => {
    count += 1;
    tbl.append(
      "<tr>" +
        "<td>" +
        count +
        "</td>" +
        "<td>" +
        res.EmployeeID +
        "</td>" +
        "<td>" +
        res.Name +
        "</td>" +
        "<td>" +
        res.Rate +
        "</td>" +
        "<td>" +
        `${res.WorkDays}` +
        "</td>" +
        "<td>" +
        `${res.Undertime}` +
        "</td>" +
        "<td>" +
        res.TotalLeave +
        "</td>" +
        "<td>" +
        res.BasicPay +
        "</td>" +
        "<td>" +
        res.RegularHoliday +
        "</td>" +
        "<td>" +
        `${res.RegularHolidayPay}` +
        "</td>" +
        "<td>" +
        res.SpecialHoliday +
        "</td>" +
        "<td>" +
        `${res.SpecialHolidayPay}` +
        "</td>" +
        "<td>" +
        res.OvertimeHrs +
        "</td>" +
        "<td>" +
        `${res.OvertimePay}` +
        "</td>" +
        "<td>" +
        res.Allowance +
        "</td>" +
        "<td>" +
        res.SalaryAdjustment +
        "</td>" +
        "<td>" +
        `${res.TotalEarnings}` +
        "</td>" +
        "<td>" +
        `${res.Grosspay}` +
        "</td>" +
        "<td>" +
        `${res.PAGIBIG}` +
        "</td>" +
        "<td>" +
        `${res.PHILHEALTH}` +
        "</td>" +
        "<td>" +
        `${res.SSS}` +
        "</td>" +
        "<td>" +
        `${res.TAX}` +
        "</td>" +
        "<td>" +
        `${res.Deduction}` +
        "</td>" +
        "<td>" +
        `${res.TotalDeduction}` +
        "</td>" +
        "<td>" +
        `${res.Netpay}` +
        "</td>" +
        "</tr>"
    );
  });
};
