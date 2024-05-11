<template>
  <b-card
    no-body
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    :title="item.name"
  >
    <b-card-header>
      <h3>{{ item.name }}</h3>
    </b-card-header>
    <b-badge v-if="isNew" variant="warning">Not registered</b-badge>
    <b-badge v-else variant="primary">Already in stock</b-badge>
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
        / 5
      </b-card-text>
    </b-card-body>
    <b-card-footer>
      <b-button-group>
        <b-button
          variant="success"
          class="mb-2"
          v-b-tooltip.hover
          title="Add to order"
          v-on:click="showModal"
        >
          <b-icon-cart-plus-fill></b-icon-cart-plus-fill>
        </b-button>
      </b-button-group>
    </b-card-footer>
    <b-modal
      :id="'quantity-modal-' + item.id"
      :title="'Add ' + item.name + ' to order'"
      hide-footer
      header-text-variant="light"
      header-bg-variant="primary"
    >
      <b-form v-on:submit.prevent="addToOrder">
        <b-row>
          <b-col lg="12" xs="12">
            <div class="form-label-group">
              <b-form-input
                placeholder="Enter quantity"
                v-model="quantity"
                type="number"
                autofocus
                required
                :state="quantity > 0"
                id="quantity-input"
              />
              <label for="quantity-input">Enter medicine quantity</label>
            </div>
          </b-col>
        </b-row>
        <div v-if="isNew">
          <hr />
          <h6>Register medicine</h6>
          <p>
            <small>
              This medicine was not previously registered in your pharmacy. It
              will be registered with entered price after you accept an offer to
              this order.</small
            >
          </p>
          <b-row>
            <b-col lg="12" xs="12">
              <div class="form-label-group">
                <b-form-input
                  placeholder="Enter new price"
                  v-model="newPrice"
                  type="number"
                  min="0.0"
                  step="0.01"
                  required
                  :state="newPrice > 0"
                  id="price-input"
                />
                <label for="price-input">Enter new price</label>
              </div>
            </b-col>
          </b-row>
        </div>
        <b-button class="mt-3" block type="submit" variant="success"
          >Add to order</b-button
        >
      </b-form>
      <b-button class="mt-3" v-on:click="hideModal" block variant="danger"
        >Close</b-button
      >
    </b-modal>
  </b-card>
</template>

<script>
import StarRating from "vue-star-rating";
import pharmacyService from "../../../service/PharmacyService";

export default {
  props: ["item", "pharmacy"],
  components: {
    StarRating,
  },
  data() {
    return {
      quantity: 1,
      isNew: false,
      newPrice: 100,
    };
  },
  mounted() {
    this.checkIfNew();
  },
  methods: {
    checkIfNew: function () {
      pharmacyService
        .isMedicineRegistered(this.pharmacy.id, this.item.id)
        .then((response) => {
          this.isNew = !response.data;
        });
    },
    addToOrder: function () {
      this.hideModal();
      this.$emit("add-item", {
        medicineId: this.item.id,
        quantity: this.quantity,
        isNew: this.isNew,
        newPrice: this.newPrice,
      });
    },
    hideModal: function () {
      this.$bvModal.hide("quantity-modal-" + this.item.id);
    },
    showModal: function () {
      pharmacyService
        .isMedicineRegistered(this.pharmacy.id, this.item.id)
        .then((response) => {
          this.isNew = !response.data;
          this.$bvModal.show("quantity-modal-" + this.item.id);
        });
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
