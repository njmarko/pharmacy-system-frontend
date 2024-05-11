<template>
  <b-card
    no-body
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    :title="item.item.medicineName"
  >
    <b-card-header>
      <h3>{{ item.item.medicineName }}</h3>
    </b-card-header>
    <b-card-body class="h-100 d-flex flex-column">
      <b-card-text>
        <strong>Current price:</strong><br />
        {{ item.item.currentPrice }} RSD<br />

        <strong>Discount:</strong><br />
        {{ item.discount }} %<br />

        <strong>New price:</strong><br />
        {{ newPrice }}<br />
      </b-card-text>
    </b-card-body>
    <b-card-footer>
      <b-button-group>
        <b-button
          variant="warning"
          class="mb-2"
          v-b-tooltip.hover
          title="Edit discount"
          v-on:click="showModal"
        >
          <b-icon-pencil-square></b-icon-pencil-square>
        </b-button>
        <b-button
          variant="danger"
          class="mb-2"
          v-b-tooltip.hover
          title="Remove from promotion"
          v-on:click="$emit('remove-from-promotion', item)"
        >
          <b-icon-cart-dash-fill></b-icon-cart-dash-fill>
        </b-button>
      </b-button-group>
    </b-card-footer>
    <b-modal
      :id="'edit-promotion-modal-' + item.id"
      :title="'Edit ' + item.medicineName + ' discount'"
      hide-footer
      header-text-variant="light"
      header-bg-variant="primary"
    >
      <b-form v-on:submit.prevent="editDiscount">
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
          >Save changes</b-button
        >
      </b-form>
      <b-button class="mt-3" v-on:click="hideModal" block>Close</b-button>
    </b-modal>
  </b-card>
</template>

<script>
export default {
  props: ["item"],
  components: {},
  data() {
    return {
      discount: this.item.discount,
    };
  },
  methods: {
    editDiscount: function () {
      this.$emit("edit-discount", this.item, this.discount);
      this.hideModal();
    },
    hideModal: function () {
      this.discount = this.item.discount;
      this.$bvModal.hide("edit-promotion-modal-" + this.item.id);
    },
    showModal: function () {
      this.$bvModal.show("edit-promotion-modal-" + this.item.id);
    },
  },
  computed: {
    isValidDiscount: function () {
      return this.discount && this.discount > 0 && this.discount < 100;
    },
    newPrice: function () {
      let price = (1 - this.discount / 100.0) * this.item.item.currentPrice;
      price = Math.round(price * 100) / 100;
      return `${price} RSD`;
    },
    formatCurrentPrice: function () {
      return `${this.item.item.currentPrice} RSD`;
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