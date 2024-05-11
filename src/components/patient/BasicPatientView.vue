<template>
  <div v-if="patientsPage.content">
    <h1> Patients </h1>
    <b-row class="mb-3">
      <b-col md="10">
        <b-form inline v-on:submit.prevent="search">
          <div class="form-label-group">
            <b-form-input
              v-model="queryParams.firstName"
              class="mr-2"
              placeholder="Enter first name"
              id="first-name-input"
              trim
            />
            <label for="first-name-input">Patient first name</label>
          </div>
          <div class="form-label-group">
            <b-form-input
              v-model="queryParams.lastName"
              class="mr-2"
              placeholder="Enter last name"
              id="last-name-input"
              trim
            />
          <label for="last-name-input">Patient last name</label>
          </div>
          <b-button type="submut" variant="primary">
            <b-icon-search></b-icon-search> Search</b-button
          >
        </b-form>
      </b-col>
    </b-row>
    <div v-if="patientsPage.content.length != 0">
      <b-row class="row-spacing " v-for="(row, rowI) in numRows" :key="rowI">
        <b-col class="col-md-6 col-sm-6"
          v-bind:lg="cardWidth"
          v-for="(p, index) in patientsPage.content.slice(
            rowI * numCols,
            rowI * numCols + numCols
          )"
          :key="index"
        >
          <PatientCard
            v-bind:patient="p"
          />
        </b-col>
      </b-row>
      <b-pagination
        v-model="page"
        :total-rows="patientsPage.totalElements"
        :per-page="size"
        v-on:input="fetchPatientsPage"
        first-number
        last-number
        align="center"
      ></b-pagination>
    </div>
    <h1 v-else>No patients found.</h1>
  </div>
  <h1 v-else>No patients found.</h1>
</template>

<script>
import patientService from "../../service/PatientService";

import PatientCard from "./PatientCard";

export default {
  name: "BasicPatientView",
  components: {
    PatientCard,
  },
  data: function () {
    return {
      patientsPage: [],
      numRows: 2,
      numCols: 4,
      page: 1,
      queryParams: {
        firstName: "",
        lastName: ""
      },
    };
  },
  mounted() {
    this.fetchPatientsPage();
  },
  methods: {
    fetchPatientsPage: function () {
      patientService
        .getPatients(
          this.page - 1,
          this.size,
          this.queryParams.firstName,
          this.queryParams.lastName
        )
        .then((response) => {
          this.patientsPage = response.data;
        });
    },
    search: function () {
      this.page = 1;
      this.fetchPatientsPage();
    }
  },
  computed: {
    size: function () {
      return this.numCols * this.numRows;
    },
    cardWidth: function () {
      return Math.round(12 / this.numCols);
    },
  },
};
</script>

<style scoped>
.row-spacing {
  margin-top: 15px;
  margin-bottom: 15px;
}
h1 {
  margin-bottom: 2%;
}
</style>
