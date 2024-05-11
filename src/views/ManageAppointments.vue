<template>
  <b-container v-if="pharmacy" id="pharmacy-container">
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <b-row align-v="center">
      <b-col lg="6" md="12">
        <b-form-group id="input-group-11" class="mb-auto">
          <div class="form-label-group">
            <model-select
              :options="options"
              v-model="selected"
              placeholder="Select employee"
            ></model-select>
          </div>
        </b-form-group>
      </b-col>
      <b-col md="12" lg="6">
        <b-button-group class="form-label-group float-right">
          <b-button
            v-b-toggle.collapse-1
            variant="success"
            v-bind:disabled="!selected"
            v-on:click="showAppointmentModal"
            ><b-icon-calendar-plus-fill></b-icon-calendar-plus-fill> Create
            appointment</b-button
          >
        </b-button-group>
      </b-col>
    </b-row>
    <div v-if="selected">
      <BasicWorkingCalendarView
        v-bind:appointments="appointments"
        v-on:change-appointments="changeAppointments"
      />
    </div>
    <h3 v-else>No employee selected.</h3>
    <CreateAppointmentModal
      v-on:appointment-created="getAppointments"
      ref="appointmentModal"
      v-bind:pharmacy="pharmacy"
    />
  </b-container>
  <h2 v-else>AAAA</h2>
</template>

<script>
import { ModelSelect } from "vue-search-select";
import { mapGetters } from "vuex";
import pharmacyAdminService from "../service/PharmacyAdminService";
import pharmacyService from "../service/PharmacyService";
import colors from "vuetify/lib/util/colors";
import CreateAppointmentModal from "../components/appointment/CreateAppointmentModal";
import BasicWorkingCalendarView from "../components/workingCalendar/BasicWorkingCalendarView";

export default {
  components: {
    BasicWorkingCalendarView,
    ModelSelect,
    CreateAppointmentModal,
  },
  data() {
    return {
      breadCrumbItems: [
        {
          text: "Admin panel",
          to: { name: "PharmacyAdminHome" },
        },
        {
          text: "Manage appointments",
          active: true,
        },
      ],
      selected: null,
      pharmacy: null,
      appointments: [],
      options: [{ value: null, text: "Select employee" }],
      dateFrom: null,
      dateTo: null,
    };
  },
  mounted() {
    pharmacyAdminService.getMyPharmacy(this.loggedUser.id).then((response) => {
      this.pharmacy = response.data;
      pharmacyService
        .getAllPharmacyEmployees(this.pharmacy.id)
        .then((employees) => {
          employees.data.forEach((employee) => {
            this.options.push({
              value: employee.employeeId,
              text: `${employee.employeeFirstName} ${employee.employeeLastName} (@${employee.employeeUsername}) [${employee.employeeEmployeeType}]`,
            });
          });
        });
    });
  },
  methods: {
    changeDermatologist: function () {
      this.getAppointments();
    },
    showAppointmentModal: function () {
      this.$refs.appointmentModal.show(this.selected);
    },
    getAppointments: function () {
      if (
        this.dateFrom == null ||
        this.dateTo == null ||
        this.selected == null
      ) {
        return;
      }
      pharmacyService
        .getEmployeeCalendar(
          this.pharmacy.id,
          this.selected,
          this.dateFrom,
          this.dateTo
        )
        .then((response) => {
          let new_appointments = [];
          response.data.appointmentDates.forEach((appointment) => {
            new_appointments.push({
              appointmentId: appointment.id,
              name: this.getTitle(appointment),
              start: new Date(appointment.dateFrom),
              end: new Date(appointment.dateTo),
              length: appointment.lengthInMinutes,
              patient: appointment.patientFirstName
                ? `${appointment.patientFirstName} ${appointment.patientLastName}`
                : "",
              pharmacy: appointment.pharmacyName,
              color: this.getColor(appointment),
              rating: appointment.employeeAverageGrade,
              timed: true,
              price: appointment.price,
            });
          });
          response.data.leaveRequestDateDTos.forEach((days) => {
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
          });
          this.appointments = new_appointments;
        });
    },
    changeAppointments: function (dateFrom, dateTo) {
      this.dateFrom = dateFrom;
      this.dateTo = dateTo;
      this.getAppointments();
    },
    getTitle: function (appointment) {
      if (appointment.appointmentStatus == "TOOK_PLACE") {
        return "Past appointment";
      } else if (appointment.appointmentStatus == "AVAILABLE") {
        return "Available";
      } else {
        return "Booked";
      }
    },
    getColor: function (appointment) {
      let color = colors["green"].lighten1;
      if (appointment.appointmentStatus === "AVAILABLE") {
        color = colors["blue"].lighten1;
      } else if (appointment.appointmentStatus == "TOOK_PLACE") {
        color = colors["yellow"].darken1;
      }
      return color;
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
        return colors["red"].lighten1;
      }

      return colors["orange"].lighten1;
    },
  },
  computed: {
    ...mapGetters(["loggedUser"]),
    appointmentModalTitle: function () {
      return `Create appointment for ${this.currentEmployee.firstName} ${this.currentEmployee.lastName}`;
    },
  },
  watch: {
    selected: function (newValue) {
      this.selected = newValue;
      this.changeDermatologist();
    },
  },
};
</script>

<style scoped>
#pharmacy-container {
  background-color: white;
}
</style>