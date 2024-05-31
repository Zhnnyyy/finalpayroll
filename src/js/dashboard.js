import { showMessage, showOptions, loading } from "./model/MyAlert.js";
import { Fetch } from "./model/bridge.js";
import config from "./model/config.js";

$(document).ready(async function () {
  dashboardDetails();
  makecalendar();
});
export function DashboardFunction() {
  $("#dashboardContetn").css("display", "block");
  if (document.readyState === "loading") {
    addEventListener("DOMContentLoaded", function (e) {
      dashboardDetails();
    });
  } else {
    makecalendar();
  }
}

const makecalendar = () => {
  Fetch(config.holidays, "GET", (result) => {
    let events = [];
    if (!result.loading) {
      const data = result.data;
      $.each(data.Regular_Holidays, (i, res) => {
        events.push({ start: res.date, title: res.name });
      });

      $.each(data.Special_Holidays, (i, res) => {
        events.push({ start: res.date, title: res.name });
      });
      mCalendar(events);
    }
  });

  function mCalendar(events) {
    var calendarEl = document.getElementById("calendar");

    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      height: "auto",
      events: events,
    });

    calendar.render();
  }
};

setInterval(() => {
  dashboardDetails();
}, 1000);

const dashboardDetails = () => {
  Fetch(config.dashboardDetails, "GET", (result) => {
    if (result.loading) {
      // loading(true);
    }
    if (!result.loading) {
      loading(false);
      const data = result.data;
      $("#employee").html(data.employee);
      $("#attendance").html(data.attendance);
      $("#request").html(data.request);
      $("#leave").html(data.leave);
      let yearHoliday = [];

      $.each(data.holiday.Regular_Holidays, async (i, res) => {
        yearHoliday.push({ name: res.name, date: res.date });
      });
      $.each(data.holiday.Special_Holidays, async (i, res) => {
        yearHoliday.push({ name: res.name, date: res.date });
      });
      const tbl = $(".right-container").empty();
      $.each(yearHoliday, (i, res) => {
        tbl.append(
          `<div class="holiday-container">
          <label> ${res.name}</label>
            <label> ${res.date}</label>
            
          </div>`
        );
      });
    }
  });
};
