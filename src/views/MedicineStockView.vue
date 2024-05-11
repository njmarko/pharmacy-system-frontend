<template>
  <b-container v-if="pharmacy" id="pharmacy-container">
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <BasicMedicineStocksView :pharmacy="pharmacy" />
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import pharmacyService from "../service/PharmacyService";

import BasicMedicineStocksView from "../components/medicine/BasicMedicineStocksView";

export default {
  name: "MedicineStockView",
  components: {
    BasicMedicineStocksView,
  },
  data: function () {
    return {
      pharmacy: null,
      breadCrumbItems: this.items,
    };
  },
  mounted() {
    pharmacyService.get(this.$route.params.id).then((response) => {
      this.pharmacy = response.data;
      this.setupBreadCrumbItems();
    });
  },
  methods: {
    setupBreadCrumbItems: function () {
      this.breadCrumbItems = [
        {
          text: this.pharmacy.name,
          to: { name: "PharmacyHomePage", params: { id: this.pharmacy.id } },
        },
        {
          text: "Medicine stocks",
          active: true,
        },
      ];
      if (this.isPharmacyAdmin()) {
        this.breadCrumbItems.unshift({
          text: "Admin panel",
          to: { name: "PharmacyAdminHome" },
        });
      }
    },
    isPharmacyAdmin: function () {
      return (
        this.loggedUser.authorities &&
        this.loggedUser.authorities.includes("ROLE_PHARMACY_ADMIN")
      );
    },
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
