<template>
  <b-container v-if="pharmacy" id="pharmacy-container">
    <b-breadcrumb :items="this.breadCrumbItems"></b-breadcrumb>
    <b-card-group deck>
      <b-card class="text-left">
        <b-card-title>
          <strong>Pharmacist appointment price</strong>
          <b-button
            v-b-toggle="['collapse-1', 'collapse-2']"
            variant="link"
            class="float-right"
            ref="phButton"
            >Edit</b-button
          >
        </b-card-title>
        <b-collapse id="collapse-1" visible>
          <p>{{ pharmacy.currentPharmacistAppointmentPrice }} RSD</p>
        </b-collapse>
        <b-collapse id="collapse-2">
          <b-card>
            <b-form
              id="form-1"
              v-on:submit.prevent="updatePharmacistPrice"
              v-on:reset.prevent="resetPharmacistPrice"
            >
              <b-form-group
                label="Current price"
                label-class="font-weight-bold"
                label-for="input-ph-price"
              >
                <b-form-input
                  id="input-ph-price"
                  placeholder="Enter pharmacist appointment price"
                  type="number"
                  min="0"
                  step="0.01"
                  :state="dto.pharmacistAppointmentPrice > 0"
                  v-model="dto.pharmacistAppointmentPrice"
                >
                </b-form-input>
                <b-form-invalid-feedback>
                  Pharmacist appointment price must be a positive number.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group>
                <b-button type="submit" variant="primary" class="ml-auto"
                  >Save Changes</b-button
                >
                <b-button
                  type="reset"
                  variant="primary"
                  class="ml-auto float-right"
                  >Cancel</b-button
                >
              </b-form-group>
            </b-form>
          </b-card>
        </b-collapse>
      </b-card>
      <b-card class="text-left">
        <b-card-title>
          <strong>Dermatologist appointment price</strong>
          <b-button
            v-b-toggle="['collapse-3', 'collapse-4']"
            variant="link"
            class="float-right"
            ref="dermButton"
            >Edit</b-button
          >
        </b-card-title>
        <b-collapse id="collapse-3" visible>
          <p>{{ pharmacy.currentDermatologistAppointmentPrice }} RSD</p>
        </b-collapse>
        <b-collapse id="collapse-4">
          <b-card>
            <b-form
              id="form-2"
              v-on:submit.prevent="updateDermatologistPrice"
              v-on:reset.prevent="resetDermatologistPrice"
            >
              <b-form-group
                label="Current price"
                label-class="font-weight-bold"
                label-for="input-derm-price"
              >
                <b-form-input
                  id="input-derm-price"
                  placeholder="Enter dermatologist appointment price"
                  type="number"
                  min="0"
                  step="0.01"
                  :state="dto.dermatologistAppointmentPrice > 0"
                  v-model="dto.dermatologistAppointmentPrice"
                >
                </b-form-input>
                <b-form-invalid-feedback>
                  Dermatologist appointment price must be a positive number.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group>
                <b-button type="submit" variant="primary" class="ml-auto"
                  >Save Changes</b-button
                >
                <b-button
                  type="reset"
                  variant="primary"
                  class="ml-auto float-right"
                  >Cancel</b-button
                >
              </b-form-group>
            </b-form>
          </b-card>
        </b-collapse>
      </b-card>
    </b-card-group>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import { makeToast } from "../util/makeToast";
import pharmacyAdminService from "../service/PharmacyAdminService";
import pharmacyService from "../service/PharmacyService";

export default {
  data() {
    return {
      breadCrumbItems: [
        {
          text: "Admin panel",
          to: { name: "PharmacyAdminHome" },
        },
        {
          text: "Manage appointment prices",
          active: true,
        },
      ],
      pharmacy: null,
      dto: {},
    };
  },
  mounted() {
    pharmacyAdminService.getMyPharmacy(this.loggedUser.id).then((response) => {
      this.pharmacy = response.data;
      this.dto = {
        pharmacistAppointmentPrice: this.pharmacy
          .currentPharmacistAppointmentPrice,
        dermatologistAppointmentPrice: this.pharmacy
          .currentDermatologistAppointmentPrice,
      };
    });
  },
  methods: {
    updatePharmacistPrice: function () {
      this.updateAppointmentPrice({
        pharmacistAppointmentPrice: this.dto.pharmacistAppointmentPrice,
      });
      this.$refs.phButton.click();
    },
    updateDermatologistPrice: function () {
      this.updateAppointmentPrice({
        dermatologistAppointmentPrice: this.dto.dermatologistAppointmentPrice,
      });
      this.$refs.dermButton.click();
    },
    resetPharmacistPrice: function () {
      this.dto.pharmacistAppointmentPrice = this.pharmacy.currentPharmacistAppointmentPrice;
      this.$refs.phButton.click();
    },
    resetDermatologistPrice: function () {
      this.dto.dermatologistAppointmentPrice = this.pharmacy.dermatologistAppointmentPrice;
      this.$refs.dermButton.click();
    },
    updateAppointmentPrice: function (requestBody) {
      pharmacyService
        .updateAppointmentPrice(this.pharmacy.id, requestBody)
        .then((response) => {
          this.pharmacy.currentPharmacistAppointmentPrice =
            response.data.currentPharmacistAppointmentPrice;
          this.pharmacy.currentDermatologistAppointmentPrice =
            response.data.currentDermatologistAppointmentPrice;
          makeToast(
            this,
            "Success",
            "Appointment price has been updated successfully.",
            "success"
          );
        })
        .catch((error) => {
          if (error.response) {
            makeToast(this, "Error", error.response.data.message, "danger");
          } else {
            makeToast(
              this,
              "Error",
              "An error has occured while trying to remove medicine.",
              "danger"
            );
          }
        });
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