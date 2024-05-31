import { Fetch } from "./model/bridge.js";
import { showMessage, showOptions, loading } from "./model/MyAlert.js";
import config from "./model/config.js";

$(() => {
  if (!localStorage.getItem("setPayroll")) {
    showMessage("Warning", "Prohibited Action", "info").then(() => {
      if (!localStorage.getItem("isLoggedIn")) {
        window.location.href = "main.html";
      } else {
        window.location.href = "index.html";
      }
    });
    return;
  }
  $("#title").html(
    `Payroll Cutoff: ${localStorage.getItem(
      "startDate"
    )} - ${localStorage.getItem("endDate")}`
  );
  showTable();
  ModaladdAllowance();
  ModaladdDeduction();
  ModaladdAdjustment();
  CloseModal();
  generatePayroll();
  deduct();
  scrollMe();
  is2ndCutoff();
});

const is2ndCutoff = () => {
  const cutoff = localStorage.getItem("cutoff");
  if (cutoff != "11-25") {
    $(".chckboxdeduct").css("visibility", "hidden");
    return;
  }
  $(".chckboxdeduct").css("visibility", "visible");
};

const scrollMe = () => {
  $(".table-container").on("wheel", function () {
    const delta = Math.sign(event.deltaY);
    this.scrollLeft += delta * 200;
  });
};

const deduct = () => {
  $("#chckbox").on("change", () => {
    showTable();
  });
};

const generatePayroll = () => {
  $("#genPayroll")
    .off("click")
    .on("click", () => {
      let employee = [];
      $.each($(".payroll-table tr"), function () {
        const ID = $(this).find("td").eq(1).text();
        const rate = $(this).find("td").eq(4).text();
        const wrkdays = $(this).find("td").eq(6).text();
        const undertime = $(this).find("td").eq(7).text();
        const leave = $(this).find("td").eq(8).text();
        const basicpay = $(this).find("td").eq(9).text();
        const regularholiday = $(this).find("td").eq(10).text();
        const regularPay = $(this).find("td").eq(11).text();
        const specialHoliday = $(this).find("td").eq(12).text();
        const specialPay = $(this).find("td").eq(13).text();
        const overtimeHrs = $(this).find("td").eq(15).text();
        const overtimePay = $(this).find("td").eq(16).text();
        const allowance = $(this).find("td").eq(17).text();
        const salaryAdjustment = $(this).find("td").eq(18).text();
        const totalearnings = $(this).find("td").eq(19).text();
        const grosspay = $(this).find("td").eq(20).text();
        const pagibig = $(this).find("td").eq(21).text();
        const philhealth = $(this).find("td").eq(22).text();
        const sss = $(this).find("td").eq(23).text();
        const tax = $(this).find("td").eq(24).text();
        const deduction = $(this).find("td").eq(25).text();
        const totaldeduct = $(this).find("td").eq(26).text();
        const netpay = $(this).find("td").eq(27).text();

        employee.push({
          ID: ID,
          rate: rate,
          wrkdays: wrkdays,
          undertime: undertime,
          leave: leave,
          basicpay: basicpay,
          regularholiday: regularholiday,
          regularPay: regularPay,
          specialHoliday: specialHoliday,
          specialPay: specialPay,
          overtimeHrs: overtimeHrs,
          overtimePay: overtimePay,
          allowance: allowance,
          salaryAdjustment: salaryAdjustment,
          totalearnings: totalearnings,
          grosspay: grosspay,
          pagibig: pagibig,
          philhealth: philhealth,
          sss: sss,
          tax: tax,
          deduction: deduction,
          totaldeduct: totaldeduct,
          netpay: netpay,
        });
      });
      setTimeout(() => {
        showOptions("Are you sure?", "", "info", () => {
          const PayrollDetails = {
            cutoff: `${localStorage.getItem(
              "startDate"
            )}-${localStorage.getItem("endDate")}`,
            details: employee,
          };
          Fetch(
            config.addPayroll,
            "POST",
            (result) => {
              if (result.loading) {
                loading(true);
              }
              if (!result.loading) {
                loading(false);
                if (result.data.Error) {
                  showMessage("Oppsss", result.data.msg, "error");
                  return;
                }
                localStorage.setItem("setPayroll", false);
                showMessage(
                  `${localStorage.getItem("startDate")}-${localStorage.getItem(
                    "endDate"
                  )}`,
                  "Payroll has been created, this page will be close in 3seconds",
                  "success"
                ).then(() => {
                  localStorage.setItem("setPayroll", false);
                });
                closeMe();
              }
            },
            PayrollDetails
          );
        });
      }, 100);
    });
};

const closeMe = () => {
  setTimeout(() => {
    window.close();
  }, 3000);
};

const CloseModal = () => {
  $(".close").click(() => {
    $(".additional_modal .modal").css("display", "none");
  });
};

const populateEmployee = () => {
  Fetch(config.showEmployee, "GET", (result) => {
    const tbl = $("#dropdownEmployee").empty();
    tbl.append("<option value='' selected disabled>Select Employee</option>");
    if (result.loading) {
      loading(true);
    }
    if (!result.loading) {
      loading(false);
      const data = result.data;
      $.each(data, (i, res) => {
        let name = `${res.Firstname} ${res.Lastname}`;
        tbl.append(
          " <option value='" + res.EmployeeID + "'>" + name + "</option>"
        );
      });
    }
  });
};

const ModaladdAllowance = () => {
  $("#modal_addAllowance")
    .off("click")
    .on("click", () => {
      $(".additional_modal .modal").css("display", "block");
      $("#targetText").html("Add Allowance");
      $(".additional-table").empty();
      populateEmployee();
      addModalItem();
    });
};

const ModaladdDeduction = () => {
  $("#modal_addDeduction")
    .off("click")
    .on("click", () => {
      $(".additional_modal .modal").css("display", "block");
      $("#targetText").html("Add Deduction");
      $(".additional-table").empty();
      populateEmployee();
      addModalItem();
    });
};

const ModaladdAdjustment = () => {
  $("#modal_addAdjustment")
    .off("click")
    .on("click", () => {
      $(".additional_modal .modal").css("display", "block");
      $("#targetText").html("Add Adjustment");
      $(".additional-table").empty();
      populateEmployee();
      addModalItem();
    });
};
$("#dropdownEmployee").on("change", () => {
  const uid = $("#dropdownEmployee").val();
  const target = $("#targetText").html();
  const cutoff = `${localStorage.getItem("startDate")}-${localStorage.getItem(
    "endDate"
  )}`;

  switch (target) {
    case "Add Allowance":
      showModalItem(uid, cutoff, "allowance", "Allowance");
      break;
    case "Add Deduction":
      showModalItem(uid, cutoff, "deduction", "Deduction");
      break;
    case "Add Adjustment":
      showModalItem(uid, cutoff, "adjustment", "Adjustment");
      break;
  }
});
const addModalItem = () => {
  $("#add-modal-item")
    .off("click")
    .on("click", () => {
      const target = $("#targetText").html();
      const name = $("#name").val();
      const amount = $("#amount").val();
      const uid = $("#dropdownEmployee").val();
      const cutoff = `${localStorage.getItem(
        "startDate"
      )}-${localStorage.getItem("endDate")}`;
      if (
        target == "" ||
        name == "" ||
        amount == "" ||
        uid == null ||
        isNaN(amount)
      ) {
        showMessage("Ooopsss", "Please try again", "info");
        return;
      }

      switch (target) {
        case "Add Allowance":
          addModalEmployeeAdditional(
            uid,
            name,
            amount,
            cutoff,
            "allowance",
            "Allowance"
          );
          break;
        case "Add Deduction":
          addModalEmployeeAdditional(
            uid,
            name,
            amount,
            cutoff,
            "deduction",
            "Deduction"
          );
          break;
        case "Add Adjustment":
          addModalEmployeeAdditional(
            uid,
            name,
            amount,
            cutoff,
            "adjustment",
            "Adjustment"
          );
          break;
      }
    });
};

const showModalItem = (id, cutoff, table, target) => {
  const data = {
    id: id,
    cutoff: cutoff,
    table: table,
  };
  Fetch(
    config.showPayrollAdjustment,
    "POST",
    (result) => {
      const tbl = $(".additional-table").empty();
      if (result.loading) {
        loading(true);
      }
      if (!result.loading) {
        loading(false);
        const data = result.data;
        $.each(data.data, (i, res) => {
          tbl.append(
            "<tr>" +
              "<td>" +
              res[target] +
              "</td>" +
              "<td>" +
              res.Amount +
              "</td>" +
              "<td><div class='remove-modal-item' data-id='" +
              res.id +
              "'><i class='fa-solid fa-xmark'></i></div></td>" +
              "</tr>"
          );
        });

        $(".remove-modal-item").on("click", function () {
          const raw = $(this).data("id");
          const data = {
            id: raw,
            table: table,
          };
          console.log(data);
          Fetch(
            config.payrollDeleteAdjustment,
            "POST",
            (result) => {
              if (result.loading) {
                loading(true);
              }
              if (!result.loading) {
                loading(false);
                const rawdata = result.data;
                if (rawdata.Error) {
                  showMessage("Error", "Please try again", "error");
                  return;
                }
                showMessage("Success", rawdata.msg, "success").then(() => {
                  switch (target) {
                    case "Allowance":
                      showModalItem(id, cutoff, "allowance", "Allowance");
                      showTable();
                      break;
                    case "Deduction":
                      showModalItem(id, cutoff, "deduction", "Deduction");
                      showTable();
                      break;
                    case "Adjustment":
                      showModalItem(id, cutoff, "adjustment", "Adjustment");
                      showTable();
                      break;
                  }
                });
              }
            },
            data
          );
        });
      }
    },
    data
  );
};

const addModalEmployeeAdditional = (
  id,
  name,
  amount,
  cutoff,
  table,
  column
) => {
  const data = {
    id: id,
    name: name,
    amount: amount,
    cutoff: cutoff,
    table: table,
    column: column,
  };
  Fetch(
    config.payrollAdjustment,
    "POST",
    (result) => {
      if (result.loading) {
        loading(true);
      }
      if (!result.loading) {
        loading(false);
        const data = result.data;
        if (data.Error) {
          showMessage("Ooppss", "Please try again", "error");
          return;
        }
        showMessage("Success", data.msg, "success").then(() => {
          $("#name").val("");
          $("#amount").val("");
          switch (column) {
            case "Allowance":
              showModalItem(id, cutoff, "allowance", "Allowance");
              showTable();
              return;
            case "Deduction":
              showModalItem(id, cutoff, "deduction", "Deduction");
              showTable();
              return;
            case "Adjustment":
              showModalItem(id, cutoff, "adjustment", "Adjustment");
              showTable();
              return;
          }
          return;
        });
      }
    },
    data
  );
};

const EmployeeTax = (totalgrosspay) => {
  const totalGross = totalgrosspay;
  let tax = 0;
  const tbl = [
    { f_range: 20833, s_range: 33330, tax: true, percent: 15, value: 20833 },
    { f_range: 33333, s_range: 66666, tax: true, percent: 20, value: 33333 },
    { f_range: 66667, s_range: 166666, tax: true, percent: 25, value: 66667 },
    { f_range: 166667, s_range: 666666, tax: true, percent: 30, value: 166667 },
    {
      f_range: 666667,
      s_range: 9999999999999,
      tax: true,
      percent: 35,
      value: 666667,
    },
  ];

  $.each(tbl, (i, data) => {
    if (totalGross >= data.f_range && totalGross <= data.s_range) {
      tax = (totalGross - data.value) * (data.percent / 100);
      return;
    }
  });
  return tax;
};

const showTable = () => {
  Fetch(config.payrollEmployee, "GET", (result) => {
    const tbl = $(".payroll-table").empty();
    if (result.loading) {
      loading(true);
    }
    if (!result.loading) {
      const data = result.data;
      const rowresult = data.length;
      var count = 0;
      $.each(data, async (i, data) => {
        const name = `${data.Firstname} ${data.Lastname}`;
        const id = data.EmployeeID;
        const raw = await details(id);
        console.log(raw);
        const SSSRate = await contributions("SSS");
        const PAGIBIGRate = await contributions("PAGIBIG");
        const PHILHEALTHRate = await contributions("PHILHEALTH");
        const allowance = raw.allowance == null ? 0 : parseFloat(raw.allowance);
        const adjustment =
          raw.adjustment == null ? 0 : parseFloat(raw.adjustment);
        const deduction = raw.deduction == null ? 0 : parseFloat(raw.deduction);
        const hrRate = parseInt(data.rateValue) / 8;
        count += 1;
        //START COMPUTATION
        const txt_wrkdays = `${raw.wrkdays} days`;
        const txt_undertime = `${raw.undertimehrs} hrs`;
        const txt_leave = raw.leave == 0 ? "0" : `${raw.leave} days`;
        const txt_RegHoliday =
          raw.regularHoliday.count == 0
            ? "0"
            : `${raw.regularHoliday.count} days`;

        const txt_RegHolidayPay = raw.regularHolidayPay.total;
        const txt_SpecHoliday =
          raw.specialHoliday.count == 0
            ? "0"
            : `${raw.specialHoliday.count} days`;
        `${raw.specialHoliday.count} days`;

        const txt_SpecHolidayPay = raw.specialHolidayPay.total;

        const txt_basicpay =
          (parseInt(raw.wrkdays - raw.undertime) + parseInt(txt_leave)) *
            data.rateValue +
          hrRate * parseInt(txt_undertime);
        const txt_overtime = `${raw.overtime} days`;
        const txt_overtimeHrs = `${raw.overtimehrs} hrs`;
        const txt_overtimePay = `${parseFloat(
          hrRate * 1.25 * parseInt(txt_overtimeHrs)
        ).toFixed(2)}`;
        const txt_totalearnings =
          parseFloat(txt_overtimePay) +
          parseInt(adjustment) +
          parseInt(allowance) +
          parseFloat(txt_SpecHolidayPay) +
          parseFloat(txt_RegHolidayPay);
        const grosspay = txt_basicpay + txt_totalearnings;
        const lastgrosspay = raw.lastgrosspay;
        const total_gross =
          parseFloat(grosspay) + parseFloat(lastgrosspay.replace(/₱/g, ""));
        let txtPagibig = PAGIBIGRate;
        let txtphilhealth = PHILHEALTHRate;
        let txtsss = SSSRate;
        let txtTax = EmployeeTax(total_gross);
        if (!$("#chckbox").is(":checked")) {
          txtPagibig = 0;
          txtphilhealth = 0;
          txtsss = 0;
          txtTax = 0;
        }
        const txtTotalDeduct =
          txtPagibig + txtphilhealth + txtsss + deduction + txtTax;
        const netPay = grosspay - txtTotalDeduct;
        //END COMPUTATION
        tbl.append(
          "<tr>" +
            "<td>" +
            count +
            "</td>" +
            "<td>" +
            id +
            "</td>" +
            "<td>" +
            name +
            "</td>" +
            "<td>" +
            data.Rate +
            "</td>" +
            "<td>" +
            `₱ ${data.rateValue}` +
            "</td>" +
            "<td>" +
            `₱ ${hrRate}` +
            "</td>" +
            "<td>" +
            txt_wrkdays +
            "</td>" +
            "<td>" +
            txt_undertime +
            "</td>" +
            "<td>" +
            txt_leave +
            "</td>" +
            "<td>" +
            `₱ ${txt_basicpay}` +
            "</td>" +
            "<td>" +
            txt_RegHoliday +
            "</td>" +
            "<td>" +
            `₱ ${txt_RegHolidayPay}` +
            "</td>" +
            "<td>" +
            txt_SpecHoliday +
            "</td>" +
            "<td>" +
            `₱ ${txt_SpecHolidayPay}` +
            "</td>" +
            "<td>" +
            txt_overtime +
            "</td>" +
            "<td>" +
            txt_overtimeHrs +
            "</td>" +
            "<td>" +
            `₱ ${txt_overtimePay}` +
            "</td>" +
            "<td>" +
            `₱ ${allowance}` +
            "</td>" +
            "<td>" +
            `₱ ${adjustment}` +
            "</td>" +
            "<td>" +
            `₱ ${txt_totalearnings.toFixed(2)}` +
            "</td>" +
            "<td>" +
            `₱ ${grosspay.toFixed(2)}` +
            "</td>" +
            "<td>" +
            `₱ ${txtPagibig.toFixed(2)}` +
            "</td>" +
            "<td>" +
            `₱ ${txtphilhealth.toFixed(2)}` +
            "</td>" +
            "<td>" +
            `₱ ${txtsss.toFixed(2)}` +
            "</td>" +
            "<td>" +
            `₱ ${txtTax.toFixed(2)}` +
            "</td>" +
            "<td>" +
            `₱ ${deduction}` +
            "</td>" +
            "<td>" +
            `₱ ${txtTotalDeduct.toFixed(2)}` +
            "</td>" +
            "<td>" +
            `₱ ${netPay.toFixed(2)}` +
            "</td>" +
            "</tr>"
        );
        if (rowresult == tbl.find("tr").length) {
          loading(false);
        }
      });

      if (tbl.find("tr")) {
        $(".table-container table tbody tr").on("click", function () {
          $(".table-container table tbody tr").removeClass("active");
          $(this).addClass("active");
        });
      }
    }
  });
};

async function contributions(target) {
  const data = {
    target: target,
  };
  const response = await fetch(config.getContribution, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

async function details(id) {
  const apiUrl = config.payroll;
  const data = {
    id: id,
    startdate: localStorage.getItem("startDate"),
    enddate: localStorage.getItem("endDate"),
    cutoff: `${localStorage.getItem("startDate")}-${localStorage.getItem(
      "endDate"
    )}`,
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}
