<template>
  <div>
    <div v-if="stocksPage.content">
      <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
        <b-col
          v-bind:lg="cardWidth"
          sm="12"
          v-for="(s, index) in stocksPage.content.slice(
            rowI * numCols,
            rowI * numCols + numCols
          )"
          :key="index"
        >
          <MedicineStockCard
            v-bind:stock="s"
            :image="getMedicineImage(s)"
            :key="s.id"
          />
        </b-col>
      </b-row>
      <b-pagination
        v-model="page"
        :total-rows="stocksPage.totalElements"
        :per-page="size"
        v-on:input="fetchStocksPage"
        first-number
        last-number
        align="center"
      ></b-pagination>
    </div>
    <h1 v-else>No medicines found.</h1>
  </div>
</template>

<script>
import pharmacyService from "../../service/PharmacyService";

import MedicineStockCard from "../medicine/MedicineStockCard";

export default {
  name: "BasicMedicineView",
  props: ["pharmacy"],
  components: {
    MedicineStockCard,
  },
  data: function () {
    return {
      stocksPage: [],
      page: 1,
      numRows: 2,
      numCols: 4,
    };
  },
  mounted() {
    this.fetchStocksPage();
  },
  methods: {
    getMedicineImage: function (stock) {
      return `https://via.placeholder.com/600x300/b3dce8/002664?text=${stock.medicineName}`;
    },
    fetchStocksPage: function () {
      pharmacyService
        .getMedicineStocks(this.pharmacy.id, this.page - 1, this.size)
        .then((stocksResponse) => {
          this.stocksPage = stocksResponse.data;
        });
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
