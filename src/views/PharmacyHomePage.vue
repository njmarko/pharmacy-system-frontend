<template>
  <b-container v-if="pharmacy" id="pharmacy-container">
    <PharmacyDetails
      v-bind:canEdit="canEdit"
      v-on:update-pharmacy-details="updatePharmacyDetails"
      v-bind:pharmacy="this.pharmacy"
    />
    <br />
    <b-breadcrumb
      v-if="this.breadCrumbItems.length != 0"
      :items="this.breadCrumbItems"
    ></b-breadcrumb>
    <PatientPharmacyOptions v-bind:pharmacy="this.pharmacy" />
  </b-container>
  <b-container v-else>
    <h1>404 Page not found</h1>
    <h2>Page about the selected pharmacy does not exist.</h2>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import { makeToast } from "../util/makeToast";
import { eventBus } from "../util/eventBus";
import pharmacyService from "../service/PharmacyService";
import pharmacyAdminService from "../service/PharmacyAdminService";
import PatientPharmacyOptions from "../components/pharmacy/PatientPharmacyOptions";
import PharmacyDetails from "../components/pharmacy/PharmacyDetails";

//import {eventBus} from "../util/eventBus"

export default {
  name: "PharmacyHomePage",
  components: {
    PatientPharmacyOptions,
    PharmacyDetails,
  },
  data: function () {
    return {
      pharmacy: null,
      myPharmacyId: null,
      breadCrumbItems: [],
    };
  },
  mounted() {
    if (this.isPharmacyAdmin()) {
      pharmacyAdminService
        .getMyPharmacy(this.loggedUser.id)
        .then((response) => {
          this.myPharmacyId = response.data.id;
          this.fetchPharmacy();
        });
    } else {
      this.fetchPharmacy();
    }
  },
  methods: {
    fetchPharmacy: function () {
      pharmacyService
        .get(this.$route.params.id)
        .then((response) => {
          this.pharmacy = response.data;
          if (this.isPharmacyAdmin()) {
            this.setupBreadcrumbItems();
          }
        })
        .catch((error) => {
          if (error.response.status == 404) {
            this.pharmacy = null;
          } else if (error.response.status == 401) {
            this.$router.push({ name: "Login" });
          }
        });
    },
    updatePharmacyDetails: function (updatedPharmacy) {
      pharmacyService
        .updatePharmacyDetails(this.pharmacy.id, updatedPharmacy)
        .then((response) => {
          this.pharmacy = response.data;
          makeToast(
            this,
            "Successs",
            "Pharmacy details updated successfully.",
            "success"
          );
          eventBus.$emit("center-location-map", {
            longitude: this.pharmacy.longitude,
            latitude: this.pharmacy.latitude,
          });
        })
        .catch((error) => {
          if (error.response) {
            makeToast(this, "Error", error.response.data.message, "danger");
          }
        });
    },
    setupBreadcrumbItems: function () {
      this.breadCrumbItems = [
        {
          text: "Admin panel",
          to: { name: "PharmacyAdminHome" },
        },
        {
          text: this.pharmacy.name,
          to: { name: "PharmacyHomePage", params: { id: this.pharmacy.id } },
          active: true,
        },
      ];
    },
    isPharmacyAdmin: function () {
      return this.userRole == "PharmacyAdmin";
    },
    isPatient() {
      return this.userRole == "Patient";
    },
  },
  computed: {
    ...mapGetters(["userRole", "loggedUser"]),
    canEdit: function () {
      return this.isPharmacyAdmin() && this.myPharmacyId == this.pharmacy.id;
    },
  },
};
</script>

<style scoped>
#pharmacy-container {
  background-color: white;
}

.link-card:hover {
  box-shadow: #0000005e 0 12px 26px;
  transform: translate(0px, -10px);
}
.link-card {
  transition: 0.5s ease all;
  border-radius: 1.5em;
  background: #eee;
}
</style>
