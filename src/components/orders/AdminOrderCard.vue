<template>
  <b-card
    no-body
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    :title="this.order.pharmacyName"
  >
    <b-card-header v-on:click="seeDetails" class="clickable">
      <h3>Order {{ this.order.id }}</h3>
    </b-card-header>
    <b-badge v-if="order.orderStatus == 'PROCESSED'" variant="warning"
      >Processed</b-badge
    >
    <b-badge
      v-else-if="order.orderStatus == 'WAITING_FOR_OFFERS'"
      variant="success"
      >Waiting for offers</b-badge
    >
    <b-badge v-else variant="primary">In creation</b-badge>
    <b-card-body class="h-100 d-flex flex-column">
      <b-card-text>
        <p>
          <strong>Due date: </strong><br />
          <span>{{ this.order.dueDate | moment("DD.MM.YYYY. HH:mm") }}</span>
          <br />
          <strong>Number of items: </strong><br />
          <span>{{ this.order.numOfMedicines }}</span>
        </p>
      </b-card-text>
    </b-card-body>
    <b-card-footer>
      <b-button-group>
        <b-button
          v-if="canPublish()"
          variant="success"
          class="mb-2"
          v-on:click="$emit('publish-order', order)"
          v-b-tooltip.hover
          title="Publish order"
        >
          <b-icon-cart-check-fill></b-icon-cart-check-fill>
        </b-button>
        <b-button
          variant="primary"
          class="mb-2"
          v-on:click="showModal"
          v-b-tooltip.hover
          title="See details"
        >
          <b-icon icon="question-circle-fill" aria-label="Help"></b-icon>
        </b-button>
        <b-button
          v-if="canDelete()"
          variant="danger"
          class="mb-2"
          v-on:click="$emit('delete-order', order)"
          v-b-tooltip.hover
          title="Delete order"
        >
          <b-icon-cart-x-fill></b-icon-cart-x-fill>
        </b-button>
      </b-button-group>
    </b-card-footer>
    <b-modal
      :id="'modal-' + this.order.id"
      :title="'Details for order ' + this.order.id"
      hide-footer
      header-text-variant="light"
      header-bg-variant="primary"
      scrollable
      class="order-modal"
    >
      <div v-if="orderDetails">
        <h3>
          {{ orderDetails.pharmacyName }}
          <b-badge v-b-tooltip.hover title="Made by">{{
            this.loggedUser.id == orderDetails.pharmacyAdminId
              ? "Mine"
              : orderDetails.pharmacyAdmin
          }}</b-badge>
        </h3>
        <hr />
        <p>{{ this.orderDetails.dueDate | moment("DD.MM.YYYY. HH:mm") }}</p>
        <div class="overflow-auto">
          <b-table
            striped
            hover
            id="my-table"
            :fields="fields"
            :items="this.orderDetails.orderItems"
            :per-page="perPage"
            :current-page="currentPage"
            small
          >
            <template v-slot:cell(medicineName)="data">
              <router-link
                :to="{
                  name: 'MedicineDetailedView',
                  params: { id: data.item.medicineId },
                }"
              >
                {{ data.item.medicineName }}
              </router-link>
              <b-badge v-if="data.item.isNew" variant="success">
                New medicine
              </b-badge>
            </template>
          </b-table>
          <b-pagination
            v-if="rows > perPage"
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            first-number
            last-number
            align="center"
            aria-controls="my-table"
          ></b-pagination>
        </div>
      </div>
      <div v-else>
        <div class="loading">
          <p>Loading...</p>
          <b-icon
            icon="arrow-counterclockwise"
            animation="spin-reverse"
            font-scale="4"
          ></b-icon>
        </div>
      </div>
      <hr />
      <b-button class="mt-3" block variant="danger" @click="hideModal"
        >Close</b-button
      >
    </b-modal>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";
import pharmacyService from "../../service/PharmacyService";

export default {
  props: ["order", "pharmacy"],
  components: {},
  data() {
    return {
      fields: [
        {
          key: "medicineName",
          sortable: true,
        },
        {
          key: "quantity",
          sortable: true,
        },
      ],
      perPage: 5,
      currentPage: 1,
      orderDetails: null,
    };
  },

  methods: {
    seeDetails: function () {
      this.$router.push({
        name: "OrderDetailsView",
        params: { id: this.order.id },
      });
    },
    canDelete: function () {
      return (
        this.loggedUser.id == this.order.creatorId &&
        this.order.orderStatus != "PROCESSED"
      );
    },
    canEdit: function () {
      return this.canDelete();
    },
    canPublish: function () {
      return (
        this.loggedUser.id == this.order.creatorId &&
        this.order.orderStatus == "IN_CREATION"
      );
    },
    showModal: function () {
      this.$bvModal.show("modal-" + this.order.id);
      if (!this.orderDetails) {
        pharmacyService
          .getOrderDetails(this.pharmacy.id, this.order.id)
          .then((response) => {
            this.orderDetails = response.data;
          });
      }
    },
    hideModal: function () {
      this.$bvModal.hide("modal-" + this.order.id);
    },
  },
  computed: {
    ...mapGetters(["loggedUser"]),
    rows: function () {
      if (this.orderDetails) {
        return this.orderDetails.orderItems.length;
      }
      return 0;
    },
  },
};
</script>

<style scoped>
.card-title {
  color: #002664;
}
.loading {
  margin-left: 43%;
}
.order-modal {
  padding-bottom: 15px;
}
.order-info {
  margin-left: 40%;
}
.clickable:hover {
  /* text-decoration: underline; */
  cursor: pointer;
}
.option-card img {
  border-radius: 10%;
}
.option-card:hover {
  box-shadow: #0000005e 0 12px 26px;
  transform: translate(0px, -10px);
}
.option-card {
  transition: 0.5s ease all;
  border-radius: 1.5em;
  background: #eee;
  margin-bottom: 5px;
}
</style>