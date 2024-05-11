<template>
  <b-card
    no-body
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    :title="this.medicine.name"
  >
    <b-card-header>
      <h3>{{medicine.name}}</h3>
    </b-card-header>
    <b-card-body class="h-100 d-flex flex-column">
      <b-card-text>
        <strong>Rating:</strong><br />
        <star-rating
          :read-only="true"
          :inline="true"
          :increment="0.01"
          :star-size="20"
          :rating="this.medicine.medicineAverageGrade"
        />
        / 5
        <hr />
        <p>
          <strong>Type: </strong><br />
          <span>{{ this.medicine.medicineType | capitalize }}</span>
          <br />
          <strong>Purchase info: </strong><br />
          <span>{{ this.medicine.issueOnRecipe | formatOutput }}</span>
          <br />
        </p>
      </b-card-text>
    </b-card-body>
    <b-card-footer>
          <b-button variant="info" @click="redirect">{{buttonText}}</b-button>
    </b-card-footer>
  </b-card>
</template>

<script>
import StarRating from "vue-star-rating";
import { mapGetters } from "vuex";

export default {
  props: ["medicine"],
  name: "MedicineSearchResultCard",
  components: {
    StarRating,
  },
  computed: {
    ...mapGetters(["loggedUser"]),
    buttonText(){
      if(this.loggedUser.jwt){
        if(this.loggedUser.authorities[0] === "ROLE_PATIENT")
          return "Details and reservation";
        else
          return "Details";
      }
      return "Details";
    }
  }
  ,
  filters: {
      capitalize(value){
          return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      },
      formatOutput(value){
        if(value)
          return "Recipe isn't needed";
        else
          return "Recipe is required"
      }
  },
  methods: {
      redirect(){
          this.$router.push({name: "MedicineDetailedView", params: {id: this.medicine.id}})
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
