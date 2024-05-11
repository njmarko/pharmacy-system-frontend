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
          <AvailableMedicineCard
            v-bind:item="item"
            :key="item.id"
            v-on:add-to-promotion="addItemToPromotion"
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
import pharmacyService from "../../service/PharmacyService";

import AvailableMedicineCard from "./AvailableMedicineCard";

export default {
  components: {
    AvailableMedicineCard,
  },
  props: ["pharmacy", "promotion", "numRows", "numCols"],
  data() {
    return {
      page: 1,
      itemPage: [],
      name: "",
    };
  },
  mounted() {
    this.fetchItemPage();
  },
  methods: {
    reload() {
      this.name = "";
      this.search();
    },
    fetchItemPage: function () {
      pharmacyService
        .getStocksNotInPromotion(
          this.pharmacy.id,
          this.name,
          this.promotion.items.map((item) => item.id),
          this.page - 1,
          this.size
        )
        .then((response) => {
          this.itemPage = response.data;
        });
    },
    search: function () {
      this.page = 1;
      this.fetchItemPage();
    },
    addItemToPromotion: function(item, discount) {
      this.$emit('add-item-promotion', item, discount);
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
</style>