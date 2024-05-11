<template>
  <div v-if="requestPage.content">
    <div v-if="requestPage.content.length != 0">
      <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
        <b-col
          v-bind:lg="cardWidth"
          sm="12"
          v-for="(request, index) in requestPage.content.slice(
            rowI * numCols,
            rowI * numCols + numCols
          )"
          :key="index"
        >
          <LeaveRequestCard
            v-bind:request="request"
            v-on:accept-request="acceptRequest"
            v-on:reject-request="rejectRequest"
          />
        </b-col>
      </b-row>
      <b-pagination
        v-model="page"
        :total-rows="requestPage.totalElements"
        :per-page="size"
        first-number
        last-number
        align="center"
        v-on:input="fetchRequestPage"
      ></b-pagination>
    </div>
    <h2 v-else>No pending requests found.</h2>
  </div>
  <h2 v-else>No pending requests found.</h2>
</template>

<script>
import { makeToast } from "../../util/makeToast";
import pharmacyService from "../../service/PharmacyService";
import leaveDaysRequestService from "../../service/LeaveDaysRequestService";

import LeaveRequestCard from "./LeaveRequestCard";

export default {
  components: {
    LeaveRequestCard,
  },
  props: {
    viewType: {
      type: String,
      default: "pharmacy-admin",
    },
    numRows: {
      type: Number,
      default: 2,
    },
    numCols: {
      type: Number,
      default: 4,
    },
    pharmacy: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      page: 1,
      requestPage: [],
    };
  },
  mounted() {
    this.fetchRequestPage();
  },
  methods: {
    rejectRequest: function (request, rejectionReason) {
      this.sendRejectRequest(request, rejectionReason)
        .then(() => {
          makeToast(
            this,
            "Request reject",
            "Employees request of leave rejected successfully.",
            "success"
          );
          if (this.requestPage.content.length === 1 && this.page > 1) {
            this.page -= 1;
          }
          this.fetchRequestPage();
        })
        .catch((error) => {
          if (error.response) {
            makeToast(this, "Error", error.response.data.message, "danger");
          }
        });
    },
    acceptRequest: function (request) {
      this.$confirm({
        title: "Accept request for leave",
        message: `Are you sure you want to accept request by ${request.employeeFirstName} ${request.employeeLastName}?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            this.sendAcceptRequest(request)
              .then(() => {
                makeToast(
                  this,
                  "Request accepted",
                  "Employees request of leave accepted successfully.",
                  "success"
                );
                if (this.requestPage.content.length === 1 && this.page > 1) {
                  this.page -= 1;
                }
                this.fetchRequestPage();
              })
              .catch((error) => {
                if (error.response) {
                  makeToast(
                    this,
                    "Error",
                    error.response.data.message,
                    "danger"
                  );
                }
              });
          }
        },
      });
    },
    sendRejectRequest: function (request, reason) {
      if (this.viewType == "sys-admin") {
        return leaveDaysRequestService.respondToDermatologistRequestForLeave(
          request.id,
          { accepted: false, rejectionReason: reason }
        );
      } else {
        return pharmacyService.respondToLeaveRequest(
          this.pharmacy.id,
          request.id,
          {
            accepted: false,
            rejectionReason: reason,
          }
        );
      }
    },
    sendAcceptRequest: function (request) {
      if (this.viewType == "sys-admin") {
        return leaveDaysRequestService.respondToDermatologistRequestForLeave(
          request.id,
          { accepted: true }
        );
      } else {
        return pharmacyService.respondToLeaveRequest(
          this.pharmacy.id,
          request.id,
          {
            accepted: true,
          }
        );
      }
    },
    fetchRequestPage: function () {
      if (this.viewType == "sys-admin") {
        leaveDaysRequestService
          .getPendingDermatologistsRequests(this.page - 1, this.size)
          .then((response) => {
            this.requestPage = response.data;
          });
      } else {
        pharmacyService
          .getPendingPharmacistsLeaveRequestst(
            this.pharmacy.id,
            this.page - 1,
            this.size
          )
          .then((response) => {
            this.requestPage = response.data;
          });
      }
    },
  },
  computed: {
    size: function () {
      return this.numCols * this.numRows;
    },
    cardWidth: function () {
      return Math.round(12 / this.numCols);
    },
  },
};
</script>

<style scoped>
.row-spacing {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>