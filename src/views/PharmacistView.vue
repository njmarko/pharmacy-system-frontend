<template>
  <b-container v-if="pharmacy" id="pharmacy-container">
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <BasicPharmacistsView :pharmacy="pharmacy" />
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex';
import pharmacyService from "../service/PharmacyService";

import BasicPharmacistsView from "../components/employee/pharmacist/BasicPharmacistView";

export default {
  name: "PharmacistView",
  components: {
    BasicPharmacistsView,
  },
  data: function () {
    return {
      pharmacy: null,
      breadCrumbItems: [],
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
          text: "Pharmacists",
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
      return this.userRole == 'PharmacyAdmin';
    },
  },
  computed: {
    ...mapGetters(["userRole"]),
  }
};
</script>

<style scoped>
#pharmacy-container {
  background-color: white;
}
</style>
