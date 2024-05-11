<template>
  <b-card
    no-body
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    :title="item.medicineName"
  >
    <b-card-header>
      <h3>{{ item.medicineName }}</h3>
    </b-card-header>
    <b-card-body class="h-100 d-flex flex-column">
      <b-card-text>
        <strong>Rating:</strong><br />
        <star-rating
          :read-only="true"
          :inline="true"
          :increment="0.01"
          :star-size="20"
          :rating="item.medicineAverageGrade"
        />
        / 5 <br />
        <strong>Price:</strong><br />
        {{ item.currentPrice }} RSD
        <b-badge v-if="item.totalDiscount > 0" variant="warning"
          ><b>-{{ item.totalDiscount }}%</b></b-badge
        >
      </b-card-text>
    </b-card-body>
    <b-card-footer>
      <b-button-group>
        <b-button
          variant="success"
          class="mb-2"
          v-b-tooltip.hover
          title="Add to promotion"
          v-on:click="showModal"
        >
          <b-icon-cart-plus-fill></b-icon-cart-plus-fill>
        </b-button>
      </b-button-group>
    </b-card-footer>
    <b-modal
      :id="'add-promotion-modal-' + item.id"
      :title="'Add ' + item.medicineName + ' to promotion'"
      hide-footer
      header-text-variant="light"
      header-bg-variant="primary"
    >
      <b-form v-on:submit.prevent="addToPromotion">
        <b-row>
          <b-col lg="12" xs="12">
            <div class="form-label-group">
              <b-form-input
                placeholder="Enter discount percentage"
                v-model="discount"
                type="number"
                autofocus
                required
                min="1"
                max="99"
                step="1"
                :state="isValidDiscount"
                id="discount-input"
              />
              <label for="discount-input">Enter discount percentage</label>
            </div>
          </b-col>
          <b-col lg="6" xs="6">
            <div class="form-label-group">
              <b-form-input
                placeholder="New price"
                v-model="formatCurrentPrice"
                id="current-price"
              />
              <label for="current-price">Current price</label>
            </div>
          </b-col>
          <b-col lg="6" xs="6">
            <div class="form-label-group">
              <b-form-input
                placeholder="New price"
                v-model="newPrice"
                id="discount-price"
              />
              <label for="discount-price">New price</label>
            </div>
          </b-col>
        </b-row>
        <b-button
          class="mt-3"
          block
          type="submit"
          variant="primary"
          :disabled="!isValidDiscount"
          >Add to promotion</b-button
        >
      </b-form>
      <b-button class="mt-3" v-on:click="hideModal" block>Close</b-button>
    </b-modal>
  </b-card>
</template>

<script>
import StarRating from "vue-star-rating";

export default {
  props: ["item"],
  components: {
    StarRating,
  },
  data() {
    return {
      discount: 25,
    };
  },
  methods: {
    addToPromotion: function () {
      this.hideModal();
      this.$emit("add-to-promotion", this.item, this.discount);
    },
    hideModal: function () {
      this.$bvModal.hide("add-promotion-modal-" + this.item.id);
    },
    showModal: function () {
      this.$bvModal.show("add-promotion-modal-" + this.item.id);
    },
  },
  computed: {
    isValidDiscount: function () {
      return this.discount && this.discount > 0 && this.discount < 100;
    },
    newPrice: function () {
      let price = (1 - this.discount / 100.0) * this.item.currentPrice;
      price = Math.round(price * 100) / 100;
      return `${price} RSD`;
    },
    formatCurrentPrice: function () {
      return `${this.item.currentPrice} RSD`;
    },
  },
};
</script>

<style scoped>
.card-title {
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
  margin-bottom: 5px;
}
</style>