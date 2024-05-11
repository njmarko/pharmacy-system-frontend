<template>
  <b-card>
    <b-row class="no-gutter">
      <b-col cols="8">
        <h1>
          {{ this.pharmacy.name }}
          <b-button variant="link" v-if="canEdit" size="lg" v-on:click="showUpdateModal"
            >Edit details</b-button
          >
        </h1>
        <hr />
        <p>{{ this.pharmacy.description }}</p>
        <hr />
        <b-list-group flush>
          <b-list-group-item>
            <strong>Address:</strong>
            {{ this.pharmacyAddress }}
          </b-list-group-item>
          <b-list-group-item>
            <strong>Rating:</strong>
            <star-rating
              :read-only="true"
              :inline="true"
              :increment="0.01"
              :star-size="20"
              v-bind:rating="this.pharmacy.averageGrade"
            />
            / 5
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col cols="4">
        <LocationMap
          ref="locationMap"
          v-bind:longitude="this.pharmacy.longitude"
          v-bind:latitude="this.pharmacy.latitude"
          :clickable="false"
          :shouldAnimate="true"
        />
      </b-col>
    </b-row>
    <b-card-footer class="text-left" v-if="this.userRole == 'Patient'">
      <b-button :variant="this.subButtonColor" v-on:click="manageSubscription"
        >{{this.subButtonText}}</b-button
      >
      <b-button variant="warning" class="ml-2" @click="showModal"
        >File a complaint</b-button
      >
    </b-card-footer>
    <PharmacyUpdateModal
      v-bind:pharmacy="pharmacy"
      v-on:update-details="updateDetails"
      ref="updatePharmacyModal"
    />
    <b-modal
      :id="'modal-' + this.pharmacy.id"
      :title="'File a complaint against ' + this.pharmacy.name"
      hide-footer
      header-text-variant="light"
      header-bg-variant="primary"
      scrollable
    >
      <b-form-textarea
        id="input-8"
        v-model="content"
        placeholder="Enter complaint"
        rows="5"
        max-rows="5"
        no-resize
        class="text-area-field"
        :state="this.content.length <= 1000 && this.content !== ''"
      >
      </b-form-textarea>
      <b-form-invalid-feedback>
        Complaint cannot be longer than 1000 characters and cannot be empty.
      </b-form-invalid-feedback>
      <b-button class="mt-3" block variant="primary" @click="fileComplaint"
        >Confirm</b-button
      >
    </b-modal>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";
import PharmacyUpdateModal from "./PharmacyUpdateModal";
import LocationMap from "../openLayers/LocationMap";
import StarRating from "vue-star-rating";
import pharmacyService from "../../service/PharmacyService";
import { makeToast } from "../../util/makeToast";
//import { eventBus } from '../../util/eventBus';

export default {
  name: "PharmacyDetails",
  props: ["pharmacy", "canEdit"],
  data() {
    return {
      content: '',
      isSubscribed: false
    }
  },
  components: {
    StarRating,
    LocationMap,
    PharmacyUpdateModal,
  },
  mounted(){
    if(this.userRole === "Patient" && this.pharmacy){
      pharmacyService.checkSubscription(this.pharmacy.id, this.loggedUser.id)
        .then(response=>{
          this.isSubscribed = response.data;
        })
        .catch(error=>{
          if(error.response)
            makeToast(this, "Error", error.response.data.message, "danger");
        })
    }
  },
  methods: {
    subscribe: function () {
      alert("SUBSCRIBE");
    },
    unsubscribe: function () {
      alert("UNSUBSCRIBE");
    },
    updateDetails: function (updatedPharmacy) {
      this.$refs.updatePharmacyModal.hide();
      this.$emit("update-pharmacy-details", updatedPharmacy);
    },
    manageSubscription(){
        if(this.isSubscribed){
          pharmacyService.unsubscribe(this.pharmacy.id, this.loggedUser.id)
            .then(()=>{
              this.isSubscribed = false;
            })
        }
        else{
          pharmacyService.subscribe(this.pharmacy.id, this.loggedUser.id)
            .then(()=>{
              this.isSubscribed = true;
            })
        }
    }
    ,
    showModal(){
      this.$bvModal.show('modal-' + this.pharmacy.id);
    },
    showUpdateModal: function () {
      this.$refs.updatePharmacyModal.show();
    },
    fileComplaint() {
      if (this.content.length > 1000 || this.content === "")
        makeToast(
          this,
          "Error",
          "Complaint cannot be longer than 1000 characters and cannot be empty.",
          "danger"
        );
      else {
        pharmacyService
          .fileComplaint(this.pharmacy.id, {
            patientId: this.loggedUser.id,
            content: this.content,
          })
          .then(() => {
            makeToast(
              this,
              "Success",
              "Complaint successfully filed.",
              "success"
            );
            this.content = "";
            this.$bvModal.hide("modal-" + this.pharmacy.id);
          })
          .catch((error) => {
            if (error.response)
              makeToast(this, "Error", error.response.data.message, "danger");
          });
      }
    },
  },
  computed: {
    ...mapGetters(["userRole", "loggedUser"]),
    pharmacyAddress: function () {
      return `${this.pharmacy.street} ${this.pharmacy.streetNumber}, ${this.pharmacy.city}, ${this.pharmacy.country}`;
    },
    subButtonText(){
      if(this.isSubscribed)
        return "Unsubscribe from newsletter";
      else
        return "Subscribe to newsletter";
    },
    subButtonColor(){
      if(this.isSubscribed)
        return "danger";
      else
        return "primary";
    },
  },
};
</script>

<style scoped></style>
