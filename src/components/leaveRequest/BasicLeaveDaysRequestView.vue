<template>
  <div>
    <h1> Leave days request </h1>
    <br/>
    <b-row align-v="center" style="margin-top:1%;">
        <b-col class="col-lg-6 col-md-6 col-sm-12 col-12 text-center">
            From date: <br/>
            <span class="date-time-group">
            <date-picker
                style="margin:auto"
                type="date"
                :clearable="false"
                format="DD.MM.YYYY."
                v-model="requestFrom"
            >
            </date-picker>
            </span>
        </b-col>
        <b-col class="col-lg-6 col-md-6 col-sm-12 col-12 text-center">
            To date: <br/>
            <span class="date-time-group">
            <date-picker
                style="margin:auto"
                type="date"
                :clearable="false"
                format="DD.MM.YYYY."
                v-model="requestTo"
            >
            </date-picker>
            </span>
        </b-col>
    </b-row>
    <b-button 
    style="margin-top:2%;" 
    variant="primary"
    v-on:click="validateDates">Request</b-button>
    <hr/>
    <BasicWorkingCalendarView 
    v-bind:appointments="appointments" 
    v-on:change-appointments="changeAppointments"
    :leaveDays="true"/>
    <br/>
</div>
</template>

<script>
import BasicWorkingCalendarView from "../workingCalendar/BasicWorkingCalendarView"
import {mapGetters} from 'vuex'
import appointmentService from "../../service/AppointmentService"
import leaveDaysRequestService from "../../service/LeaveDaysRequestService"
import colors from 'vuetify/lib/util/colors'
import DatePicker from "vue2-datepicker";
import { makeToast } from "../../util/makeToast"
import {
  getISODateString,
} from "../../util/dateUtil";

export default {
  name: "BasicLeaveDaysRequestView",
  components: {
      BasicWorkingCalendarView,
      DatePicker
  },
  data: function () {
    return {
      pharmacyName: '',
      requestFrom: null,
      requestTo: null,
      appointments: [],
      pharmacyOptions: [],
      pharmacyId: -1,
      dateFrom: null,
      dateTo: null,
      leaveDays: [],
      appDates: []
    };
  },
  methods: {
    checkForOverlapping(fromTime ,toTime, collection, message) {
      for(let date of collection) {
        let from = Date.parse(date.dateFrom);
        let to = Date.parse(date.dateTo);

        if (fromTime >= from && fromTime <= to) {
          makeToast(this, "Error", "Start leave date is overlapping with " + message, "danger");
          return 1;
        }

        if (toTime >= from && toTime <= to) {
          makeToast(this, "Error", "End leave date is overlapping with " + message, "danger");
          return 1;
        }

        if (fromTime <= from && toTime >= to) {
          makeToast(this, "Error", "Leave days are overlapping with " + message, "danger");
          return 1;
        }
      }

      return 0;
    },
    validateDates() {
      if (this.requestFrom === null || this.requestTo === null) {
        makeToast(this, "Error", "One or both of the dates are null!", "danger");
        return;
      }

      this.requestFrom.setHours(0, 0);
      this.requestTo.setHours(0, 0);

      if (this.requestFrom.getTime() >= this.requestTo.getTime()) {
        makeToast(this, "Error", "From date must be before end date!", "danger");
        return;
      }

      this.requestFrom.setHours(0, 0);
      this.requestTo.setHours(23, 59);

      let fromTime = this.requestFrom.getTime();
      let toTime = this.requestTo.getTime();

      if (fromTime < Date.now() || toTime < Date.now()) {
        makeToast(this, "Error", "One of the dates is in the past!", "danger");
        return;
      }

      let errors = 0;

      errors += this.checkForOverlapping(fromTime, toTime, this.leaveDays, "already created leave days request!");
      if (errors > 0) {
        return;
      }

      errors += this.checkForOverlapping(fromTime, toTime, this.appDates, "appointment!");
      if (errors > 0) {
        return;
      }

      leaveDaysRequestService.createLeaveDaysRequest(this.loggedUser.id, getISODateString(this.requestFrom), getISODateString(this.requestTo)).then(() => {
        makeToast(this, "Success", "Leave days request succesfully created!", "success");
        this.getNewAppointments();
      }).catch((error) => 
      {
        makeToast(this, "Error", error.response.data.message , "danger");
      });
    },
    changeAppointments: function (dateFrom, dateTo) {
      this.dateFrom = dateFrom;
      this.dateTo = dateTo;
      this.getNewAppointments();
    },
    getNewAppointments: function () {
      appointmentService.getAllLeaveDates(this.loggedUser.id, this.dateFrom, this.dateTo).then((response) => {
        this.assignNewAppointments(response);
      });
    },
    assignNewAppointments(response) {
      let result = response.data;
      let new_appointments = [];
      let response_appointments = result.appointmentDates;
      let leave_days = result.leaveRequestDateDTos;

      this.leaveDays = leave_days;
      this.appDates = response_appointments;

      for (let appointment of response_appointments) {
        new_appointments.push({
          name: this.getName(appointment),
          start: new Date(appointment.dateFrom),
          end: new Date(appointment.dateTo),
          length: appointment.lengthInMinutes,
          patient: this.getPatientName(appointment),
          pharmacy: appointment.pharmacyName,
          color: this.getAppointmentColor(appointment),
          timed: true,
        });
      }

      for (let days of leave_days) {
        new_appointments.push({
          name: "Leave days - " + this.getLeaveStatus(days),
          start: new Date(days.dateFrom),
          end: new Date(days.dateTo),
          length: null,
          patient: null,
          pharmacy: null,
          status: this.getLeaveStatus(days),
          color: this.getLeaveColor(days),
          timed: true,
        });
      }

      this.appointments = new_appointments;
    },
    getAppointmentColor(appointment) {
       if (appointment.appointmentStatus === "AVAILABLE") {
         return colors['grey'].lighten1;;
       }
       
       return colors['green'].base;
    },
    getLeaveStatus(days) {
       let status = "Pending";
       if (days.status === "APPROVED") {
         status = "Approved";
       }
       return status;
    },
    getLeaveColor(days) {
       if (days.status === "APPROVED") {
         return colors['green'].lighten1;
       }

       return colors['amber'].lighten1;
    },
    getName(appointment) {
       let name = "Scheduled";
       if (appointment.appointmentStatus === "AVAILABLE") {
         name = "Available";
       }
       else if (appointment.appointmentStatus === "TOOK_PLACE") {
         name = "Took place";
       }

       return name;
    },
    getPatientName(appointment) {
      if (appointment.patientFirstName) {
        return appointment.patientFirstName + " " + appointment.patientLastName;
      }

      return null;
    }
  },
  computed: { ...mapGetters(["userRole", "loggedUser"]) }
}
</script>

<style scoped>

#pharmacy-options{
  margin-right: auto;
  width: 50%;
}

</style>
