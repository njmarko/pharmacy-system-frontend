<template>
  <b-card
    v-bind:title="title"
    v-bind:img-src="image"
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    v-on:click="redirect"
    style="padding: 0.5em"
  >
  </b-card>
</template>

<script>
export default {
  props: ["title", "route", "image"],
  name: "PharmacyOptionCard",
  methods: {
    redirect: function () {
      this.$router.push(this.route);
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
  max-height: 169px;
  object-fit: cover;
}
.option-card:hover {
  box-shadow: #0000005e 0 12px 26px;
  cursor: pointer;
  transform: translate(0px, -10px);
}
.option-card {
  transition: 0.5s ease all;
  border-radius: 1.5em;
  background: #eee;
}
</style>
