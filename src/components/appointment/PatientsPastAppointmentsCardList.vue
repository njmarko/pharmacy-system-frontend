<template>
  <div>
    <h1>Past {{ this.appointmentSelectedType }} Appointments</h1>
    <div v-if="pageAppointments">
      <b-row align-v="center">
        <b-col lg="10" md="12">
          <b-form v-on:submit.prevent="onSearch">
            <b-row align-v="center">
              <b-col lg="3" md="12">
                <div class="form-label-group">
                  <b-form-select
                    v-model="appointmentSelectedType"
                    :options="appointmentTypeOptions"
                    v-on:change="loadPage"
                    id="view-select"
                  ></b-form-select>
                  <label for="view-select">Select appointments type</label>
                </div>
              </b-col>
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
            :cardType="`pastAppointment`"
            :key="a.id"
            v-on:rate-pharmacy-employee="loadPage"
          />
        </b-col>
      </b-row>
      <h1 v-if="pageAppointments.empty">
        No Past {{ this.appointmentSelectedType }} Appoitnments Found.
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
    <h1 v-else>
      No Past {{ this.appointmentSelectedType }} Appointments Found.
    </h1>
  </div>
</template>
<script>
import AppointmentCard from "../appointment/AppointmentCard";
import PatientService from "@/service/PatientService";
import { mapGetters } from "vuex";

export default {
  name: "PatientsPastAppointmentsCardList",
  components: {
    AppointmentCard,
  },
  props: {
    numCols: Number,
    numRows: Number,
    appointmentType: {
      type: String,
      default: `Dermatologist`,
    },
  },
  created() {},
  data: function () {
    return {
      pageAppointments: null,
      page: 1,
      queryParams: {
        name: null,
        sortCriteria: null,
        sortDirection: "asc",
      },
      appointmentSelectedType: this.appointmentType,
      appointmentTypeOptions: [
        { value: "Dermatologist", text: "Dermatologist" },
        { value: "Pharmacist", text: "Pharmacist" },
      ],
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
    this.loadPage();
  },
  computed: {
    size: function () {
      return this.numCols * this.numRows;
    },
    cardWidth: function () {
      return Math.round(12 / this.numCols);
    },
  },
  methods: {
    loadPage: function () {
      if (this.appointmentSelectedType == "Dermatologist") {
        PatientService.getPastDermatologistAppointments(
          this.loggedUser().id,
          this.queryParams.name,
          this.page - 1,
          this.size,
          this.queryParams.sortCriteria,
          this.queryParams.sortDirection
        ).then((response) => {
          this.pageAppointments = response.data;
        });
      } else if (this.appointmentSelectedType == "Pharmacist") {
        PatientService.getPastPharmacistAppointments(
          this.loggedUser().id,
          this.queryParams.name,
          this.page - 1,
          this.size,
          this.queryParams.sortCriteria,
          this.queryParams.sortDirection
        ).then((response) => {
          this.pageAppointments = response.data;
        });
      }
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
    ...mapGetters(["loggedUser"]),
  },
};
</script>
<style scoped>
.row-spacing {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>


