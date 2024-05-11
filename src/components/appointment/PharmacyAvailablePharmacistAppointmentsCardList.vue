
<template>
  <div>
    <h1>Available Pharmacist Appointments</h1>
    <div>
      <b-row align-v="center">
        <b-col lg="10" md="12">
          <b-form v-on:submit.prevent="onSearch">
            <b-row align-v="center">
              <b-col lg="4" xs="12">
                <div class="form-label-group">
                  <b-form-input
                    v-model="queryParams.name"
                    placeholder="Search"
                    trim
                    autofocus
                    id="inputName"
                  />
                  <label for="inputName">Search</label>
                </div>
              </b-col>
              <b-col v-if="this.appointmentType == `Pharmacist`" lg="3" xs="12">
                <div class="date-time-group">
                  <date-picker
                    type="datetime"
                    :clearable="false"
                    format="DD.MM.YYYY. HH:mm"
                    v-model="dateTimeData"
                    :input-attr="{ required: 'true' }"
                    id="date-time-input"
                  >
                  </date-picker>
                </div>
              </b-col>
              <b-col lg="3" xs="12">
                <b-button type="submit" variant="primary">
                  <b-icon-search></b-icon-search> Search</b-button
                >
              </b-col>
            </b-row>
          </b-form>
        </b-col>
        <b-col lg="2" md="12">
          <b-button v-b-toggle.collapse-1 variant="primary" class="float-right"
            ><b-icon-sliders></b-icon-sliders>Filter</b-button
          >
        </b-col>
        <b-col md="12">
          <b-collapse id="collapse-1" class="mt-2">
            <b-card>
              <b-form
                v-on:submit.prevent="onSearch"
                v-on:reset.prevent="onReset"
              >
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
          </b-collapse>
        </b-col>
      </b-row>
      <div v-if="pageAppointments">
        <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
          <b-col
            v-bind:lg="cardWidth"
            sm="12"
            v-for="(a, index) in pageAppointments.content.slice(
              rowI * numCols,
              rowI * numCols + numCols
            )"
            :key="index"
          >
            <AppointmentCard
              v-bind:appointment="a"
              :cardType="`schedulePharmacist`"
              :key="a.id"
              v-on:book-pharmacist-appointment="scheduleAppointment"
            />
          </b-col>
        </b-row>
        <h1 v-if="pageAppointments.empty">
          No Available Pharmacist Appointments Found.
        </h1>
        <b-pagination
          v-model="page"
          :total-rows="pageAppointments.totalElements"
          :per-page="size"
          first-number
          last-number
          align="center"
          v-on:input="loadPage"
        ></b-pagination>
      </div>
      <h1 v-else>No Available Pharmacist Appointments Found.</h1>
    </div>
  </div>
</template>
<script>
import AppointmentCard from "../appointment/AppointmentCard";
import appointmentService from "@/service/AppointmentService";
import patientService from "@/service/PatientService";
import DatePicker from "vue2-datepicker";
import { mapGetters } from "vuex";
import { makeToast } from "@/util/makeToast";

export default {
  name: "PatientsPastAppointmentsCardList",
  components: {
    AppointmentCard,
    DatePicker,
  },
  props: {
    numCols: Number,
    numRows: Number,
    appointmentType: {
      type: String,
      default: `Pharmacist`,
    },
    pharmacyId: String,
    dateTime: Date,
  },
  created() {},
  data: function () {
    return {
      pharmacyIdData: null,
      dateTimeData: new Date(),
      pageAppointments: null,
      page: 1,
      queryParams: {
        name: null,
        sortCriteria: null,
        sortDirection: "asc",
      },
      appointmentSelectedType: "Pharmacist",
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
  computed: {
    size: function () {
      return this.numCols * this.numRows;
    },
    cardWidth: function () {
      return Math.round(12 / this.numCols);
    },
    ...mapGetters(["loggedUser"]),
  },
  mounted() {
    if (this.dateTime instanceof Date && !isNaN(this.dateTime)) {
      this.dateTimeData = this.dateTime;
    }
    this.pharmacyIdData = this.pharmacyId;
    this.loadPage();
  },
  methods: {
    loadPage: function () {
      if (this.appointmentSelectedType == "Pharmacist") {
        var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = new Date(this.dateTimeData - tzoffset)
          .toISOString()
          .slice(0, -1);
        appointmentService
          .getAvaiablePharmacistAppointmentsForPharmacyAtSpecifiedDateTime(
            this.pharmacyIdData,
            this.queryParams.name,
            localISOTime,
            this.page - 1,
            this.size,
            this.queryParams.sortCriteria,
            this.queryParams.sortDirection
          )
          .then((response) => {
            this.pageAppointments = response.data;
          })
          .catch((error) => {
            if (error.response) {
              makeToast(this, "Error", error.response.data.message, "danger");
            }
          });
      }
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
              .bookPharmacistAppointment(this.loggedUser.id, id.id)
              .then((response) => {
                if (response.status == 200) {
                  this.loadPage();
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
    onSearch: function () {
      this.page = 1;
      this.loadPage();
    },
    onReset: function () {
      this.page = 1;
      this.queryParams.name = "";
      this.queryParams.sortDirection = null;
      this.queryParams.sortCriteria = null;
      this.loadPage();
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


