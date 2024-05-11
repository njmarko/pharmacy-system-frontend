<template>
  <b-card
    title-variant="card-title"
    tag="article"
    class="mb-2 h-100 link-card"
    style="padding: 0.5em"
    no-body
  >
    <b-card-title>
      {{ medicine.name }}
    </b-card-title>
    <hr />
    <b-card-body class="pt-0 pb-0 h-100 d-flex flex-column">
      <b-card-text>
        <p>
          <strong>Type: </strong><span>{{ medicine.medicineType }}</span
          ><br />
        </p>
        <hr />
        <p>
          <strong>Composition: </strong
          ><span>{{ medicine.medicineComposition }}</span
          ><br />
        </p>
        <hr />
        <p>
          <strong>Manufacturer: </strong>
          <span>{{ medicine.medicineManufacturer }}</span
          ><br />
        </p>
      </b-card-text>
    </b-card-body>
    <b-card-footer>
      <b-button-group>
        <b-button
          v-if="cardType == `allergy`"
          variant="danger"
          v-b-tooltip.hover
          title="Remove Allergy"
          v-on:click="$emit('remove-allergy', medicine)"
          ><b-icon-dash-circle-fill></b-icon-dash-circle-fill
        ></b-button>
        <b-button
          v-else
          variant="success"
          v-b-tooltip.hover
          title="Add Allergy"
          v-on:click="$emit('add-allergy', medicine)"
          ><b-icon-plus-circle-fill></b-icon-plus-circle-fill
        ></b-button>
      </b-button-group>
    </b-card-footer>
  </b-card>
</template>

<script>
export default {
  name: "AllergyCard",
  props: ["medicine", "cardType"],
  data: function () {
    return {};
  },
  methods: {
    sendSignal: function () {
      if (this.cardType == "allergy") {
        this.$emit("remove-allergy", this.medicine);
      } else {
        this.$emit("add-allergy", this.medicine);
      }
    },
  },
};
</script>
<style scoped>
.card-title {
  color: #002664;
}
.link-card:hover {
  box-shadow: #0000005e 0 12px 26px;
  transform: translate(0px, -10px);
  /* cursor: pointer; */
}
.link-card {
  transition: 0.5s ease all;
  border-radius: 1.5em;
  background: #eee;
}

p,
h4 {
  margin-bottom: 0px;
}
</style>

