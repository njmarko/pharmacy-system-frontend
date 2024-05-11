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
          <AddedItemCard
            v-bind:item="item"
            v-bind:pharmacy="pharmacy"
            :editable="editable"
            v-on:remove-item="removeItem"
            v-on:update-item="updateItem"
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
    <h2 v-else>No order items found.</h2>
  </div>
  <h2 v-else>No order items found.</h2>
</template>

<script>
import { makeToast } from "../../../util/makeToast";
import pharmacyService from "../../../service/PharmacyService";

import AddedItemCard from "./AddedItemCard";

export default {
  components: {
    AddedItemCard,
  },
  props: ["pharmacy", "order", "numRows", "numCols", "editable"],
  data() {
    return {
      page: 1,
      name: "",
      itemPage: [],
    };
  },
  mounted() {
    this.fetchItemPage();
  },
  methods: {
    updateItem: function (item, quantity) {
      pharmacyService
        .updateOrderItem(this.pharmacy.id, this.order.id, item.id, {
          quantity: quantity,
        })
        .then(() => {
          item.quantity = quantity;
        })
        .catch((error) => {
          if (error.response)
            makeToast(this, "Error", error.response.data.message, "danger");
        });
    },
    removeItem: function (item) {
      pharmacyService
        .removeItem(this.pharmacy.id, this.order.id, item.id)
        .then(() => {
          if (this.itemPage.content.length === 1 && this.page > 1) {
            this.page -= 1;
          }
          this.fetchItemPage();
        })
        .catch((error) => {
          if (error.response)
            makeToast(this, "Error", error.response.data.message, "danger");
        });
    },
    search: function () {
      this.page = 1;
      this.fetchItemPage();
    },
    fetchItemPage: function () {
      pharmacyService
        .getOrderItems(
          this.pharmacy.id,
          this.order.id,
          this.name,
          this.page - 1,
          this.size
        )
        .then((response) => {
          this.itemPage = response.data;
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