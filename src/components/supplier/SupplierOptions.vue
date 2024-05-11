<template>
  <div>
    <b-row class="align-self-md-stretch mb-4">
      <b-card-group deck>
        <b-col>
          <PharmacyOptionCard
            title="See active orders"
            :route="{ name: 'OrdersView' }"
            image="https://i.pinimg.com/originals/dc/f8/ee/dcf8ee40904250d56191b949952dc390.jpg"
          />
        </b-col>
        <b-col>
          <PharmacyOptionCard
            title="See made offers"
            :route="{ name: 'OffersFilter' }"
            image="https://media.istockphoto.com/vectors/facade-pharmacy-store-with-a-signboard-awning-symbol-on-shopwindow-vector-id607264882?k=6&m=607264882&s=612x612&w=0&h=-gzEF18wG_eLljCJrSWUriIGXf7TL81ZzwU3Kmg46M0="
          />
        </b-col>
        
      </b-card-group>
    </b-row>
  </div>
</template>

<script>
import PharmacyOptionCard from "../../components/pharmacy/PharmacyOptionCard";

export default {
  name: "SupplierOptions",
  components: {
    PharmacyOptionCard,
  }
  };
</script>

<style scoped></style>
