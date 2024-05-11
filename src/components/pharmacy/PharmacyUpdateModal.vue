<template>
  <b-modal
    v-if="updatedData"
    v-on:shown="onShown"
    v-on:hidden="onHidden"
    :id="'update-pharmacy-modal'"
    :title="'Update pharmacy details'"
    hide-footer
    size="lg"
    header-text-variant="light"
    header-bg-variant="primary"
  >
    <b-form v-on:submit.prevent="updateDetails">
      <b-row>
        <b-col lg="12" xs="12">
          <b-form-group id="input-group-1" class="mb-2">
            <div class="form-label-group">
              <b-form-input
                v-model="updatedData.name"
                id="updated-name-input"
                :state="updatedData.name != ''"
                placeholder="Enter pharmacy name"
                required
                trim
              />
              <label for="updated-name-input">Enter pharmacy name</label>
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="12" xs="12">
          <b-form-textarea
            id="input-8"
            v-model="updatedData.description"
            placeholder="Enter pharmacy descsription"
            rows="5"
            max-rows="5"
            required
            trim
            no-resize
            class="text-area-field my-rounded"
            :state="updatedData.description !== ''"
          >
          </b-form-textarea>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="8" xs="8">
          <b-form-group id="input-group-2" class="mb-2">
            <div class="form-label-group">
              <b-form-input
                v-model="updatedData.location.address.street"
                id="updated-street-input"
                :state="validStreet"
                placeholder="Street"
                required
                trim
              />
              <label for="updated-street-input">Street</label>
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="4" xs="4">
          <b-form-group id="input-group-3" class="mb-2">
            <div class="form-label-group">
              <b-form-input
                v-model="updatedData.location.address.streetNumber"
                id="updated-street-number-input"
                :state="validStreetNumber"
                placeholder="Street number"
                required
                trim
              />
              <label for="updated-street-number-input">Street number</label>
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="4" xs="4">
          <b-form-group id="input-group-4" class="mb-2">
            <div class="form-label-group">
              <b-form-input
                v-model="updatedData.location.address.city"
                id="updated-city-input"
                :state="validCity"
                placeholder="City"
                required
                trim
              />
              <label for="updated-city-input">City</label>
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="4" xs="4">
          <b-form-group id="input-group-5" class="mb-2">
            <div class="form-label-group">
              <b-form-input
                v-model="updatedData.location.address.zipCode"
                id="updated-zip-code-input"
                :state="validZipCode"
                placeholder="Zip code"
                required
                trim
              />
              <label for="updated-zip-code-input">Zip code</label>
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="4" xs="4">
          <b-form-group id="input-group-6" class="mb-2">
            <div class="form-label-group">
              <b-form-input
                v-model="updatedData.location.address.country"
                id="updated-country-input"
                :state="validCountry"
                placeholder="Country"
                required
                trim
              />
              <label for="updated-country-input">Country</label>
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="12" xs="12">
          <LocationMap
            v-if="loaded"
            v-bind:longitude="this.updatedData.location.longitude"
            v-bind:latitude="this.updatedData.location.latitude"
            v-on:location-changed="locationChanged"
            :isModal="true"
            :clickable="true"
          />
        </b-col>
      </b-row>
      <b-button
        class="mt-3"
        block
        type="submit"
        variant="primary"
        :disabled="isInvalidUpdatedPharmacy"
        >Update pharmacy details</b-button
      >
    </b-form>
    <b-button class="mt-3" v-on:click="hide" block>Close</b-button>
  </b-modal>
</template>

<script>
import LocationMap from "../openLayers/LocationMap";

export default {
  props: ["pharmacy"],
  components: {
    LocationMap,
  },
  data() {
    return {
      loaded: false,
      updatedData: null,
    };
  },
  mounted() {
    this.loadUpdatedData();
  },
  methods: {
    locationChanged: function (location) {
      this.updatedData.location = { ...location };
    },
    loadUpdatedData: function () {
      this.updatedData = {
        name: this.pharmacy.name,
        description: this.pharmacy.description,
        location: {
          longitude: this.pharmacy.longitude,
          latitude: this.pharmacy.latitude,
          address: {
            city: this.pharmacy.city,
            country: this.pharmacy.country,
            zipCode: this.pharmacy.zipCode,
            street: this.pharmacy.street,
            streetNumber: this.pharmacy.streetNumber,
          },
        },
      };
    },
    onShown: function () {
      this.loaded = true;
    },
    onHidden: function () {
      this.loaded = false;
    },
    updateDetails: function () {
      this.$emit("update-details", this.updatedData);
    },
    show: function () {
      this.loadUpdatedData();
      this.$bvModal.show("update-pharmacy-modal");
    },
    hide: function () {
      this.$bvModal.hide("update-pharmacy-modal");
    },
    validLocationField: function (field) {
      return field != null && field != undefined && field != "";
    },
  },
  computed: {
    isInvalidUpdatedPharmacy: function () {
      return (
        this.updatedData.location.longitude == null ||
        this.updatedData.location.latitude == null ||
        !this.validStreet ||
        !this.validStreetNumber ||
        !this.validCity ||
        !this.validZipCode ||
        !this.validCountry
      );
    },
    validStreet: function () {
      return this.validLocationField(this.updatedData.location.address.street);
    },
    validStreetNumber: function () {
      return this.validLocationField(
        this.updatedData.location.address.streetNumber
      );
    },
    validCity: function () {
      return this.validLocationField(this.updatedData.location.address.city);
    },
    validZipCode: function () {
      return this.validLocationField(this.updatedData.location.address.zipCode);
    },
    validCountry: function () {
      return this.validLocationField(this.updatedData.location.address.country);
    },
  },
};
</script>

<style scoped>
.my-rounded {
  border-radius: 20px;
}
</style>