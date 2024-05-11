<template>
  <b-container v-if="pharmacy" id="pharmacy-container">
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <b-row align-v="center">
      <b-col lg="8" md="12">
        <b-form v-on:submit.prevent="filter" v-on:reset.prevent="reset">
          <b-row align-v="center">
            <b-col lg="4" md="6" xs="12">
              <div class="form-label-group">
                <b-form-select
                  v-model="orderStatus"
                  :options="options"
                  id="order-status-input"
                ></b-form-select>
                <label for="order-status-input">Select order status</label>
              </div>
            </b-col>
            <b-col lg="4" md="6" xs="12">
              <b-button-group class="form-label-group">
                <b-button type="submit" variant="primary">Apply</b-button>
                <b-button type="reset" variant="warning">Cancel</b-button>
              </b-button-group>
            </b-col>
          </b-row>
        </b-form>
      </b-col>
      <b-col md="12" lg="4">
        <b-button-group class="form-label-group float-right">
          <b-button
            variant="success"
            v-on:click="$router.push({ name: 'CreateOrderView' })"
            ><b-icon-cart-plus-fill></b-icon-cart-plus-fill> Create
            order</b-button
          >
        </b-button-group>
      </b-col>
    </b-row>
    <div v-if="orderPage.content">
      <div v-if="orderPage.content.length != 0">
        <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
          <b-col
            v-bind:lg="cardWidth"
            sm="12"
            v-for="(d, index) in orderPage.content.slice(
              rowI * numCols,
              rowI * numCols + numCols
            )"
            :key="index"
          >
            <AdminOrderCard
              v-bind:order="d"
              v-bind:pharmacy="pharmacy"
              v-on:delete-order="deleteOrder"
              v-on:publish-order="publishOrder"
              :key="d.id"
            />
          </b-col>
        </b-row>
        <b-pagination
          v-model="page"
          :total-rows="orderPage.totalElements"
          :per-page="size"
          v-on:input="fetchOrderPage"
          first-number
          last-number
          align="center"
        ></b-pagination>
      </div>
      <h2 v-else>No orders found.</h2>
    </div>
    <h2 v-else>No orders found.</h2>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import { makeToast } from "../util/makeToast";
import pharmacyAdminService from "../service/PharmacyAdminService";
import pharmacyService from "../service/PharmacyService";

import AdminOrderCard from "../components/orders/AdminOrderCard";

export default {
  components: {
    AdminOrderCard,
  },
  data() {
    return {
      pharmacy: null,
      breadCrumbItems: [
        {
          text: "Admin panel",
          to: { name: "PharmacyAdminHome" },
        },
        {
          text: "Manage orders",
          active: true,
        },
      ],
      page: 1,
      numRows: 2,
      numCols: 4,
      orderPage: [],
      orderStatus: null,
      options: [
        { value: null, text: "Select order status" },
        { value: "WAITING_FOR_OFFERS", text: "Waiting for offers" },
        { value: "PROCESSED", text: "Processed" },
        { value: "IN_CREATION", text: "In creation" },
      ],
    };
  },
  mounted() {
    pharmacyAdminService.getMyPharmacy(this.loggedUser.id).then((response) => {
      this.pharmacy = response.data;
      this.fetchOrderPage();
    });
  },
  methods: {
    fetchOrderPage: function () {
      pharmacyService
        .getOrders(this.pharmacy.id, this.page - 1, this.size, this.orderStatus)
        .then((response) => {
          this.orderPage = response.data;
        });
    },
    publishOrder: function (order) {
      pharmacyService
        .publishOrder(this.pharmacy.id, order.id)
        .then((response) => {
          this.order.orderStatus = response.data.orderStatus;
        })
        .catch((error) => {
          if (error.response)
            makeToast(this, "Error", error.response.data.message, "danger");
        });
    },
    deleteOrder: function (order) {
      this.$confirm({
        title: "Delete order",
        message: `Are you sure you want to delete order ${order.id}?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            pharmacyService
              .deleteOrder(this.pharmacy.id, order.id)
              .then((response) => {
                if (response.status == 204) {
                  if (this.orderPage.content.length === 1 && this.page > 1) {
                    this.page -= 1;
                  }
                  this.fetchOrderPage();
                }
              })
              .catch((error) => {
                if (error.response) {
                  makeToast(
                    this,
                    "Error",
                    error.response.data.message,
                    "danger"
                  );
                }
              });
          }
        },
      });
    },
    filter: function () {
      this.page = 1;
      this.fetchOrderPage();
    },
    reset: function () {
      this.orderStatus = null;
      this.filter();
    },
  },
  computed: {
    ...mapGetters(["loggedUser"]),
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
#pharmacy-container {
  background-color: white;
}
</style>