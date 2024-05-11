<template>
  <b-card
    no-body
    img-top
    title-variant="card-title"
    style="width:70%; height:90%; margin:auto"
    class="mb-2 option-card"
    :title="this.medicine.name"
  >
    <b-card-header >
      <h3>{{medicine.name}}</h3>
    </b-card-header>
    <b-card-body class="d-flex flex-column" style="margin-bottom:1%">
      <b-card-text>
          <strong>Type: </strong><br />
          <span>{{ this.medicine.medicineType | capitalize }}</span>
          <br />
      </b-card-text>
    </b-card-body>
    <b-card-footer >
          <b-row>
            <b-col>
              <b-button variant="success" v-on:click="$emit('add-medicine', medicine)">Add</b-button>
            </b-col>
            <b-col>
              <b-button variant="info"  v-on:click="$emit('get-details', medicine)">Details</b-button>
            </b-col>
          </b-row>
    </b-card-footer>
  </b-card>
</template>

<script>
export default {
  props: ["medicine"],
  name: "PrescriptionMedicineCard",
  filters: {
      capitalize(value){
          return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      }
  }
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
