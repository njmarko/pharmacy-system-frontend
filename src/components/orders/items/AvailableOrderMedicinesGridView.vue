<template>
  <div v-if="itemPage.content">
    <b-row class="mb-3 row-spacing">
      <b-col md="10">
        <b-form inline v-on:submit.prevent="search">
          <div class="form-label-group">
            <b-form-input
              v-model="name"
              class="mr-2"
              placeholder="Enter medicine name"
              trim
              id="medicine-name"
              autofocus
            />
            <label for="medicine-name">Enter medicine name</label>
          </div>
          <b-button type="submit" variant="primary">
            <b-icon-search></b-icon-search> Search</b-button
          >
        </b-form>
      </b-col>
      <b-col md="2">
        <b-button v-b-toggle.collapse-11 variant="primary" class="float-right"
          ><b-icon-sliders></b-icon-sliders>Filter</b-button
        >
      </b-col>
      <b-col md="12">
        <b-collapse id="collapse-11" class="mt-2">
          <b-card>
            <b-form
              class="form-floating"
              inline
              v-on:submit.prevent="filter"
              v-on:reset.prevent="reset"
            >
              <b-row>
                <b-col lg="3" md="6">
                  <div class="form-label-group">
                    <b-form-input
                      v-model="lowGrade"
                      id="grade-low-input"
                      type="number"
                      step="0.01"
                      min="0.00"
                      max="5.00"
                      class="mr-2 form-control"
                    />
                    <label for="grade-low-input">Enter min grade </label>
                  </div>
                </b-col>
                <b-col lg="3" md="6">
                  <div class="form-label-group">
                    <b-form-input
                      v-model="highGrade"
                      id="grade-high-input"
                      type="number"
                      step="0.01"
                      min="0.00"
                      max="5.00"
                      class="mr-2"
                    />
                    <label for="grade-high-input">Enter max grade</label>
                  </div>
                </b-col>

                <b-col lg="3" md="6">
                  <div class="form-label-group">
                    <b-form-select
                      v-model="medicineType"
                      id="medicine-type-input"
                      :options="medicineTypeOptions"
                    />
                    <label for="medicine-type-input">Medicine type</label>
                  </div>
                </b-col>

                <b-col lg="3" md="6">
                  <div class="form-label-group">
                    <b-form-select
                      v-model="issueOnRecipe"
                      id="issue-input"
                      class="mr-2"
                      :options="issueOnRecipeOptions"
                    />
                    <label for="issue-input">Purchase info</label>
                  </div>
                </b-col>
                <b-col md="12">
                  <b-button type="submit" variant="primary" class="ml-auto"
                    >Apply</b-button
                  >
                  <b-button type="reset" variant="warning">Cancel</b-button>
                </b-col>
              </b-row>
            </b-form>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>
    <div v-if="itemPage.content.length != 0">
      <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
        <b-col
          v-bind:lg="cardWidth"
          sm="12"
          v-for="(item, index) in itemPage.content.slice(
            rowI * numCols,
            rowI * numCols + numCols
          )"
          :key="index"
        >
          <AvailableItemCard
            v-bind:item="item"
            v-bind:pharmacy="pharmacy"
            v-on:add-item="addItem"
            :key="item.id"
          />
        </b-col>
      </b-row>
      <b-pagination
        v-model="page"
        :total-rows="itemPage.totalElements"
        :per-page="size"
        first-number
        last-number
        align="center"
        v-on:input="fetchItemPage"
      ></b-pagination>
    </div>
    <h2 v-else>No available medicines found.</h2>
  </div>
  <h2 v-else>No available medicines found.</h2>
</template>

<script>
import { eventBus } from "../../../util/eventBus";
import medicineService from "../../../service/MedicineService";

import AvailableItemCard from "./AvailableItemCard";

export default {
  components: {
    AvailableItemCard,
  },
  props: ["pharmacy", "order", "numRows", "numCols"],
  data() {
    return {
      page: 1,
      itemPage: [],
      name: "",
      lowGrade: 0.0,
      highGrade: 5.0,
      issueOnRecipe: null,
      medicineType: null,
      issueOnRecipeOptions: [
        { value: null, text: "-" },
        { value: true, text: "recipe is required" },
        { value: false, text: "recipe isn't needed" },
      ],
      medicineTypeOptions: [
        { value: null, text: "-" },
        { value: "ANTIBIOTIC", text: "Antibiotic" },
        { value: "ANESTHETIC", text: "Anesthetic" },
        { value: "ANTIHISTAMINE", text: "Antihistamine" },
      ],
    };
  },
  created() {
    eventBus.$on("order-item-added", () => {
      if (this.itemPage.content.length === 1 && this.page > 1) {
        this.page -= 1;
      }
      this.fetchItemPage();
    });
  },
  mounted() {
    this.fetchItemPage();
  },
  methods: {
    addItem: function (item) {
      this.$emit("add-order-item", item);
    },
    fetchItemPage: function () {
      if (!this.order.id) {
        medicineService
          .getAllMedicines(
            this.name,
            this.lowGrade,
            this.highGrade,
            this.issueOnRecipe,
            this.medicineType,
            this.page - 1,
            this.size
          )
          .then((response) => {
            this.itemPage = response.data;
          });
      } else {
        medicineService
          .getNotInOrder(
            this.order.id,
            this.name,
            this.lowGrade,
            this.highGrade,
            this.issueOnRecipe,
            this.medicineType,
            this.page - 1,
            this.size
          )
          .then((response) => {
            this.itemPage = response.data;
          });
      }
    },
    search: function () {
      this.page = 1;
      this.fetchItemPage();
    },
    filter: function () {
      this.search();
    },
    reset: function () {
      this.name = "";
      this.lowGrade = 0.0;
      this.highGrade = 5.0;
      this.issueOnRecipe = null;
      this.medicineType = null;
      this.filter();
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