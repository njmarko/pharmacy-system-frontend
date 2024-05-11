<template>
  <b-container v-if="pharmacy" id="pharmacy-container">
    <OrderDetails
      v-bind:order="order"
      v-bind:pharmacy="pharmacy"
      :editable="true"
      v-bind:create="!addedItem"
      v-on:create-order-details="createOrder"
      v-on:publish-order-details="publishOrder"
      v-on:delete-order-details="deleteOrder"
    />
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <b-tabs content-class="mt-3" fill v-model="tabIndex">
      <b-tab title="Order items" active lazy>
        <AddedItemGridView
          v-if="addedItem"
          v-bind:order="order"
          v-bind:pharmacy="pharmacy"
          :editable="true"
          :numRows="2"
          :numCols="4"
        />
        <h5 v-else-if="!order.id">
          Select due date in order to be able to add items.
        </h5>
        <h5 v-else>Wow, such empty.</h5>
      </b-tab>
      <b-tab :disabled="!order.id" title="All medicines" lazy>
        <AvailableOrderMedicinesGridView
          v-bind:order="order"
          v-bind:pharmacy="pharmacy"
          :numRows="2"
          :numCols="4"
          v-on:add-order-item="addOrderItem"
        />
      </b-tab>
    </b-tabs>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import { eventBus } from "../util/eventBus";
import { makeToast } from "../util/makeToast";
import pharmacyAdminService from "../service/PharmacyAdminService";
import pharmacyService from "../service/PharmacyService";

import OrderDetails from "../components/orders/OrderDetails";
import AddedItemGridView from "../components/orders/items/AddedItemGridView";
import AvailableOrderMedicinesGridView from "../components/orders/items/AvailableOrderMedicinesGridView";

export default {
  components: {
    OrderDetails,
    AvailableOrderMedicinesGridView,
    AddedItemGridView,
  },
  data() {
    return {
      pharmacy: null,
      order: null,
      addedItem: false,
      tabIndex: 0,
      breadCrumbItems: [
        {
          text: "Admin panel",
          to: { name: "PharmacyAdminHome" },
        },
        {
          text: "Create order",
          active: true,
        },
      ],
    };
  },
  methods: {
    publishOrder: function (order) {
      pharmacyService
        .publishOrder(this.pharmacy.id, order.id)
        .then((response) => {
          this.order.orderStatus = response.data.orderStatus;
          this.$router.push({
            name: "OrderDetailsView",
            params: { id: this.order.id },
          });
        })
        .catch((error) => {
          if (error.response)
            makeToast(this, "Error", error.response.data.message, "danger");
        });
    },
    createOrder: function () {
      pharmacyService
        .createOrder(this.pharmacy.id, this.order)
        .then((response) => {
          this.order = response.data;
          this.tabIndex = 1;
        })
        .catch((error) => {
          if (error.response)
            makeToast(this, "Error", error.response.data.message, "danger");
        });
    },
    addOrderItem: function (item) {
      if (!this.addedItem) {
        pharmacyService
          .addOrderItem(this.pharmacy.id, this.order.id, item)
          .then((itemResponse) => {
            if (itemResponse.status == 201) {
              this.tabIndex = 0;
              this.addedItem = true;
              eventBus.$emit("order-item-added");
            }
          });
      } else {
        pharmacyService
          .addOrderItem(this.pharmacy.id, this.order.id, item)
          .then((response) => {
            if (response.status == 201) {
              eventBus.$emit("order-item-added");
            }
          });
      }
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
  },
  mounted() {
    pharmacyAdminService.getMyPharmacy(this.loggedUser.id).then((response) => {
      this.pharmacy = response.data;
      this.order = {
        dueDate: null,
        pharmacyAdminId: this.loggedUser.id,
        pharmacyAdminFirstName: this.loggedUser.firstName,
        pharmacyAdminLastName: this.loggedUser.lastName,
        pharmacyAdminEmail: this.loggedUser.email,
        pharmacyName: this.pharmacy.name,
      };
    });
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