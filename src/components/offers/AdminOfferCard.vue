<template>
  <b-card
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    :title="offer.supplierCompany"
    no-body
  >
    <b-card-header class="mb-1">
      <h3>{{ offer.supplierCompany }}</h3>
    </b-card-header>
    <b-badge v-if="offer.status == 'ACCEPTED'" variant="success"
      >Accepted</b-badge
    >
    <b-badge v-else-if="offer.status == 'PENDING'" variant="warning"
      >Pending</b-badge
    >
    <b-badge v-else variant="danger">Rejected</b-badge>
    <b-card-body>
      <b-card-text>
        <p>
          <strong>Delivery date: </strong><br />
          {{ offer.deliveryDate | moment("DD.MM.YYYY. HH:mm") }}<br />
          <strong>Total price: </strong><br />
          {{ offer.totalPrice }} RSD
        </p>
      </b-card-text>
    </b-card-body>
    <b-card-footer v-if="canAccept()">
      <b-button-group>
        <b-button
          variant="success"
          v-b-tooltip.hover
          title="Accept the offer"
          v-on:click="$emit('accept-offer', offer)"
        >
          <b-icon-cart-check-fill></b-icon-cart-check-fill>
        </b-button>
      </b-button-group>
    </b-card-footer>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["offer", "order"],
  methods: {
    canAccept: function () {
      return (
        this.offer.status == "PENDING" &&
        this.order.pharmacyAdminId == this.loggedUser.id
      );
    },
  },
  computed: {
    ...mapGetters(["loggedUser"]),
  },
};
</script>

<style scoped>
.card-header {
  color: #002664;
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
}
</style>
