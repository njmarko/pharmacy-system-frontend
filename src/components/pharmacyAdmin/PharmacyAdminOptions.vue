<template>
  <div>
    <b-row class="align-self-md-stretch mb-2">
      <b-card-group deck>
        <b-col>
          <PharmacyOptionCard
            title="Leave requests"
            :route="{ name: 'PharmacistsLeaveRequestsView' }"
            image="https://i.pinimg.com/originals/dc/f8/ee/dcf8ee40904250d56191b949952dc390.jpg"
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="Manage appointment price"
            :route="{ name: 'ManageAppointmentPrice' }"
            image="https://media.istockphoto.com/photos/business-accounting-concept-business-man-using-calculator-with-and-picture-id941729686?k=6&m=941729686&s=612x612&w=0&h=CXc1G_64BBO63fTypQ8q3EA5Bxqm_HphWPVtSY0u4rs="
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="Manage pharmacists"
            :route="{
              name: 'ManagePharmacistsView',
            }"
            image="https://media.istockphoto.com/photos/portrait-of-a-smiling-healthcare-worker-in-modern-pharmacy-picture-id1133588480?k=6&m=1133588480&s=612x612&w=0&h=LM6KS3XI-dKEbEF526v-2iP2pvzVPGL5kZ4D7BXTOHA="
          />
        </b-col>
      </b-card-group>
    </b-row>
    <b-row class="align-self-md-stretch mb-2">
      <b-card-group deck>
        <b-col>
          <PharmacyOptionCard
            title="Manage dermatologists"
            :route="{
              name: 'ManageDermatologistsView',
            }"
            image="https://media.istockphoto.com/photos/happy-young-patient-having-conversation-with-dermatologist-the-picture-id671352952?k=6&m=671352952&s=612x612&w=0&h=82IeDTSkTSTLklDVeD-wF4hjUIagx35KL3DJCnWH4LI="
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="Manage medicine stock"
            :route="{
              name: 'AdminMedicineStocksView',
            }"
            image="https://media.istockphoto.com/photos/pharmacist-holding-medicine-box-and-capsule-pack-picture-id878852718?k=6&m=878852718&s=612x612&w=0&h=s5Bcdr5RUCXg2NnyDaLCP9YCX6TKdjM2ko_BkGu5PLA="
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="Manage appointments"
            :route="{
              name: 'ManageAppointments',
            }"
            image="https://media.istockphoto.com/photos/femalehand-of-planner-writing-daily-appointment-picture-id1173258771?k=6&m=1173258771&s=612x612&w=0&h=Yg7hy6XaU05H0py1lq2W3t18e1ej5IyO6IArtPB3IZ0="
          />
        </b-col>
      </b-card-group>
    </b-row>
    <b-row class="align-self-md-stretch mb-2">
      <b-card-group deck>
        <b-col>
          <PharmacyOptionCard
            title="Business reports"
            :route="{ name: 'BusinessReportsView' }"
            image="https://i.kym-cdn.com/entries/icons/facebook/000/029/959/Screen_Shot_2019-06-05_at_1.26.32_PM.jpg"
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="Create promotion"
            :route="{ name: 'CreatePromotionView' }"
            image="https://media.istockphoto.com/photos/close-up-creative-designer-applaud-for-job-success-at-meeting-table-picture-id1133505958?k=6&m=1133505958&s=612x612&w=0&h=oZyb9giYftcwDclDgJuLi4E5N0OtcUJ6eI0k5RZabFE="
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="Manage orders"
            :route="{ name: 'ManageOrders' }"
            image="https://media.istockphoto.com/photos/female-inventory-manager-shows-digital-tablet-information-to-a-worker-picture-id1071030302?k=6&m=1071030302&s=612x612&w=0&h=KJogc5SjvE4aeTA4YK9NJDbTEXS0TelmkJjDWN79S_g="
          />
        </b-col>
      </b-card-group>
    </b-row>
  </div>
</template>

<script>
import PharmacyOptionCard from "../pharmacy/PharmacyOptionCard";

export default {
  name: "PharmacyOptions",
  components: {
    PharmacyOptionCard,
  },
  props: ["pharmacy"],
};
</script>

<style scoped></style>
