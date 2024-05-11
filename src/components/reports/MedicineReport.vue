<template>
  <div>
    <b-row align-v="center" v-if="typeData == 'line'">
      <b-col>
        <b-form-group id="input-group-31" class="mb-auto">
          <div class="form-label-group">
            <multi-select
              :options="medicinesOptions"
              :selected-options="selectedMedicines"
              placeholder="Please select medicine(s)"
              v-on:select="onSelect"
            >
            </multi-select>
          </div>
        </b-form-group>
      </b-col>
    </b-row>
    <div v-if="loaded">
      <LineChart
        v-if="typeData == 'line' && selectedMedicines.length != 0"
        v-bind:statistics="statistics"
      />
      <BarChart v-else-if="typeData == 'bar'" v-bind:statistics="statistics" />
    </div>
  </div>
</template>

<script>
import pharmacyReportService from "../../service/PharmacyReportService";
import pharmacyService from "../../service/PharmacyService";
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
      loaded: false,
      typeData: this.type,
      periodData: this.period,
      selectionLimit: 100,
      statistics: [],
      selectedMedicines: [],
      medicinesOptions: [{ value: null, text: "Select medicine" }],
    };
  },
  mounted() {
    pharmacyService.getAllStocks(this.pharmacy.id).then((response) => {
      response.data.forEach((m) => {
        this.medicinesOptions.push({
          value: m.medicineId,
          text: m.medicineName,
        });
      });
      this.loadData();
    });
  },
  methods: {
    onSelect(items, newItem) {
      if (!newItem.value) {
        return;
      }
      if (this.selectedMedicines.length >= this.selectionLimit) {
        makeToast(
          this,
          "Selection limit exceeded",
          `Maximum number of selected items is ${this.selectionLimit}.`,
          "warning"
        );
      } else {
        this.selectedMedicines = items;
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
      if (this.selectedMedicines.length != 0) {
        pharmacyReportService
          .getMedicinePurchaseReport(
            this.pharmacy.id,
            this.selectedMedicines.map((item) => item.value),
            this.periodData.from,
            this.periodData.to,
            this.periodData.type
          )
          .then((response) => {
            this.statistics = response.data;
            this.loaded = true;
          });
      }
    },
    loadBarChart: function () {
      pharmacyReportService
        .getBarchartData(
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
    selectedMedicine: function () {
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