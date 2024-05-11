<template>
  <b-card
    no-body
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    :title="medicine.medicineName"
  >
    <b-card-header>
      <div class="text-center">
        <h3>{{ medicine.medicineName }}</h3>
      </div>
    </b-card-header>
    <b-card-body class="h-100 d-flex flex-column">
      <b-card-text>
        <b-row>
          <b-col  class="col-lg-6 col-md-6 col-sm-6 col-6 text-center">
            Quantity: <br/> <strong>{{ medicine.quantity}}</strong>
          </b-col>
            <b-col  class="col-lg-6 col-md-6 col-sm-6 col-6 text-center">
            Therapy days: <br/> <strong>{{ medicine.therapyDays }}</strong>
          </b-col>
        </b-row>
        <hr/>
         <b-row>
          <b-col  class="text-center">
            Price: <br/> <strong>{{ medicine.price}} RSD</strong>
          </b-col>
        </b-row>
      </b-card-text>
    </b-card-body>
  </b-card>
</template>


<script>

export default {
  props: ["medicine"],
  name: "PrescribedMedicineCard"
};
</script>

<style scoped>
.card-title {
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
  margin-bottom: 5px;
}
</style>
