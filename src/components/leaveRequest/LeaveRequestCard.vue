<template>
  <b-card
    img-top
    title-variant="card-title"
    class="mb-2 h-100 option-card"
    :title="employeeName"
    no-body
  >
    <b-card-header class="mb-1">
      <h3>{{ employeeName }}</h3>
    </b-card-header>
    <b-card-body>
      <b-card-text>
        <p>
          <strong>Leave period: </strong><br />
          {{ request.from | moment("DD.MM.YYYY.") }} -
          {{ request.to | moment("DD.MM.YYYY.") }}<br />
        </p>
      </b-card-text>
    </b-card-body>
    <b-card-footer>
      <b-button-group>
        <b-button
          variant="success"
          v-b-tooltip.hover
          title="Accept request"
          v-on:click="$emit('accept-request', request)"
        >
          <b-icon-calendar-check-fill></b-icon-calendar-check-fill>
        </b-button>
        <b-button
          variant="danger"
          v-b-tooltip.hover
          title="Reject request"
          v-on:click="rejectRequest"
        >
          <b-icon-calendar-minus-fill></b-icon-calendar-minus-fill>
        </b-button>
      </b-button-group>
    </b-card-footer>
    <b-modal
      :id="'rejection-modal-' + request.id"
      :title="'Reject request from ' + employeeName"
      hide-footer
      header-text-variant="light"
      header-bg-variant="primary"
    >
      <h4>Time period</h4>
      <h6>
        {{ request.from | moment("DD.MM.YYYY.") }} -
        {{ request.to | moment("DD.MM.YYYY.") }}<br />
      </h6>
      <hr />
      <h4>Rejection</h4>
      <b-form v-on:submit.prevent="reject">
        <b-row>
          <b-col lg="12" xs="12">
            <div class="form-label-group">
              <b-form-input
                placeholder="Enter rejection reason"
                v-model="rejectionReason"
                trim
                autofocus
                required
                :state="rejectionReason != ''"
                id="rejection-input"
              />
              <label for="rejection-input">Enter rejection reason</label>
            </div>
          </b-col>
        </b-row>
        <b-button class="mt-3" block type="submit" variant="danger"
          >Reject request</b-button
        >
      </b-form>
      <b-button class="mt-3" v-on:click="hideModal" block variant="primary"
        >Close</b-button
      >
    </b-modal>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["request"],
  data() {
    return {
      rejectionReason: "",
    };
  },
  methods: {
    hideModal: function () {
      this.$bvModal.hide("rejection-modal-" + this.request.id);
    },
    rejectRequest: function () {
      this.$bvModal.show("rejection-modal-" + this.request.id);
    },
    reject: function() {
      this.$bvModal.hide("rejection-modal-" + this.request.id);
      this.$emit('reject-request', this.request, this.rejectionReason);
    }
  },
  computed: {
    ...mapGetters(["userRole"]),
    employeeName: function () {
      return `${this.request.employeeFirstName} ${this.request.employeeLastName}`;
    },
  },
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
