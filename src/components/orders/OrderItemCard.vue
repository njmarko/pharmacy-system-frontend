<template>
  <b-card
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    :title="orderItem.medicineName"
    no-body
  >
    <b-card-header class="mb-1">
      <h3>{{ orderItem.medicineName }}</h3>
    </b-card-header>
    <b-badge v-if="orderItem.isNew" variant="success">
      New medicine
    </b-badge>
    <b-card-body>
      <b-card-text>
        <p>
          <strong>Medicine Id: </strong> {{ orderItem.medicineId }}<br />
          <strong>Quantity: </strong> {{ orderItem.quantity }}
        </p>
      </b-card-text>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  props: ["orderItem"],
};
</script>

<style scoped>
.card-header {
  color: #002664;
}
.option-card img {
  border-radius: 10%;
}
.option-card:hover {
  box-shadow: #0000005e 0 12px 26px;
  transform: translate(0px, -10px);
}
.option-card {
  transition: 0.5s ease all;
  border-radius: 1.5em;
  background: #eee;
}
</style>
