<template>
  <b-card
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    :title="item.medicineName"
    no-body
  >
    <b-card-header class="mb-1">
      <h3>{{ item.medicineName }}</h3>
    </b-card-header>
    <b-badge v-if="item.isNew" variant="success"> New medicine </b-badge>
    <b-badge v-else variant="primary"> Already in stock </b-badge>
    <b-card-body>
      <b-card-text>
        <p><strong>Quantity: </strong> {{ item.quantity }}</p>
      </b-card-text>
    </b-card-body>
    <b-card-footer v-if="editable">
      <b-button-group>
        <b-button
          variant="warning"
          class="mb-2"
          v-b-tooltip.hover
          title="Edit order item"
          v-on:click="showModal"
        >
          <b-icon-pencil></b-icon-pencil>
        </b-button>
        <b-button
          variant="danger"
          class="mb-2"
          v-b-tooltip.hover
          title="Remove from order"
          v-on:click="$emit('remove-item', item)"
        >
          <b-icon-cart-dash-fill></b-icon-cart-dash-fill>
        </b-button>
      </b-button-group>
    </b-card-footer>
    <b-modal
      :id="'item-update-modal-' + item.id"
      :title="'Update ' + item.medicineName + '\'s quantity'"
      hide-footer
      header-text-variant="light"
      header-bg-variant="primary"
    >
      <b-form v-on:submit.prevent="updateItem">
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
                id="update-quantity-input"
              />
              <label for="update-quantity-input">Enter medicine quantity</label>
            </div>
          </b-col>
        </b-row>
        <b-button class="mt-3" block type="submit" variant="success"
          >Update</b-button
        >
      </b-form>
      <b-button class="mt-3" v-on:click="hideModal" block variant="danger"
        >Close</b-button
      >
    </b-modal>
  </b-card>
</template>

<script>
export default {
  props: ["item", "editable"],
  data() {
    return {
      quantity: this.item.quantity
    }
  },
  methods: {
    updateItem: function() {
      this.hideModal();
      this.$emit('update-item', this.item, this.quantity);
    },
    hideModal: function () {
      this.$bvModal.hide("item-update-modal-" + this.item.id);
    },
    showModal: function () {
      this.$bvModal.show("item-update-modal-" + this.item.id);
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
