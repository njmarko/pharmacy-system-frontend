<template>
  <div v-if="dermatologistPage.content">
    <b-row align-v="center">
      <b-col lg="10" md="12">
        <b-form v-on:submit.prevent="search">
          <b-row align-v="center">
            <b-col lg="4" xs="12">
              <div class="form-label-group">
                <b-form-input
                  v-model="queryParams.firstName"
                  placeholder="Enter first name"
                  trim
                  autofocus
                  id="first-name-input"
                />
                <label for="first-name-input">Enter first name</label>
              </div>
            </b-col>
            <b-col lg="4" xs="12">
              <div class="form-label-group">
                <b-form-input
                  v-model="queryParams.lastName"
                  placeholder="Enter lastName"
                  trim
                  id="last-name-input"
                />
                <label for="last-name-input">Enter last name</label>
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
      <b-col md="12" lg="2">
        <b-button v-b-toggle.collapse-1 variant="primary" class="float-right"
          ><b-icon-sliders></b-icon-sliders>Filter</b-button
        >
      </b-col>
      <b-col md="12">
        <b-collapse id="collapse-1" class="mt-2">
          <b-card>
            <b-form v-on:submit.prevent="filter" v-on:reset.prevent="reset">
              <b-row align-v="center">
                <b-col lg="4" md="6">
                  <b-form-group id="input-group-1" class="mb-auto">
                    <div class="form-label-group">
                      <b-form-input
                        v-model="queryParams.gradeLow"
                        id="grade-low-input"
                        type="number"
                        step="0.01"
                        min="0.00"
                        max="5.00"
                        :state="isValidGrade(queryParams.gradeLow)"
                        placeholder="Enter min grade"
                      />
                      <label for="grade-low-input">Enter min grade</label>
                    </div>
                  </b-form-group>
                </b-col>
                <b-col lg="4" md="6">
                  <b-form-group id="input-group-2" class="mb-auto">
                    <div class="form-label-group">
                      <b-form-input
                        v-model="queryParams.gradeHigh"
                        id="grade-high-input"
                        type="number"
                        step="0.01"
                        min="0.00"
                        max="5.00"
                        :state="isValidGrade(queryParams.gradeHigh)"
                        placeholder="Enter max grade"
                      />
                      <label for="grade-low-input">Enter max grade</label>
                    </div>
                  </b-form-group>
                </b-col>
                <b-col lg="4" md="4">
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
    <div v-if="dermatologistPage.content.length != 0">
      <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
        <b-col
          v-bind:lg="cardWidth"
          sm="12"
          v-for="(d, index) in dermatologistPage.content.slice(
            rowI * numCols,
            rowI * numCols + numCols
          )"
          :key="index"
        >
          <EmployeeCard
            v-bind:employee="d"
            :image="getDharmacistsImage(d)"
            :key="d.id"
          />
        </b-col>
      </b-row>
      <b-pagination
        v-model="page"
        :total-rows="dermatologistPage.totalElements"
        :per-page="size"
        v-on:input="fetchDermatologistPage"
        first-number
        last-number
        align="center"
      ></b-pagination>
    </div>
    <h1 v-else>No pharmacists found.</h1>
  </div>
  <h1 v-else>No pharmacists found.</h1>
</template>

<script>
import pharmacyService from "../../../service/PharmacyService";

import EmployeeCard from "../EmployeeCard";

export default {
  name: "BasicPharmacistsView",
  props: ["pharmacy"],
  components: {
    EmployeeCard,
  },
  data: function () {
    return {
      dermatologistPage: [],
      numRows: 2,
      numCols: 4,
      page: 1,
      queryParams: {
        firstName: "",
        lastName: "",
        gradeLow: 0.0,
        gradeHigh: 5.0,
      },
    };
  },
  mounted() {
    this.fetchDermatologistPage();
  },
  methods: {
    fetchDermatologistPage: function () {
      pharmacyService
        .getDermatologists(
          this.pharmacy.id,
          this.page - 1,
          this.size,
          this.queryParams.firstName,
          this.queryParams.lastName,
          this.queryParams.gradeLow,
          this.queryParams.gradeHigh
        )
        .then((response) => {
          this.dermatologistPage = response.data;
        });
    },
    search: function () {
      this.page = 1;
      this.fetchDermatologistPage();
    },
    filter: function () {
      if (
        this.isValidGrade(this.queryParams.gradeLow) &&
        this.isValidGrade(this.queryParams.gradeHigh)
      ) {
        this.search();
      }
    },
    reset: function () {
      this.queryParams.gradeLow = 0.0;
      this.queryParams.gradeHigh = 5.0;
      this.search();
    },
    getDharmacistsImage: function (dermatologist) {
      return `https://via.placeholder.com/600x300/b3dce8/002664?text=${dermatologist.firstName} ${dermatologist.lastName}`;
    },
    isValidGrade: function (grade) {
      return grade >= 0 && grade <= 5;
    },
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
</style>
