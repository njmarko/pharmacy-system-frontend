<template>
  <b-container v-if="order" id="pharmacy-container">
    <OrderDetails
      v-bind:order="order"
      v-bind:pharmacy="pharmacy"
      v-bind:editable="canEdit()"
      v-on:delete-order-details="deleteOrder"
      v-on:publish-order-details="publishOrder"
    />
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <b-tabs content-class="mt-3" fill>
      <b-tab title="Order items" active lazy>
        <AddedItemGridView
          v-bind:pharmacy="pharmacy"
          v-bind:order="order"
          v-bind:editable="canEdit()"
          :numRows="2"
          :numCols="4"
        />
      </b-tab>
      <b-tab title="All medicines" lazy v-if="canEdit()">
        <AvailableOrderMedicinesGridView
          v-bind:order="order"
          v-bind:pharmacy="pharmacy"
          :numRows="2"
          :numCols="4"
          v-on:add-order-item="addOrderItem"
        />
      </b-tab>
      <b-tab title="Available offers" lazy>
        <OfferGridView
          v-bind:pharmacy="pharmacy"
          v-bind:order="order"
          :numRows="2"
          :numCols="4"
          v-on:accept-offer-grid="offerAccepted"
        />
      </b-tab>
    </b-tabs>
  </b-container>
</template>

<script>
import { eventBus } from "../util/eventBus";
import { mapGetters } from "vuex";
import { makeToast } from "../util/makeToast";
import pharmacyAdminService from "../service/PharmacyAdminService";
import pharmacyService from "../service/PharmacyService";

import AvailableOrderMedicinesGridView from "../components/orders/items/AvailableOrderMedicinesGridView";
import OrderDetails from "../components/orders/OrderDetails";
import AddedItemGridView from "../components/orders/items/AddedItemGridView";
import OfferGridView from "../components/offers/OfferGridView";

export default {
  components: {
    OfferGridView,
    AddedItemGridView,
    OrderDetails,
    AvailableOrderMedicinesGridView,
  },
  data() {
    return {
      order: null,
      pharmacy: null,
      breadCrumbItems: [
        {
          text: "Admin panel",
          to: { name: "PharmacyAdminHome" },
        },
        {
          text: "Manage orders",
          to: { name: "ManageOrders" },
        },
      ],
    };
  },
  mounted() {
    pharmacyAdminService.getMyPharmacy(this.loggedUser.id).then((response) => {
      this.pharmacy = response.data;
      pharmacyService
        .getOrderDetails(this.pharmacy.id, this.$route.params.id)
        .then((orderResponse) => {
          this.order = orderResponse.data;
          this.breadCrumbItems.push({
            text: `Order #${this.order.id} details`,
            active: true,
          });
        });
    });
  },
  methods: {
    addOrderItem: function (item) {
      pharmacyService
        .addOrderItem(this.pharmacy.id, this.order.id, item)
        .then((response) => {
          if (response.status == 201) {
            eventBus.$emit("order-item-added");
          }
        })
        .catch((error) => {
          if (error.response)
            makeToast(this, "Error", error.response.data.message, "danger");
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
    deleteOrder: function () {
      this.$confirm({
        title: "Delete order",
        message: `Are you sure you want to delete order ${this.order.id}?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            pharmacyService
              .deleteOrder(this.pharmacy.id, this.order.id)
              .then((response) => {
                if (response.status == 204) {
                  this.$router.push({ name: "ManageOrders" });
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
    canEdit: function () {
      return (
        (this.order.orderStatus == "WAITING_FOR_OFFERS" ||
          this.order.orderStatus == "IN_CREATION") &&
        this.order.pharmacyAdminId == this.loggedUser.id && (this.order.offerCount == 0)
      );
    },
    offerAccepted: function () {
      this.order.orderStatus = "PROCESSED";
    },
  },
  computed: {
    ...mapGetters(["loggedUser"]),
  },
};
</script>

<style scoped>
#pharmacy-container {
  background-color: white;
}
</style>