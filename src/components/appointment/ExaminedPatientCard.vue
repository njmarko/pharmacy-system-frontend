<template>
  <b-card
    no-body
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    :title="patientName"
  >
    <b-card-header>
      <h3>{{patientName}}</h3>
      <h5>{{ examinedPatient.from | moment("DD.MM.YYYY.") }} </h5>
    </b-card-header>
    <b-card-body class="h-100 d-flex flex-column">
      <b-card-text>
          <strong>Time: </strong><br />
          <span>{{ examinedPatient.from | moment("HH.mm A") }} 
              - {{ examinedPatient.to | moment("HH.mm A") }}
          </span>
          <br />
          <strong>Price: </strong><br />
          <span>{{ examinedPatient.price }} RSD</span>
          <br />
          <hr />
            <strong>Report: </strong><br />
           <b-form-textarea
              id="textarea"
              v-model="examinedPatient.diagnostics"
              :disabled="true"
              no-resize
              rows="4"
              max-rows="4"
            ></b-form-textarea>
      </b-card-text>
    </b-card-body>
    <b-card-footer>
          <b-button variant="info" v-on:click="openDetails" >Details</b-button>
    </b-card-footer>
  </b-card>
</template>


<script>

export default {
  props: ["examinedPatient"],
  name: "ExaminedPatientCard",
  methods: {
      openDetails() {
          this.$emit('open-details', this.examinedPatient);
      }
  },
  computed: {
    patientName () {
        return `${this.examinedPatient.patientFirstName} ${this.examinedPatient.patientLastName}`;
    },
    appointmentTime () {
        return `${this.examinedPatient.from} - ${this.examinedPatient.to}`;
    }
  },
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
