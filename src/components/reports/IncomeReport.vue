<template>
  <div>
    <b-row align-v="center" v-if="typeData == 'line'">
      <b-col>
        <b-form-group id="input-group-33" class="mb-auto">
          <div class="form-label-group">
            <multi-select
              :options="typeOptions"
              :selected-options="selectedTypes"
              placeholder="Please select income type(s)"
              v-on:select="onSelect"
            >
            </multi-select>
          </div>
        </b-form-group>
      </b-col>
    </b-row>
    <div v-if="loaded">
      <LineChart
        v-if="typeData == 'line' && selectedTypes.length != 0"
        v-bind:statistics="statistics"
      />
      <BarChart v-else-if="typeData == 'bar'" v-bind:statistics="statistics" />
    </div>
  </div>
</template>

<script>
import pharmacyReportService from "../../service/PharmacyReportService";
import LineChart from "../charts/LineChart";
import BarChart from "../charts/BarChart";
import { MultiSelect } from "vue-search-select";
import { makeToast } from "../../util/makeToast";

export default {
  components: {
    LineChart,
    BarChart,
    MultiSelect,
  },
  props: ["pharmacy", "period", "type"],
  data() {
    return {
      selectionLimit: 100,
      loaded: false,
      typeData: this.type,
      periodData: this.period,
      statistics: [],
      selectedTypes: [],
      typeOptions: [
        { value: null, text: "Select appointment type" },
        { value: "MEDICINE_SALES", text: "Medicine sales" },
        {
          value: "DERMATOLOGIST_APPOINTMENT",
          text: "Dermatologist appointments",
        },
        { value: "PHARMACIST_APPOINTMENT", text: "Pharmacist appointments" },
      ],
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    onSelect: function (items, newItem) {
      if (!newItem.value) {
        return;
      }
      if (this.selectedTypes.length >= this.selectionLimit) {
        makeToast(
          this,
          "Selection limit exceeded",
          `Maximum number of selected items is ${this.selectionLimit}.`,
          "warning"
        );
      } else {
        this.selectedTypes = items;
        this.loadData();
      }
    },
    loadData: function () {
      this.loaded = false;
      if (this.period) {
        if (this.typeData == "line") {
          this.loadLineChart();
        } else {
          this.loadBarChart();
        }
      }
    },
    loadLineChart: function () {
      if (this.selectedTypes.length != 0) {
        pharmacyReportService
          .getIncomeLineChart(
            this.pharmacy.id,
            this.periodData.from,
            this.periodData.to,
            this.periodData.type,
            this.selectedTypes.map(item => item.value)
          )
          .then((response) => {
            this.statistics = response.data;
            this.loaded = true;
          });
      }
    },
    loadBarChart: function () {
      pharmacyReportService
        .getIncomeBarChart(
          this.pharmacy.id,
          this.periodData.from,
          this.periodData.to,
          this.periodData.type
        )
        .then((response) => {
          this.statistics = response.data;
          this.loaded = true;
        });
    },
  },
  watch: {
    period: function (newValue) {
      this.periodData = newValue;
      this.loadData();
    },
    selectedType: function () {
      this.loadData();
    },
    type: function (newValue) {
      this.typeData = newValue;
      this.loadData();
    },
  },
};
</script>

<style scoped>
.ui.fluid.dropdown {
  border-radius: 20px;
}
</style>