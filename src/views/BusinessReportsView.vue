<template>
  <b-container v-if="pharmacy" id="pharmacy-containter">
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <b-row align-v="center" class="mb-2">
      <b-col lg="4" md="12" xs="12">
        <div class="form-label-group">
          <b-form-select
            id="select-1"
            v-model="selectedChart"
            :options="chartOptions"
          ></b-form-select>
          <label for="select-1">Please select a chart type</label>
        </div>
      </b-col>
      <b-col lg="4" md="6" xs="6">
        <div class="form-label-group">
          <b-form-select
            id="select-1"
            v-model="selectedYear"
            :options="yearOptions"
          ></b-form-select>
          <label for="select-1">Please select a year</label>
        </div>
      </b-col>
      <b-col lg="4" md="6" xs="6">
        <div class="form-label-group">
          <b-form-select
            id="select-2"
            v-model="selectedPeriod"
            :options="periodOptions"
          ></b-form-select>
          <label for="select-2">Please select report period</label>
        </div>
      </b-col>
    </b-row>
    <b-tabs content-class="mt-3" justified>
      <b-tab title="Medicine reports" active lazy
        ><MedicineReport
          v-bind:type="selectedChart"
          v-bind:pharmacy="pharmacy"
          v-bind:period="computePeriod"
      /></b-tab>
      <b-tab title="Appointment reports" lazy
        ><AppointmentReport
          v-bind:type="selectedChart"
          v-bind:pharmacy="pharmacy"
          v-bind:period="computePeriod"
      /></b-tab>
      <b-tab title="Income reports" lazy>
        <IncomeReport
          v-bind:type="selectedChart"
          v-bind:pharmacy="pharmacy"
          v-bind:period="computePeriod"
        />
      </b-tab>
    </b-tabs>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import pharmacyAdminService from "../service/PharmacyAdminService";

import MedicineReport from "../components/reports/MedicineReport";
import AppointmentReport from "../components/reports/AppointmentReport";
import IncomeReport from "../components/reports/IncomeReport";

export default {
  components: {
    MedicineReport,
    AppointmentReport,
    IncomeReport,
  },
  data() {
    return {
      pharmacy: null,
      selectedYear: null,
      yearOptions: [{ value: null, text: "Select a year" }],
      selectedPeriod: null,
      periodOptions: [],
      selectedChart: "bar",
      chartOptions: [
        { value: "line", text: "Line chart" },
        { value: "bar", text: "Bar chart" },
      ],
      breadCrumbItems: [
        {
          text: "Admin panel",
          to: { name: "PharmacyAdminHome" },
        },
        {
          text: "Business reports",
          active: true,
        },
      ],
    };
  },
  mounted() {
    this.configureYearOptions();
    this.configurePeriodOptions();
    pharmacyAdminService.getMyPharmacy(this.loggedUser.id).then((response) => {
      this.pharmacy = response.data;
    });
  },
  methods: {
    configureYearOptions: function () {
      const currentYear = new Date().getFullYear();
      for (let i = 0; i < 100; i++) {
        this.yearOptions.push({
          value: currentYear - i,
          text: `${currentYear - i}`,
        });
      }
      this.selectedYear = this.yearOptions[1].value;
    },
    configurePeriodOptions: function () {
      this.periodOptions = [
        {
          value: { from: "01-01", to: "01-01", type: "ANNUAL" },
          text: "Entire year",
        },
        {
          value: { from: "01-01", to: "02-01", type: "MONTHLY" },
          text: "January",
        },
        {
          value: { from: "02-01", to: "03-01", type: "MONTHLY" },
          text: "February",
        },
        {
          value: { from: "03-01", to: "04-01", type: "MONTHLY" },
          text: "March",
        },
        {
          value: { from: "04-01", to: "05-01", type: "MONTHLY" },
          text: "April",
        },
        { value: { from: "05-01", to: "06-01", type: "MONTHLY" }, text: "May" },
        {
          value: { from: "06-01", to: "07-01", type: "MONTHLY" },
          text: "June",
        },
        {
          value: { from: "07-01", to: "08-01", type: "MONTHLY" },
          text: "July",
        },
        {
          value: { from: "08-01", to: "09-01", type: "MONTHLY" },
          text: "August",
        },
        {
          value: { from: "09-01", to: "10-01", type: "MONTHLY" },
          text: "September",
        },
        {
          value: { from: "10-01", to: "12-01", type: "MONTHLY" },
          text: "October",
        },
        {
          value: { from: "11-01", to: "12-01", type: "MONTHLY" },
          text: "November",
        },
        {
          value: { from: "12-01", to: "01-01", type: "MONTHLY" },
          text: "December",
        },
        {
          value: { from: "01-01", to: "04-01", type: "QUARTERLY" },
          text: "Q1",
        },
        {
          value: { from: "04-01", to: "07-01", type: "QUARTERLY" },
          text: "Q2",
        },
        {
          value: { from: "07-01", to: "10-01", type: "QUARTERLY" },
          text: "Q3",
        },
        {
          value: { from: "10-01", to: "01-01", type: "QUARTERLY" },
          text: "Q4",
        },
      ];
      this.selectedPeriod = this.periodOptions[0].value;
    },
  },
  computed: {
    ...mapGetters(["loggedUser"]),
    computePeriod: function () {
      if (this.selectedYear) {
        const from = `${this.selectedYear}-${this.selectedPeriod.from}`;
        const to = this.toTime;
        return {
          from: from,
          to: to,
          type: this.selectedPeriod.type,
        };
      }
      return null;
    },
    toTime: function () {
      if (this.selectedPeriod.from >= this.selectedPeriod.to) {
        return `${this.selectedYear + 1}-${this.selectedPeriod.to}`;
      }
      return `${this.selectedYear}-${this.selectedPeriod.to}`;
    },
  },
};
</script>

<style>
#pharmacy-containter {
  background-color: white;
}
</style>