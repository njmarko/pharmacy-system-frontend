<template>
  <b-container v-if="pharmacy" id="pharmacy-container">
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <h1>Available dermatologist appointments</h1>
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
    </b-row>
    <BasicWorkingCalendarView
      v-if="selected == 'calendar'"
      v-bind:appointments="appointments"
      v-on:change-appointments="changeAppointments"
      v-on:schedule-appointment="scheduleAppointment"
    />
    <BasicAppointmentView
      v-if="selected == 'cards'"
      v-bind:pharmacy="pharmacy"
    />
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import patientService from "../service/PatientService";
import pharmacyService from "../service/PharmacyService";
import colors from "vuetify/lib/util/colors";
import { makeToast } from "@/util/makeToast";

import BasicAppointmentView from "../components/appointment/BasicAppointmentView";
import BasicWorkingCalendarView from "../components/workingCalendar/BasicWorkingCalendarView";

export default {
  name: "AppointmentsView",
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
      pharmacy: null,
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
    };
  },
  mounted() {
    pharmacyService.get(this.$route.params.id).then((response) => {
      this.pharmacy = response.data;
      this.setupBreadCrumbItems();
    });
  },
  methods: {
    getAppointments: function () {
      if (this.dateFrom == null || this.dateTo == null) {
        return;
      }
      pharmacyService
        .getAvailableDermatologistAppointments(
          this.pharmacy.id,
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
    },
    changeAppointments: function (dateFrom, dateTo) {
      this.dateFrom = dateFrom;
      this.dateTo = dateTo;
      this.getAppointments();
    },
    setupBreadCrumbItems: function () {
      this.breadCrumbItems = [
        {
          text: this.pharmacy.name,
          to: { name: "PharmacyHomePage", params: { id: this.pharmacy.id } },
        },
        {
          text: "Available dermatologist appointments",
          active: true,
        },
      ];
      if (this.isPharmacyAdmin()) {
        this.breadCrumbItems.unshift({
          text: "Admin panel",
          to: { name: "PharmacyAdminHome" },
        });
      }
    },
    isPharmacyAdmin: function () {
      return this.userRole == "PharmacyAdmin";
    },
    getColor(appointment) {
      let color = colors["green"].lighten1;
      if (appointment.appointmentStatus === "AVAILABLE") {
        color = colors["blue"].lighten1;
      }
      return color;
    },
    scheduleAppointment: function (id) {
      this.$confirm({
        title: "Schedule Appointment",
        message: `Are you sure you want to schedule this appointment?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            patientService
              .bookDermatologistAppointment(this.loggedUser.id, id)
              .then((response) => {
                if (response.status == 200) {
                  this.getAppointments();
                  makeToast(
                    this,
                    "Success",
                    "Appointment scheduled successfully.",
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
#pharmacy-container {
  background-color: white;
}
</style>
