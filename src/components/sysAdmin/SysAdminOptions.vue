<template>
  <div>
    <b-row class="align-self-md-stretch mb-4">
      <b-card-group deck>
        <b-col>
          <PharmacyOptionCard
            title="Register pharmacy"
            :route="{ name: 'PharmacyRegistration' }"
            image="https://i.pinimg.com/originals/dc/f8/ee/dcf8ee40904250d56191b949952dc390.jpg"
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="Register pharmacy admin"
            :route="{ name: 'RegisterPharmacyAdmin' }"
            image="https://media.istockphoto.com/vectors/facade-pharmacy-store-with-a-signboard-awning-symbol-on-shopwindow-vector-id607264882?k=6&m=607264882&s=612x612&w=0&h=-gzEF18wG_eLljCJrSWUriIGXf7TL81ZzwU3Kmg46M0="
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="Register dermatologist"
            :route="{
              name: 'RegisterDermatologist',
            }"
            image="https://media.istockphoto.com/photos/attractive-dermatologist-in-white-coat-examining-skin-of-patient-in-picture-id1190138450?k=6&m=1190138450&s=612x612&w=0&h=ym3DCHdLT_5j5Mw-oPm9JGXqzLqDmi0w2PTMC0b4s9U="
          />
        </b-col>
        
      </b-card-group>
    </b-row>
    <b-row class="align-self-md-stretch mb-4">
      <b-card-group deck>
        <b-col>
          <PharmacyOptionCard
            title="Register supplier"
            :route="{
              name: 'RegisterSupplier'
            }"
            image="https://media.istockphoto.com/photos/woman-working-in-industry-distribution-warehouse-picture-id1219747222?k=6&m=1219747222&s=612x612&w=0&h=WfXQJQz4o6shuwwmry45zeOFCARKZNupr4uBs5x1xME="
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="Register system admin"
            :route="{
              name: 'RegisterSysAdmin'
            }"
            image="https://media.istockphoto.com/photos/login-and-password-picture-id479209068?k=6&m=479209068&s=612x612&w=0&h=NjUpcOU3_uWG9zMXeAMHmP8T5-vcqEyZQYTMai_7Gr0="
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="Add medicine"
            :route="{
              name: 'MedicineRegistration'
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
            title="Unanswered complaints"
            :route="{ name: 'ComplaintsView', query: {answered: 'no'}}"
            image="https://media.istockphoto.com/photos/retro-grunge-complaints-dept-door-picture-id628711862?k=6&m=628711862&s=612x612&w=0&h=cZUUOFUM9BVG6HtbC60h1H26Ekar7MWp2k2ALx2nsmw="
          />
        </b-col>
         <b-col>
          <PharmacyOptionCard
            title="My answered complaints"
            :route="{ name: 'ComplaintsView', query: {answered: 'yes'} }"
            image="https://media.istockphoto.com/photos/retro-grunge-complaints-dept-door-picture-id628711862?k=6&m=628711862&s=612x612&w=0&h=cZUUOFUM9BVG6HtbC60h1H26Ekar7MWp2k2ALx2nsmw="
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="Loyalty program"
            :route="{ name: 'LoyaltyProgramView' }"
            image="https://media.istockphoto.com/vectors/loyalty-card-line-icon-bonus-points-discount-program-vector-vector-id1187805870?k=6&m=1187805870&s=612x612&w=0&h=Yv6Nxbtjie2iugCphD7uj95C9Ke9ri2Ulvj6w_dp0j0="
          />
        </b-col>
        
      </b-card-group>
    </b-row>

    <b-row class="align-self-md-stretch mb-4">
      <b-card-group deck>
        <b-col>
          <PharmacyOptionCard
            title="Requests for leave"
            :route="{ name: 'DermatologistsLeaveRequestsView' }"
            image="https://media.istockphoto.com/vectors/survey-or-exam-form-long-paper-sheet-with-answered-quiz-checklist-and-vector-id1195871692?k=6&m=1195871692&s=612x612&w=0&h=PPioH9TJ7TGx5_P5-0F5BscA9OlSp-Nj6EtYN1f3HoY="
          />
        </b-col>
      </b-card-group>
    </b-row>
  </div>
</template>

<script>
import PharmacyOptionCard from "../../components/pharmacy/PharmacyOptionCard";

export default {
  name: "SysAdminOptions",
  components: {
    PharmacyOptionCard,
  }
  };
</script>

<style scoped></style>
