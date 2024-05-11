    // v-bind:img-src="image"
<template>
  <b-card
    no-body
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
  >
    <b-card-header class="mb-1">
      <h3>{{ this.stock.medicineName }}</h3>
    </b-card-header>
    <b-badge v-if="this.stock.quantity === 0" variant="warning"
      >Out of stock</b-badge
    >
    <b-card-body class="h-100 mb-0 p-0 d-flex flex-column">
      <b-card-text>
        <strong>Rating:</strong><br />
        <star-rating
          :read-only="true"
          :inline="true"
          :increment="0.01"
          :star-size="20"
          :rating="this.stock.medicineAverageGrade"
        />
        / 5
        <hr />
        <p>
          <strong>Current price:</strong><br />
          <span>{{ this.stock.currentPrice }} RSD</span>
          <b-badge v-if="stock.totalDiscount > 0" variant="warning"
            ><b>-{{ stock.totalDiscount }}%</b></b-badge
          >
          <br />
          <strong>Quantity:</strong><br />
          <span>{{ this.stock.quantity }}</span
          ><br />
        </p>
      </b-card-text>
    </b-card-body>
    <b-card-footer>
      <b-button-group>
        <b-button
          variant="info"
          v-on:click="showDetails"
          v-b-tooltip.hover
          title="Show medicine info"
        >
          <b-icon-question-circle-fill></b-icon-question-circle-fill>
        </b-button>
        <b-button
          variant="primary"
          v-b-modal="'modal-price-' + this.stock.id"
          v-b-tooltip.hover
          :title="
            canUpdatePrice
              ? 'Update price'
              : 'Medicine is currently on promotion so you can\'t update its price.'
          "
          :disabled="!canUpdatePrice"
          ><b-icon-cash></b-icon-cash
        ></b-button>
        <b-button
          variant="danger"
          v-b-tooltip.hover
          title="Remove medicine"
          v-on:click="$emit('remove-medicine', stock)"
          ><b-icon-dash-circle-fill></b-icon-dash-circle-fill
        ></b-button>
      </b-button-group>
    </b-card-footer>
    <b-modal
      :id="'modal-price-' + this.stock.id"
      :title="'Update price of ' + this.stock.medicineName"
      hide-footer
      header-text-variant="light"
      header-bg-variant="primary"
      size="md"
    >
      <b-form v-on:submit.prevent="updatePrice">
        <b-form-group class="mb-auto">
          <div class="form-label-group">
            <b-form-input
              id="amount-input"
              required
              min="1"
              step="0.01"
              :state="newPrice > 0"
              v-model="newPrice"
              type="number"
            ></b-form-input>
            <label for="amount-input">Enter new price</label>
          </div>
        </b-form-group>
        <b-button
          class="mt-3"
          block
          type="submit"
          variant="primary"
          :disabled="newPrice <= 0"
          >Update price</b-button
        >
      </b-form>
      <b-button class="mt-3" v-on:click="hide" block>Close</b-button>
    </b-modal>
    <MedicineDetailsModal ref="detailsModal" v-bind:stock="stock" />
  </b-card>
</template>

<script>
import MedicineDetailsModal from "./MedicineDetailsModal";
import StarRating from "vue-star-rating";

export default {
  props: ["stock", "image"],
  name: "AdminMedicineStockCard",
  components: {
    StarRating,
    MedicineDetailsModal,
  },
  data() {
    return {
      newPrice: this.stock.currentPrice,
    };
  },
  methods: {
    showDetails: function () {
      this.$refs.detailsModal.show();
    },
    hide: function () {
      this.newPrice = this.stock.currentPrice;
      this.$bvModal.hide("modal-price-" + this.stock.id);
    },
    updatePrice: function () {
      this.hide();
      this.$emit("update-price", this.stock, this.newPrice);
    },
  },
  computed: {
    canUpdatePrice: function () {
      return this.stock.totalDiscount == 0;
    },
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
