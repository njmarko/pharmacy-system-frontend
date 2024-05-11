<template>
  <div>
    <b-row class="align-self-md-stretch mb-2">
      <b-card-group deck>
        <b-col>
          <PharmacyOptionCard
            title="eRecipe"
            :route="{ name: 'PharmacyQRCodeSearchView' }"
            image="https://media.istockphoto.com/photos/doctor-or-physician-writing-diagnosis-and-giving-a-medical-to-female-picture-id842852832?k=6&m=842852832&s=612x612&w=0&h=yshawnLWS9v4DULpUpvRLBWZnBdF29hwShI-bZzuOXQ="
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="Book pharmacist appointment"
            :route="{ name: 'SchedulePharmacistAppointmentView' }"
            image="https://media.istockphoto.com/photos/medicine-advice-from-pharmacist-picture-id522306444?k=6&m=522306444&s=612x612&w=0&h=eLdz5EAwtg4Mb0eIwKuknd3h8VhYW3jqIyLFk4xWqfE="
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="Medicine stock"
            :route="{
              name: 'MedicineStockView',
              params: { id: this.pharmacy.id },
            }"
            image="https://media.istockphoto.com/photos/pharmacist-holding-medicine-box-and-capsule-pack-picture-id878852718?k=6&m=878852718&s=612x612&w=0&h=s5Bcdr5RUCXg2NnyDaLCP9YCX6TKdjM2ko_BkGu5PLA="
          />
        </b-col>
      </b-card-group>
    </b-row>
    <b-row class="align-self-md-stretch mb-2">
      <b-card-group deck>
        <b-col>
          <PharmacyOptionCard
            title="Appointments"
            :route="{
              name: 'AppointmentsView',
              params: { id: this.pharmacy.id },
            }"
            image="https://media.istockphoto.com/photos/femalehand-of-planner-writing-daily-appointment-picture-id1173258771?k=6&m=1173258771&s=612x612&w=0&h=Yg7hy6XaU05H0py1lq2W3t18e1ej5IyO6IArtPB3IZ0="
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="Pharmacists"
            :route="{
              name: 'PharmacistView',
              params: { id: this.pharmacy.id },
            }"
            image="https://media.istockphoto.com/photos/portrait-of-a-smiling-healthcare-worker-in-modern-pharmacy-picture-id1133588480?k=6&m=1133588480&s=612x612&w=0&h=LM6KS3XI-dKEbEF526v-2iP2pvzVPGL5kZ4D7BXTOHA="
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="Dermatologists"
            :route="{
              name: 'DermatologistsView',
              params: { id: this.pharmacy.id },
            }"
            image="https://media.istockphoto.com/photos/happy-young-patient-having-conversation-with-dermatologist-the-picture-id671352952?k=6&m=671352952&s=612x612&w=0&h=82IeDTSkTSTLklDVeD-wF4hjUIagx35KL3DJCnWH4LI="
          />
        </b-col>
      </b-card-group>
    </b-row>
  </div>
</template>

<script>
import PharmacyOptionCard from "./PharmacyOptionCard";

export default {
  name: "PatientPharmacyOptions",
  components: {
    PharmacyOptionCard,
  },
  props: ["pharmacy"],
};
</script>

<style scoped></style>
