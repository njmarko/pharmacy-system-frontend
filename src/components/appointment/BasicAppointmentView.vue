<template>
  <div>
    <div v-if="appointmentsPage.content">
      <b-row align-v="center">
        <b-col md="12">
          <b-card>
            <b-form v-on:submit.prevent="onSearch" v-on:reset.prevent="onReset">
              <b-row align-v="center">
                <b-col lg="4" md="6">
                  <b-form-group id="input-group-4" class="mb-auto">
                    <div class="form-label-group">
                      <b-form-select
                        id="sort-crit"
                        v-model="queryParams.sortCriteria"
                        :options="critOptions"
                      ></b-form-select>
                      <label for="sort-crit">Sort Criteria</label>
                    </div>
                  </b-form-group>
                </b-col>
                <b-col lg="4" md="6">
                  <b-form-group id="input-group-5" class="mb-auto">
                    <div class="form-label-group">
                      <b-form-select
                        id="sort-dir"
                        v-model="queryParams.sortDirection"
                        :options="dirOptions"
                      ></b-form-select>
                      <label for="sort-dir">Sort Direction</label>
                    </div>
                  </b-form-group>
                </b-col>

                <b-col lg="4" md="12">
                  <b-button-group class="form-label-group">
                    <b-button type="submit" variant="primary">Apply</b-button>
                    <b-button type="reset" variant="warning">Cancel</b-button>
                  </b-button-group>
                </b-col>
              </b-row>
            </b-form>
          </b-card>
        </b-col>
      </b-row>

      <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
        <b-col
          v-bind:lg="cardWidth"
          sm="12"
          v-for="(a, index) in appointmentsPage.content.slice(
            rowI * numCols,
            rowI * numCols + numCols
          )"
          :key="index"
        >
          <AppointmentCard
            v-bind:appointment="a"
            :image="getAppointmentImage(a)"
            :key="a.id"
            :cardType="determinedCardType"
            v-on:book-dermatologist-appointment="bookDermatologistAppointment"
            v-on:cancel-appointment="cancelAppointment"
          />
        </b-col>
      </b-row>
      <h1 v-if="appointmentsPage.empty">No Appointments Found.</h1>
      <b-pagination
        v-model="page"
        :total-rows="appointmentsPage.totalElements"
        :per-page="size"
        v-on:input="fetchAppointmentsPage"
        first-number
        last-number
        align="center"
      ></b-pagination>
    </div>
    <h1 v-else>No appointments found.</h1>
  </div>
</template>

<script>
import pharmacyService from "../../service/PharmacyService";
import patientService from "../../service/PatientService";
import { mapGetters } from "vuex";
import { makeToast } from "@/util/makeToast";

import AppointmentCard from "../appointment/AppointmentCard";

export default {
  name: "BasicAppointmentView",
  props: {
    pharmacy: Object,
    appointmentType: {
      type: String,
      default: `Dermatologist`,
    },
  },
  watch: {
    appointmentType: function () {
      this.fetchAppointmentsPage();
    },
  },
  components: {
    AppointmentCard,
  },
  data: function () {
    return {
      page: 1,
      appointmentsPage: [],
      numCols: 4,
      numRows: 2,
      queryParams: {
        sortCriteria: null,
        sortDirection: "asc",
      },
      critOptions: [
        { value: undefined, text: "Select a Sort Criteria" },
        { value: "from", text: "Date" },
        { value: "duration", text: "Duration" },
        { value: "price", text: "Price" },
        {
          value: "employee.pharmacyEmployee.averageGrade",
          text: "Employee Rating",
        },
      ],
      dirOptions: [
        { value: null, text: "Select a Sort Direction" },
        { value: "asc", text: "Ascending" },
        { value: "desc", text: "Descending" },
      ],
    };
  },
  mounted() {
    this.fetchAppointmentsPage();
  },
  methods: {
    getAppointmentImage: function (appointment) {
      return `https://via.placeholder.com/600x300/b3dce8/002664?text=${appointment.employeeType}`;
    },
    fetchAppointmentsPage: function () {
      if (this.pharmacy != null) {
        pharmacyService
          .getPaginatedDermatologistAppointments(
            this.pharmacy.id,
            this.page - 1,
            this.size,
            this.queryParams.sortCriteria,
            this.queryParams.sortDirection
          )
          .then((response) => {
            this.appointmentsPage = response.data;
          });
      } else {
        if (this.appointmentType == `Dermatologist`) {
          patientService
            .getPaginatedScheduledDermatologistAppointments(
              this.loggedUser.id,
              "",
              this.page - 1,
              this.size,
              this.queryParams.sortCriteria,
              this.queryParams.sortDirection
            )
            .then((response) => {
              this.appointmentsPage = response.data;
            });
        } else if (this.appointmentType == `Pharmacist`) {
          patientService
            .getPaginatedScheduledPharmacistAppointments(
              this.loggedUser.id,
              "",
              this.page - 1,
              this.size,
              this.queryParams.sortCriteria,
              this.queryParams.sortDirection
            )
            .then((response) => {
              this.appointmentsPage = response.data;
            });
        }
      }
    },
    onSearch: function () {
      this.page = 1;
      this.fetchAppointmentsPage();
    },
    onReset: function () {
      this.page = 1;
      this.queryParams.name = "";
      this.queryParams.sortDirection = null;
      this.queryParams.sortCriteria = null;
      this.fetchAppointmentsPage();
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
              .cancelAppointment(this.loggedUser.id, appointment.id)
              .then((response) => {
                if (response.status == 204) {
                  if (
                    this.appointmentsPage.content.length === 1 &&
                    this.page > 1
                  ) {
                    this.page -= 1;
                  }
                  this.fetchAppointmentsPage();
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
    bookDermatologistAppointment: function (appointment) {
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
              .bookDermatologistAppointment(this.loggedUser.id, appointment.id)
              .then((response) => {
                if (response.status == 200) {
                  if (
                    this.appointmentsPage.content.length === 1 &&
                    this.page > 1
                  ) {
                    this.page -= 1;
                  }
                  this.fetchAppointmentsPage();
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
    ...mapGetters(["loggedUser"]),
    size: function () {
      return this.numCols * this.numRows;
    },
    cardWidth: function () {
      return Math.round(12 / this.numCols);
    },
    determinedCardType: function () {
      if (this.pharmacy == null) {
        return `scheduledAppointment`;
      } else {
        return `bookAppointment`;
      }
    },
  },
};
</script>

<style scoped>
.row-spacing {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
