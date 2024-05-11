<template>
  <b-container v-if="pharmacy" id="page-container">
    <h1>
      <strong>Welcome, {{ this.loggedUser.username }}!</strong>
    </h1>
    <hr />
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <PharmacyAdminOptions :pharmacy="this.pharmacy" />
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import pharmacyAdminService from "../service/PharmacyAdminService";

import PharmacyAdminOptions from "../components/pharmacyAdmin/PharmacyAdminOptions";

export default {
  components: {
    PharmacyAdminOptions,
  },
  data: function () {
    return {
      pharmacy: null,
      breadCrumbItems: [],
    };
  },
  mounted() {
    pharmacyAdminService.getMyPharmacy(this.loggedUser.id).then((response) => {
      this.pharmacy = response.data;
      this.setupBreadcrumbItems();
    });
  },
  methods: {
    setupBreadcrumbItems: function () {
      this.breadCrumbItems = [
        {
          text: "Admin panel",
          to: { name: "PharmacyAdminHome" },
          active: true,
        },
        {
          text: this.pharmacy.name,
          to: { name: "PharmacyHomePage", params: { id: this.pharmacy.id } },
        },
      ];
    },
  },
  computed: { ...mapGetters(["loggedUser"]) },
};
</script>

<style scoped>
#page-container {
  background-color: white;
}
</style>