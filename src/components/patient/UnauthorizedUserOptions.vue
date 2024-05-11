<template>
  <div>
    <b-row class="align-self-md-stretch mb-4">
      <b-card-group deck>
        <b-col>
          <PharmacyOptionCard
            title="Pharmacies"
            :route="{ name: 'Pharmacies' }"
            image="https://res.cloudinary.com/culturemap-com/image/upload/ar_4:3,c_fill,g_faces:center,w_980/v1607119099/photos/317147_original.jpg"
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
            title="Log in for the best experience"
            :route="{
              name: 'Login',
            }"
            image="https://thumbs.dreamstime.com/b/hand-tying-laptop-computer-password-login-screen-cyber-security-concept-hand-tying-laptop-computer-password-login-117683864.jpg"
          />
        </b-col>
      </b-card-group>
    </b-row>
  </div>
</template>

<script>
import PharmacyOptionCard from "../pharmacy/PharmacyOptionCard";

export default {
  name: "UnauthorizedUserOptions",
  components: {
    PharmacyOptionCard,
  },
};
</script>

<style scoped>
</style>

