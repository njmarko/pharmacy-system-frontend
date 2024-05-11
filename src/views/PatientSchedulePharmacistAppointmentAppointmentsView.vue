<template>
  <b-container id="homepage-container">
    <br />
    <PharmacyAvailablePharmacistAppointmentsCardList
      v-if="this.pharmacyIdData"
      :numCols="4"
      :numRows="2"
      :appointmentType="`Pharmacist`"
      :dateTime="this.dateTimeData"
      :pharmacyId="this.pharmacyIdData + ``"
    />
  </b-container>
</template>

<script>
import PharmacyAvailablePharmacistAppointmentsCardList from "@/components/appointment/PharmacyAvailablePharmacistAppointmentsCardList";
export default {
  props: {
    dateTime: {
      type: String,
    },
    pharmacyId: String,
  },
  data: function () {
    return {
      dateTimeData: null,
      pharmacyIdData: null,
    };
  },
  components: {
    PharmacyAvailablePharmacistAppointmentsCardList,
  },
  name: "SchedulePharmacistAppointmentAppointmentsView",
  mounted() {
    if (this.$route.query.dateTime) {
      this.dateTimeData = new Date(this.$route.query.dateTime);
    }
    if(this.$route.params.id){
        this.pharmacyIdData = this.$route.params.id;
    }
    if (!this.dateTimeData){
      this.dateTimeData = new Date();
    }

  },
};
</script>
<style scoped>
#homepage-container {
  background-color: white;
}
</style>



