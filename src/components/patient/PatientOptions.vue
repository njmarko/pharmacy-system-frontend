<template>
  <div>
    <b-row class="align-self-md-stretch mb-4">
      <b-card-group deck>
                <b-col>
          <PharmacyOptionCard
            title="Pharmacies"
            :route="{ name: 'Pharmacies' }"
            image="https://locumco.com.au/wp-content/uploads/2020/03/female-pharmacist-hospital.jpg"
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="Drugs"
            :route="{ name: 'Drugs' }"
            image="https://images.ctfassets.net/3mxqm9dw5ie4/3OscANLnK6Rhflflconkex/b6d41d2543ca827661ad5186a2d1af3c/Tackling_Coronavirus__COVID-19__Top_Tips_for_Pharmacies___Pharmacists..svg"
          />
        </b-col>

        <b-col>
          <PharmacyOptionCard
            title="My Reserved Drugs"
            :route="{
              name: 'PatientMedicineReservations',
            }"
            image="https://media.istockphoto.com/photos/background-of-a-large-group-of-assorted-capsules-pills-and-blisters-picture-id1153740646?k=6&m=1153740646&s=612x612&w=0&h=QjsRJE_9f3_Pw2kCMnjbWic1euprYi3irzvGQ-EB6jg="
          />
        </b-col>
      </b-card-group>
    </b-row>
    <b-row class="align-self-md-stretch mb-4">
      <b-card-group deck>
        <b-col>
          <PharmacyOptionCard
            title="My Appointments"
            :route="{
              name: 'PatientAppointmentsView',
            }"
            image="https://img3.stockfresh.com/files/i/iqoncept/m/10/1669625_stock-photo-calendar---appointment-day-circled-for-reminder.jpg"
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="Schedule an Appointment With Dermatologist"
            :route="{ name: 'ChoosePharmacy' }"
            image="https://previews.123rf.com/images/anatoliygleb/anatoliygleb1711/anatoliygleb171100144/89098267-portrait-of-beautiful-woman-dentist-with-microscope-at-the-modern-dental-office-doctor-wearing-glass.jpg"
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="Schedule an Appointment With Pharmacist"
            :route="{ name: 'SchedulePharmacistAppointmentChoosePharmacy' }"
            image="https://www.thehealthy.com/wp-content/uploads/2017/03/01-lowest-price-Secrets-Your-Pharmacist-Isn%E2%80%99t-Telling-You_418238917-pikselstock-760x506.jpg?resize=700,466"
          />
        </b-col>
      </b-card-group>
    </b-row>
    <b-row class="align-self-md-stretch mb-4">
      <b-card-group deck>
        <b-col>
          <PharmacyOptionCard
            title="My eRecipes"
            :route="{
              name: 'RecipeView',
            }"
            image="https://thumbs.dreamstime.com/b/medicine-pharmacy-concept-recipe-form-lying-table-stethoscope-pills-blue-pen-60541828.jpg"
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="QR Code Search"
            :route="{ name: 'PharmacyQRCodeSearchView' }"
            image="https://chnnews.pl/media/k2/items/cache/810e8f1b228749d9ddfbc629210c1bd3_L.jpg"
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="My Pharmacy Subscriptions"
            :route="{ name: 'PharmacySubscriptionView' }"
            image="https://cdn2.poz.com/91504_iStock-894559892.jpg_a288ee73-35a1-4462-a339-668bce6e9331_x2.jpeg"
          />
        </b-col>
      </b-card-group>
    </b-row>
    <b-row class="align-self-md-stretch mb-4">
      <b-card-group deck>
         <b-col>
          <PharmacyOptionCard
            title="My Complaints"
            :route="{ name: 'ComplaintsView' }"
            image="https://media.istockphoto.com/photos/retro-grunge-complaints-dept-door-picture-id628711862?k=6&m=628711862&s=612x612&w=0&h=cZUUOFUM9BVG6HtbC60h1H26Ekar7MWp2k2ALx2nsmw="
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="Previous Appointments"
            :route="{ name: 'PatientsPastDermatologistAppointmentsView' }"
            image="https://media.istockphoto.com/photos/attractive-dermatologist-in-white-coat-examining-skin-of-patient-in-picture-id1190138450?k=6&m=1190138450&s=612x612&w=0&h=ym3DCHdLT_5j5Mw-oPm9JGXqzLqDmi0w2PTMC0b4s9U="
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="My Penalties"
            :route="{ name: 'PatientProfile' }"
            image="https://thumbs.dreamstime.com/b/wooden-blocks-word-fine-judge-penalty-as-punishment-crime-offense-financial-violations-traffic-laws-fraud-142504055.jpg"
          />
        </b-col>
      </b-card-group>
    </b-row>
  </div>
</template>

<script>
import PharmacyOptionCard from "../pharmacy/PharmacyOptionCard";

export default {
  name: "PatientOptions",
  components: {
    PharmacyOptionCard,
  },
};
</script>

<style>
.option-card img {
  border-radius: 10%;
  max-height: 169px;
  object-fit: cover;
}
</style>
