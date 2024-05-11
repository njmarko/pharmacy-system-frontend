<template>
  <div v-if="orderItems">
    <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
      <b-col
        v-bind:lg="cardWidth"
        sm="12"
        v-for="(item, index) in pageItems.slice(
          rowI * numCols,
          rowI * numCols + numCols
        )"
        :key="index"
      >
        <OrderItemCard v-bind:order-item="item" />
      </b-col>
    </b-row>
    <b-pagination
      v-model="page"
      :total-rows="orderItems.length"
      :per-page="size"
      first-number
      last-number
      align="center"
      v-on:input="loadPage"
    ></b-pagination>
  </div>
  <h2 v-else>No order items found.</h2>
</template>

<script>
import OrderItemCard from "./OrderItemCard";

export default {
  components: {
    OrderItemCard,
  },
  props: ["orderItems", "numRows", "numCols"],
  data() {
    return {
      page: 1,
      pageItems: [],
    };
  },
  mounted() {
    this.loadPage();
  },
  methods: {
    loadPage: function () {
      this.pageItems = this.orderItems.slice(
        (this.page - 1) * this.size,
        this.page * this.size
      );
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