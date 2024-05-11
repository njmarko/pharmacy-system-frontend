<template>
  <b-card
    no-body
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
  >
  <b-card-header>
      <div class="text-center">
        <h3>{{ patientName }}</h3>
      </div>
    </b-card-header>
  <b-card-body class="h-100 d-flex flex-column">
      <b-card-text>
        <p>
          <strong>Category:</strong>
          <br />
            {{ patient.patientCategory.name }}
          <br
          />
          <strong>Points:</strong>
          <br />
            {{ patient.patientCategory.points }}
          <br
          />
        </p>
      </b-card-text>
    </b-card-body>
  </b-card>
  
</template>


<script>

export default {
  props: ["patient"],
  name: "PatientCard",
  computed: {
    patientName: function () {
      return `${this.patient.firstName} ${this.patient.lastName}`;
    },
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
}
</style>
