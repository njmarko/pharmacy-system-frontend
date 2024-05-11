<template>
  <b-card
    no-body
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    style="padding: 0.5em"
  >
    <b-card-title class="mb-1">
      {{ this.log.medicineName }}
    </b-card-title>
    <b-card-body class="h-100 d-flex flex-column">
      <b-card-text>
        <strong>Rating:</strong><br />
        <star-rating
          :read-only="true"
          :inline="true"
          :increment="0.01"
          :star-size="20"
          :rating="this.log.medicineAverageGrade"
        />
        / 5
        <hr />
        <p>
          <strong>Time searched: </strong><br />
          <span>{{ this.log.timeSearched | moment("DD.MM.YYYY. HH:mm") }}</span
          ><br />
          <strong>Employee: </strong><br />
          <span
            >{{ this.log.employeeFirstName }}
            {{ this.log.employeeLastName }}</span
          ><br />
        </p>
      </b-card-text>
    </b-card-body>
  </b-card>
</template>

<script>
import StarRating from "vue-star-rating";

export default {
  props: ["log"],
  components: {
    StarRating,
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