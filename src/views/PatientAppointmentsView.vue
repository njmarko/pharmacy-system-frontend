<template>
  <b-container id="appointment-container">
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <h1>Scheduled {{ this.appointmentSelectedType }} Appointments</h1>
    <b-row align-v="center">
      <b-col lg="3" md="12">
        <div class="form-label-group">
          <b-form-select
            v-model="selected"
            :options="options"
            id="view-select"
          ></b-form-select>
          <label for="view-select">Select appointments view</label>
        </div>
      </b-col>
      <b-col lg="3" md="12">
        <div class="form-label-group">
          <b-form-select
            v-model="appointmentSelectedType"
            :options="appointmentTypeOptions"
            v-on:change="changeType"
            id="view-select"
          ></b-form-select>
          <label for="view-select">Select appointments type</label>
        </div>
      </b-col>
    </b-row>
    <BasicWorkingCalendarView
      v-if="selected == 'calendar'"
      v-bind:appointments="appointments"
      v-bind:calendarType="`scheduledAppointments`"
      v-on:change-appointments="changeAppointments"
      v-on:cancel-appointment="cancelAppointment"
    />
    <BasicAppointmentView
      v-if="selected == 'cards'"
      v-bind:pharmacy="null"
      v-bind:appointmentType="appointmentSelectedType"
    />
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import patientService from "../service/PatientService";
import colors from "vuetify/lib/util/colors";
import { makeToast } from "@/util/makeToast";

import BasicAppointmentView from "../components/appointment/BasicAppointmentView";
import BasicWorkingCalendarView from "../components/workingCalendar/BasicWorkingCalendarView";

export default {
  name: "PatientAppointmentsView",
  components: {
    BasicWorkingCalendarView,
    BasicAppointmentView,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data: function () {
    return {
      appointments: [],
      breadCrumbItems: this.items,
      dateFrom: null,
      dateTo: null,
      selected: "calendar",
      options: [
        { value: "calendar", text: "Calendar view" },
        {
          value: "cards",
          text: "Cards view",
        },
      ],
      appointmentSelectedType: `Dermatologist`,
      appointmentTypeOptions: [
        { value: "Dermatologist", text: "Dermatologist" },
        { value: "Pharmacist", text: "Pharmacist" },
      ],
    };
  },
  mounted() {
    this.setupBreadCrumbItems();
    this.getAppointments();
  },
  methods: {
    changeType: function () {
      this.setupBreadCrumbItems();
      this.getAppointments();
    },
    getAppointments: function () {
      if (this.dateFrom == null || this.dateTo == null) {
        return;
      }
      if (this.appointmentSelectedType == `Dermatologist`) {
        patientService
          .getScheduledDermatologistAppointmentsCalendar(
            this.loggedUser.id,
            this.dateFrom,
            this.dateTo
          )
          .then((response) => {
            let new_appointments = [];
            response.data.forEach((appointment) => {
              new_appointments.push({
                appointmentId: appointment.id,
                name: `${appointment.employeeFirstName} ${appointment.employeeLastName}`,
                start: new Date(appointment.dateFrom),
                end: new Date(appointment.dateTo),
                length: appointment.lengthInMinutes,
                patient: "",
                pharmacy: appointment.pharmacyName,
                color: this.getColor(appointment),
                rating: appointment.employeeAverageGrade,
                timed: true,
                price: appointment.price,
              });
            });
            this.appointments = new_appointments;
          });
      } else if (this.appointmentSelectedType == `Pharmacist`) {
        patientService
          .getScheduledPharmacistAppointmentsCalendar(
            this.loggedUser.id,
            this.dateFrom,
            this.dateTo
          )
          .then((response) => {
            let new_appointments = [];
            response.data.forEach((appointment) => {
              new_appointments.push({
                appointmentId: appointment.id,
                name: `${appointment.employeeFirstName} ${appointment.employeeLastName}`,
                start: new Date(appointment.dateFrom),
                end: new Date(appointment.dateTo),
                length: appointment.lengthInMinutes,
                patient: "",
                pharmacy: appointment.pharmacyName,
                color: this.getColor(appointment),
                rating: appointment.employeeAverageGrade,
                timed: true,
                price: appointment.price,
              });
            });
            this.appointments = new_appointments;
          });
      }
    },
    changeAppointments: function (dateFrom, dateTo) {
      this.dateFrom = dateFrom;
      this.dateTo = dateTo;
      this.getAppointments();
    },
    setupBreadCrumbItems: function () {
      this.breadCrumbItems = [
        {
          text: this.loggedUser.username,
          to: { name: "PatientHomePage" },
        },
        {
          text: "Scheduled " + this.appointmentSelectedType + " Appointments",
          active: true,
        },
      ];
    },
    getColor(appointment) {
      let color = colors["green"].lighten1;
      if (appointment.appointmentStatus === "AVAILABLE") {
        color = colors["blue"].lighten1;
      }
      return color;
    },
    cancelAppointment: function (appointment) {
      this.$confirm({
        title: "Cancel Appointment",
        message: `Are you sure you want to cancel this appointment?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            patientService
              .cancelAppointment(this.loggedUser.id, appointment.appointmentId)
              .then((response) => {
                if (response.status == 204) {
                  this.getAppointments();
                  makeToast(
                    this,
                    "Success",
                    "Appointment canceled successfully.",
                    "success"
                  );
                }
              })
              .catch((error) => {
                if (error.response) {
                  makeToast(
                    this,
                    "Error",
                    error.response.data.message,
                    "danger"
                  );
                }
              });
          }
        },
      });
    },
  },
  computed: {
    ...mapGetters(["userRole", "loggedUser"]),
  },
};
</script>

<style scoped>
#appointment-container {
  background-color: white;
}
</style>
