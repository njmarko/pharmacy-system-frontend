//Put back picture
// v-bind:img-src="image"
<template>
  <b-card
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    :title="this.employeeName"
    no-body
  >
    <b-card-title class="mb-1">
      {{ this.employeeName }}
    </b-card-title>
    <b-card-body class="h-100 mb-0 p-0 d-flex flex-column">
      <b-card-text>
        <strong>Rating:</strong><br />
        <star-rating
          :read-only="true"
          :inline="true"
          :increment="0.01"
          :star-size="20"
          :rating="this.employee.employeeAverageGrade"
        />
        / 5
        <hr />
        <p>
          <strong>Works at:</strong><br />
          <span v-for="e in employee.pharmacyNames" :key="e"
            >{{ e }}<br
          /></span>
        </p>
      </b-card-text>
    </b-card-body>
    <b-card-footer>
      <b-button-group>
        <b-button
          variant="danger"
          v-b-tooltip.hover
          title="Fire employee"
          v-on:click="$emit('fire-employee', employee)"
          ><b-icon-person-dash-fill></b-icon-person-dash-fill
        ></b-button>
      </b-button-group>
    </b-card-footer>
  </b-card>
</template>

<script>
import StarRating from "vue-star-rating";

export default {
  props: ["employee", "image", "onDelete"],
  name: "EmployeeCard",
  components: {
    StarRating,
  },
  computed: {
    employeeName: function () {
      return `${this.employee.firstName}  ${this.employee.lastName}`;
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
