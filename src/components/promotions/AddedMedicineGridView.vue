<template>
  <div v-if="promotion.items.length != 0">
    <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
      <b-col
        v-bind:lg="cardWidth"
        sm="12"
        v-for="(item, index) in slicedItems.slice(
          rowI * numCols,
          rowI * numCols + numCols
        )"
        :key="index"
      >
        <AddedMedicineCard
          v-bind:item="item"
          :key="item.id"
          v-on:remove-from-promotion="removeItem"
          v-on:edit-discount="editDiscount"
        />
      </b-col>
    </b-row>
    <b-pagination
      v-model="page"
      :total-rows="promotion.items.length"
      :per-page="size"
      first-number
      last-number
      align="center"
      v-on:input="sliceItems"
    ></b-pagination>
  </div>
  <h4 v-else>Wow, such empty.</h4>
</template>

<script>
import AddedMedicineCard from "./AddedMedicineCard";

export default {
  props: ["promotion", "numRows", "numCols"],
  components: {
    AddedMedicineCard,
  },
  data() {
    return {
      page: 1,
      slicedItems: [],
    };
  },
  mounted() {
    this.sliceItems();
  },
  methods: {
    reload: function () {
      this.page = 1;
      this.sliceItems();
    },
    removeItem: function (item) {
      this.$emit("remove-item-promotion", item);
    },
    editDiscount: function (item, discount) {
      this.$emit("edit-promotion-discount", item, discount);
    },
    sliceItems: function () {
      this.slicedItems = this.promotion.items.slice(
        (this.page - 1) * this.size,
        this.page * this.size
      );
    },
  },
  computed: {
    size: function () {
      return this.numCols * this.numRows;
    },
    cardWidth: function () {
      return Math.round(12 / this.numCols);
    },
  },
};
</script>

<style scoped>
</style>