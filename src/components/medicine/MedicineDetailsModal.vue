<template>
  <b-modal
    :id="'medicine-details-' + stock.id"
    :title="stock.medicineName + ' details'"
    hide-footer
    header-text-variant="light"
    header-bg-variant="primary"
    size="md"
  >
    <b-list-group flush>
      <b-list-group-item>
        <strong>Manufacturer:</strong>
        {{ stock.medicineManufacturer }}
      </b-list-group-item>
      <b-list-group-item>
        <strong>Composition:</strong>
        {{ stock.medicineComposition }}
      </b-list-group-item>
      <b-list-group-item>
        <strong>Medicine type:</strong>
        {{ stock.medicineType | capitalize }}
      </b-list-group-item>
      <b-list-group-item>
        <strong>Medicine shape:</strong>
        {{ stock.medicineShape | capitalize }}
      </b-list-group-item>
    </b-list-group>
    <b-button class="mt-3" v-on:click="hide" variant="primary" block
      >Close</b-button
    >
  </b-modal>
</template>

<script>
export default {
  props: ["stock"],
  methods: {
    show: function () {
      this.$bvModal.show(`medicine-details-${this.stock.id}`);
    },
    hide: function () {
      this.$bvModal.hide(`medicine-details-${this.stock.id}`);
    },
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString().toLowerCase();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
};
</script>

<style scoped>
</style>