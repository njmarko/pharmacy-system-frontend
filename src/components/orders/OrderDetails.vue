<template>
  <b-card
    :title="'Order #' + order.id + ' details'"
    tag="article"
    class="mb-2 text-left"
    no-body
  >
    <b-card-title class="ml-2 mt-2">
      <h2 v-if="order.id">
        Order #{{ order.id }} details
        <b-badge v-if="order.orderStatus == 'PROCESSED'" variant="warning"
          >Processed</b-badge
        >
        <b-badge
          v-else-if="order.orderStatus == 'WAITING_FOR_OFFERS'"
          variant="success"
          >Waiting for offers</b-badge
        >
        <b-badge v-else variant="primary">In creation</b-badge>
      </h2>
      <h2 v-else>Create order</h2>
    </b-card-title>
    <b-card-body>
      <b-row align-h="center">
        <b-col lg="6" md="6" xs="12">
          <b-card
            title="General information"
            tag="article"
            class="mb-2 mt-0 text-left info-card"
            no-body
          >
            <b-card-title class="ml-2 mt-2">
              <h2>
                General information
                <b-button
                  v-if="editable"
                  v-b-toggle="['collapse-1', 'collapse-2']"
                  variant="link"
                  class="float-right"
                  ref="phButton"
                  >Edit</b-button
                >
              </h2>
            </b-card-title>
            <b-collapse visible id="collapse-1">
              <b-card-text>
                <b-list-group flush>
                  <b-list-group-item>
                    <strong>Offer due date: </strong
                    ><span v-if="order.dueDate">{{
                      order.dueDate | moment("DD.MM.YYYY. HH:mm")
                    }}</span>
                    <b-badge v-else variant="danger"
                      >No due date selected.</b-badge
                    >
                  </b-list-group-item>
                  <b-list-group-item>
                    <strong># Items: </strong>{{ order.itemCount }}
                  </b-list-group-item>
                  <b-list-group-item>
                    <strong># Offers: </strong>{{ order.offerCount }}
                  </b-list-group-item>
                </b-list-group>
              </b-card-text>
            </b-collapse>
            <b-collapse id="collapse-2">
              <h3>Update due date</h3>
              <hr />
              <div class="mb-2">
                <date-picker
                  type="datetime"
                  :clearable="false"
                  format="DD.MM.YYYY. HH:mm"
                  :disabled-date="disabledBeforeTomorrow"
                  v-model="orderDate"
                ></date-picker>
              </div>
              <b-form-group>
                <b-button
                  variant="primary"
                  class="ml-auto"
                  v-on:click="saveDateChanges"
                  >{{ create ? "Create order" : "Save changes" }}</b-button
                >
                <b-button
                  variant="primary"
                  class="ml-auto float-right"
                  v-on:click="discardDateChanges"
                  >Cancel</b-button
                >
              </b-form-group>
            </b-collapse>
          </b-card>
        </b-col>
        <b-col lg="6" md="6" xs="12">
          <b-card
            title="General information"
            tag="article"
            class="mb-2 text-left info-card"
            no-body
          >
            <b-card-title class="ml-2 mt-2">
              <h2>Contact information</h2>
            </b-card-title>
            <b-card-text>
              <b-list-group flush>
                <b-list-group-item>
                  <strong>Pharmacy: </strong>{{ order.pharmacyName }}
                </b-list-group-item>
                <b-list-group-item>
                  <strong>Pharmacy admin: </strong
                  >{{ order.pharmacyAdminFirstName }}
                  {{ order.pharmacyAdminLastName }}
                </b-list-group-item>
                <b-list-group-item>
                  <strong>Contact email: </strong>{{ order.pharmacyAdminEmail }}
                </b-list-group-item>
              </b-list-group>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-card-body>
    <b-card-footer v-if="canDelete() || canPublish()">
      <b-button
        v-if="canDelete()"
        variant="danger"
        size="sm"
        v-on:click="$emit('delete-order-details', order)"
      >
        Delete order
      </b-button>
      <b-button
        v-if="canPublish()"
        variant="success"
        size="sm"
        v-on:click="$emit('publish-order-details', order)"
      >
        Publish order
      </b-button>
    </b-card-footer>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";
import { makeToast } from "../../util/makeToast";
import { getISODateTimeString } from "../../util/dateUtil";
import pharmacyService from "../../service/PharmacyService";

import DatePicker from "vue2-datepicker";

export default {
  props: {
    order: {
      Type: Object,
      required: true,
    },
    pharmacy: {
      Type: Object,
      required: true,
    },
    editable: {
      Type: Boolean,
      default: false,
    },
    create: {
      Type: Boolean,
      default: false,
    },
  },
  components: {
    DatePicker,
  },
  data() {
    return {
      orderDate: this.getNextWeek(),
    };
  },
  mounted() {
    if (this.order.dueDate) {
      this.orderDate = new Date(this.order.dueDate);
    }
  },
  methods: {
    saveDateChanges: function () {
      this.$refs.phButton.click();
      if (this.create) {
        this.order.dueDate = getISODateTimeString(this.orderDate);
        this.$emit("create-order-details");
      } else {
        pharmacyService
          .updateOrder(this.pharmacy.id, this.order.id, {
            dueDate: getISODateTimeString(this.orderDate),
          })
          .then((response) => {
            this.order.dueDate = response.data.dueDate;
          })
          .catch((error) => {
            if (error.response)
              makeToast(this, "Error", error.response.data.message, "danger");
            this.orderDate = new Date(this.order.dueDate);
          });
      }
    },
    discardDateChanges: function () {
      if (this.order.dueDate) {
        this.orderDate = new Date(this.order.dueDate);
      } else {
        this.orderDate = this.getNextWeek();
      }
      this.$refs.phButton.click();
    },
    getNextWeek: function () {
      const today = new Date();
      today.setDate(today.getDate() + 7);
      return today;
    },
    canDelete: function () {
      return (
        (this.order.orderStatus == "WAITING_FOR_OFFERS" ||
          this.order.orderStatus == "IN_CREATION") &&
        this.order.pharmacyAdminId == this.loggedUser.id && (this.order.offerCount == 0)
      );
    },
    canSave: function () {
      return (
        this.order.orderStatus == undefined &&
        this.order.dueDate != null &&
        this.order.pharmacyAdminId == this.loggedUser.id
      );
    },
    canPublish: function () {
      return (
        this.order.orderStatus == "IN_CREATION" &&
        this.order.pharmacyAdminId == this.loggedUser.id
      );
    },
    disabledBeforeTomorrow: function (date) {
      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return date < tomorrow;
    },
  },
  computed: {
    ...mapGetters(["loggedUser"]),
  },
};
</script>

<style scoped>
.info-card {
  border: none;
}
</style>