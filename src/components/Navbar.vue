<template>
  <b-navbar id="navbar" toggleable="lg" type="dark" variant="dark">
    <b-container>
      <b-navbar-brand :to="{ name: 'Home' }">MRSISA</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item v-if="!isPatient()" :to="{ name: 'Drugs' }">Drugs</b-nav-item>
          <b-nav-item-dropdown text="Drugs" left v-if="isPatient()">
            <b-dropdown-item :to="{name: 'PatientMedicineReservations'}">My Reserved Drugs</b-dropdown-item>
            <b-dropdown-item :to="{name: 'RecipeView'}">My eRecipes</b-dropdown-item>
            <hr/>
            <b-dropdown-item :to="{name: 'Drugs'}">Reserve Drugs</b-dropdown-item>
            <b-dropdown-item :to="{name: 'PharmacyQRCodeSearchView'}">QR Code Search</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item :to="{ name: 'Pharmacies' }">Pharmacies</b-nav-item>
          <b-nav-item
            v-if="isPharmacistOrDermatologistLoggedIn()"
            :to="{ name: 'Patients' }"
            >Patients</b-nav-item
          >
          <b-nav-item-dropdown text="Appointments" left v-if="isPatient()">
            <b-dropdown-item :to="{name: 'PatientAppointmentsView'}">My Appointments</b-dropdown-item>
            <b-dropdown-item :to="{name: 'PatientsPastDermatologistAppointmentsView'}">My Previous Appointments</b-dropdown-item>
            <hr/>
            <b-dropdown-item :to="{name: 'ChoosePharmacy'}">Schedule Dermatologist Appointment</b-dropdown-item>
            <b-dropdown-item :to="{name: 'SchedulePharmacistAppointmentChoosePharmacy'}">Schedule Pharmacist Appointment</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown text="Employees" left v-if="isPatient() || isPharmacyAdmin()">
            <b-dropdown-item v-if="isPatient()" :to="{ name: 'AllPharmacistsView' }"
              >Pharmacists</b-dropdown-item
            >
            <b-dropdown-item
              v-if="isPharmacyAdmin()"
              :to="{ name: 'ManagePharmacistsView' }"
              >Pharmacists</b-dropdown-item
            >
            <b-dropdown-item v-if="isPatient()" :to="{ name: 'AllDermatologistsView' }"
              >Dermatologists</b-dropdown-item
            >
            <b-nav-item
              v-if="isPharmacyAdmin()"
              :to="{ name: 'ManageDermatologistsView' }"
              >Dermatologists</b-nav-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
        <b-navbar-nav v-if="!isUserLoggedIn()" class="ml-auto">
          <b-nav-item :to="{ name: 'Login' }">Log in</b-nav-item>
          <b-nav-item :to="{ name: 'Register' }">Register</b-nav-item>
        </b-navbar-nav>
        <b-nav-item-dropdown v-if="isUserLoggedIn()" right class="ml-auto" >
          <template #button-content>
            <b-avatar
              class=".d-none .d-sm-block align-top"
              sm="invisible"
              size="1.5em"
              variant="info"
              src="https://picsum.photos/200/300.webp"
            ></b-avatar>
          </template>
          <b-dropdown-item :to="{ name: this.userProfilePage }"
            v-if="!isSystemAdmin()">Profile</b-dropdown-item
          >
          <hr v-if="isPatient()"/>
          <b-dropdown-item :to="{ name: 'PharmacySubscriptionView' }"
            v-if="isPatient()">My Subscriptions</b-dropdown-item
          >
          <b-dropdown-item :to="{ name: 'ComplaintsView'}"
            v-if="isPatient()">My Complaints</b-dropdown-item
          >
          <hr v-if="!isSystemAdmin()"/>
          <b-dropdown-item v-on:click="logOut">Log out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

export default {
  name: "Navbar",
  props: {},
  methods: {
    ...mapActions(["removeUser"]),
    isUserLoggedIn() {
      if (this.loggedUser.jwt) {
        return true;
      }
      return false;
    },
    isPharmacistOrDermatologistLoggedIn() {
      if (this.isUserLoggedIn()) {
        let role = this.loggedUser.authorities[0];
        if (role === "ROLE_PHARMACIST" || role === "ROLE_DERMATOLOGIST") {
          return true;
        }
      }

      return false;
    },
    isPharmacyAdmin() {
      return this.userRole == "PharmacyAdmin";
    },
    isPatient() {
      return this.userRole == "Patient";
    },
    isSystemAdmin(){
      return this.userRole == "SysAdmin";
    },
    logOut() {
      this.removeUser();
      this.$router.push({ name: "Home" }).catch(() => {});
    },
  },
  computed: {
    ...mapGetters(["loggedUser", "userRole", "userProfilePage"]),
  },
};
</script>
<style scoped>
#app,
html {
  background: #f5f5f5 !important;
}
</style>
