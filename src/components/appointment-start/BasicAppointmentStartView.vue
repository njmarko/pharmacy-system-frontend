<template>
  <div v-if="appointment">
    <h1> Appointment </h1> 
    <span style="font-size:110%;"> {{ appointment.dateFrom | moment("HH.mm A") }}  - {{ appointment.dateTo| moment("HH.mm A") }} </span>
    <b-row class="mb-3" style="margin-top:1%">
      <b-col md="6">
        <div>
            <strong style="font-size:150%;">Patient: </strong> <span style="font-size:150%;">{{appointment.patientFirstName}} {{appointment.patientLastName}}</span>
        </div>
      </b-col>
      <b-col md="6">
        <div>
            <strong style="font-size:150%;">Pharmacy: </strong> <span style="font-size:150%;">{{appointment.pharmacyName}}</span>
        </div>
      </b-col>
    </b-row>
    <hr style="width:80%; margin:auto"/>
    <b-row v-if="!appointmentStarted" class="mb-3" style="margin-top:3%">
    <b-button
          variant="danger"
          v-on:click="patientNotShowedUp"
          id="not-showed"
          >Patient absent
    </b-button>
    <b-button 
          variant="primary"
          v-on:click="appointmentStarted = true"
          id="begin"
          >Begin appointment
    </b-button>
    </b-row>
    <div v-if="appointmentStarted">
      <br/>
      <b-row >
        <b-col class="col-lg-6 col-md-6 col-sm-12 col-12 text-center">
          <b-button
            variant="primary"
            v-b-toggle.collapse-1
              v-b-tooltip.hover
            title="Prescribe medicine"
          ><b-icon-plus-circle-fill></b-icon-plus-circle-fill>
          </b-button>
          <b-button style="margin-left:1%"
            v-if="!employeeAppointmentScheduled"
            variant="primary"
            v-b-tooltip.hover
            title="Schedule appointment"
            v-on:click="showAppointmentModal"
          ><b-icon-calendar-plus-fill></b-icon-calendar-plus-fill>
          </b-button>
        </b-col>
        <b-col class="col-lg-6 col-md-6 col-sm-12 col-12 text-center">
          <b-button 
            v-on:click="validateData"
            :disabled="reportText === ''"
            variant="primary"
            >Conclude appointment
          </b-button>
        </b-col>
        </b-row>

      <v-row style="margin-top:1%; width:90%; margin-left:auto; margin-right:auto;">
        <v-col class="col-lg-3 col-md-3 col-sm-12 col-12">
            <div style="text-align:center;"><h5><strong>Enter your findings:</strong></h5> </div>
        </v-col>
        <v-col class="col-lg-9 col-md-9 col-sm-12 col-12">
        <v-textarea 
          outlined
          no-resize
          clearable
          background-color="amber lighten-5"
          spellcheck=false
          clear-icon="mdi-close-circle"
          label="Your report"
          :rules="reportRules"
          v-model="reportText"
        ></v-textarea>
        </v-col>
      </v-row>

      <b-collapse id="collapse-1" class="mt-2">
        <hr style="width:90%; margin:auto"/>
        <div style="margin-top:2%"><h4><strong>Chosen medicines</strong></h4></div>
        <b-row class="row-spacing" v-for="(row, rowI) in chosenNumRows" :key="rowI">
          <b-col class='col-lg-6 col-md-8 col-sm-12 col-12 ml-auto mr-auto'
          v-for="chosen in slicedItems(rowI)"
          :key="chosen.medicine.id"
        >
            <ChosenMedicineCard 
             :chosenMedicine="chosen" 
             v-on:get-details="displayMedicine"
             v-on:remove-chosen="removeChosenMedicine" />
        </b-col>
        </b-row>
        <b-pagination v-if="chosenMedicines.length > chosenNumRows * chosenNumCols"
        v-model="chosenCurrentPage"
        :total-rows="chosenMedicines.length"
        :per-page="chosenNumRows * chosenNumCols"
        align="center"
        ></b-pagination>
        <div style="margin-top:4%">
             <b-tabs content-class="mt-3" fill>
              <b-tab title="Available medicines" :active="openTab === 'firstTab'" v-if="medicinesPage">
                <b-row class="mb-3 mt-2 ml-5">
                  <b-col md="10">
                    <b-form inline v-on:submit.prevent="searchMedicines">
                      <div class="form-label-group">
                        <b-form-input
                          v-model="medicineName"
                          class="mr-2"
                          placeholder="Medicine name"
                          id="presc-medicine-input"
                          trim
                        />
                        <label for="presc-medicine-input">Medicine name</label>
                      </div>
                      <b-button type="submut" variant="primary">
                        <b-icon-search></b-icon-search> Search</b-button
                      >
                    </b-form>
                  </b-col>
                </b-row>
                <b-row class="row-spacing " v-for="(row, rowI) in numRows" :key="rowI">
                  <b-col class="col-lg-4 col-md-6 col-sm-12 col-12"
                    v-bind:lg="cardWidth"
                    v-for="(m, index) in medicinesPage.content.slice(
                      rowI * numCols,
                      rowI * numCols + numCols
                    )"
                    :key="index"
                  >
                    <PrescriptionMedicineCard
                      :medicine="m"
                      :key="m.id"
                      v-on:get-details="displayMedicine"
                      v-on:add-medicine="addMedicine"
                    />
                  </b-col>
                </b-row>
                <b-pagination v-if="medicinesPage.content.length != 0" 
                  v-model="pageAllMedicines"
                  :total-rows="medicinesPage.totalElements"
                  :per-page="size"
                  v-on:input="fetchMedicinesPage"
                  first-number
                  last-number
                  align="center"
                ></b-pagination>
                <span v-else><h4><strong>NO MEDICINE FOUND</strong></h4></span>
              </b-tab>
              <b-tab title="Replacement medicines" :active="openTab === 'secondTab'" v-if="replacementMedicines">
                <b-row class="mb-3 mt-2 ml-5">
                  <b-col md="10">
                    <b-form  inline v-on:submit.prevent="searchReplacementMedicines">
                      <div class="form-label-group">
                        <b-form-input
                          v-model="medicineName"
                          class="mr-2"
                          placeholder="Medicine name"
                          id="repl-medicine-input"
                          trim
                        />
                        <label for="repl-medicine-input">Medicine name</label>
                      </div>
                      <b-button type="submut" variant="primary">
                        <b-icon-search></b-icon-search> Search</b-button
                      >
                    </b-form>
                  </b-col>
                </b-row>
                <b-row class="row-spacing " v-for="(row, rowI) in numRows" :key="rowI">
                  <b-col class="col-lg-4 col-md-6 col-sm-12 col-12"
                    v-bind:lg="cardWidth"
                    v-for="(m, index) in replacementMedicines.content.slice(
                      rowI * numCols,
                      rowI * numCols + numCols
                    )"
                    :key="index"
                  >
                    <PrescriptionMedicineCard
                      :medicine="m"
                      :key="m.id"
                      v-on:get-details="displayMedicine"
                      v-on:add-medicine="addMedicine"
                    />
                  </b-col>
                </b-row>
                <b-pagination v-if="replacementMedicines.content.length != 0" 
                  v-model="pageReplacementMedicines"
                  :total-rows="replacementMedicines.totalElements"
                  :per-page="size"
                  v-on:input="fetchReplacementMedicinesPage"
                  first-number
                  last-number
                  align="center"
                ></b-pagination>
                <span v-else><h4><strong>NO MEDICINE FOUND</strong></h4></span>
              </b-tab>
            </b-tabs>
       </div>
      </b-collapse>
    <br/>
    <MedicineDetailsModal
      ref="medicineDetailsModal"
      :medicineToDisplay = "medicineToDisplay"
    />

    <MedicineTherapyDefiningModal
      ref="medicineDefiningModal"
      :medicineToDefine = "medicineToDefine"
      v-on:medicine-added="addMedicineToList"
      />

    <AppointmentScheduleModal
      ref="appointmentScheduleModal"
      :patientId="appointment.patientId"
      :pharmacyId="appointment.pharmacyId"
      v-on:succ-scheduled="hideScheduling"
      />
    </div>

    <AvailableAppointmentsModal
      ref="availableAppointmentsModal"
      :patientId="appointment.patientId"
      :pharmacyId="appointment.pharmacyId"
      v-on:appointment-chosen="appointmentChosen"
    />

    <b-modal ref="chooseSchedulingOption"
      header-bg-variant="dark"
      header-text-variant="light"
      ok-only ok-variant="secondary" ok-title="Cancel">
      <template #modal-header>
         <div class="mx-auto">
          <h4>Choose option</h4>
         </div>
      </template>
      <b-button class="mt-3" variant="outline-primary" block v-on:click="showCreationAppointmentModal" >Create new appointment</b-button>
      <b-button class="mt-2" variant="outline-primary" block v-on:click="showAvailableAppointments">Choose from available appointments</b-button>
    </b-modal>
  </div>
  <h1 v-else>No appointments in progress.</h1>
</template>

<script>
import appointmentService from "../../service/AppointmentService"
import PrescriptionMedicineCard from './PrescriptionMedicineCard'
import ChosenMedicineCard from "./ChosenMedicineCard"
import medicineService from "../../service/MedicineService"

import MedicineDetailsModal from "./MedicineDetailsModal"
import MedicineTherapyDefiningModal from "./MedicineTherapyDefiningModal"
import AppointmentScheduleModal from "./AppointmentScheduleModal"
import AvailableAppointmentsModal from "./AvailableAppointmentsModal"

import { mapGetters } from 'vuex'
import { mapActions } from "vuex";
import { makeToast } from "@/util/makeToast";

export default {
  name: "BasicAppointmentStartView",
  components: {
    PrescriptionMedicineCard,
    MedicineDetailsModal,
    MedicineTherapyDefiningModal,
    ChosenMedicineCard,
    AppointmentScheduleModal,
    AvailableAppointmentsModal
  },
  data: function () {
    return {
      appointment: null,
      appointmentStarted: false,
      reportText: null,
      chosenMedicines: [],
      medicineToDisplay: null,
      medicineToReplace: null,
      medicineName: '',
      chosenMedicineIds: [],
      medicinesPage: null,
      replacementMedicines: null,
      searchInProgress: false,
      medicineToDefine: null,
      openTab: 'firstTab',
      numRows: 1,
      numCols: 3,
      pageAllMedicines: 1,
      pageReplacementMedicines: 1,
      reportRules: [
        v => v !== '' || 'Empty field!'
      ],
      chosenNumRows: 1,
      chosenNumCols: 2,
      chosenCurrentPage: 1,
    };
  },
  mounted() {
    this.reportText = "No notes.";
    this.fetchAppointmentInProgress();
  },
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
     ...mapActions(["setEmployeeAppointmentScheduled"]),
    hideScheduling() {
      this.setEmployeeAppointmentScheduled(true);
      this.$refs.chooseSchedulingOption.hide();
    },
    showAvailableAppointments() {
      this.$refs.chooseSchedulingOption.hide();
      this.$refs.availableAppointmentsModal.show();
    },
    appointmentChosen(appointmentId) {
      appointmentService.scheduleAvailableDermatologistAppointment(this.loggedUser.id, appointmentId, this.appointment.patientId,
      this.appointment.pharmacyId).then(() => {
          makeToast(this, "Success", "Appointment successfully scheduled!", "success");
          this.setEmployeeAppointmentScheduled(true);
      }).catch((error) => {
          makeToast(this, "Error", error.response.data.message, "danger");
      });
    },
    showAppointmentModal() {
      if (this.userRole === "Pharmacist") {
        this.showCreationAppointmentModal();
      }
      else {
        this.$refs.chooseSchedulingOption.show();
      }
    },
    showCreationAppointmentModal() {
      this.$refs.chooseSchedulingOption.hide();
      this.$refs.appointmentScheduleModal.show();
    },
    fetchMedicinesPage() {
      medicineService.getAllMedicinesForPrescription(this.loggedUser.id, this.appointment.pharmacyId,  this.appointment.patientId,
      this.medicineName, this.chosenMedicineIds, this.pageAllMedicines - 1, this.size).then((response) => {
        this.medicinesPage = response.data;
      })
    },
    fetchReplacementMedicinesPage() {
      medicineService.getReplacementsForMedicine(this.loggedUser.id, this.appointment.pharmacyId, this.medicineToReplace.id,
       this.appointment.patientId, this.medicineName, this.appointment.id,  this.chosenMedicineIds, this.pageReplacementMedicines - 1, this.size).then((response) => {
        if (this.searchInProgress || !response.data.empty) {
          this.replacementMedicines = response.data;
          this.openTab = 'secondTab';
        }
        this.searchInProgress = false;
      })
    },
    slicedItems(rowI) {
      let indexFirst = ((this.chosenCurrentPage - 1) + rowI) * this.chosenNumCols;
      let indexLast =  ((this.chosenCurrentPage - 1) + rowI) * this.chosenNumCols  + this.chosenNumCols;
      let items = this.chosenMedicines.slice(indexFirst, indexLast);
      return items;
    },
    searchMedicines() {
      this.pageAllMedicines = 1;
      this.fetchMedicinesPage();
    },
    searchReplacementMedicines() {
      this.pageReplacementMedicines = 1;
      this.searchInProgress = true;
      this.fetchReplacementMedicinesPage();
    },
    fetchAppointmentInProgress() {
        appointmentService.getAppointmentInProgress(this.loggedUser.id).then((response) => {
            this.appointment = response.data;
            this.fetchMedicinesPage();
        })
        .catch(() => {
            this.appointment = null;
        });
    },
    patientNotShowedUp() {
        this.$confirm({
        title: "Patient absent",
        message: `Are you sure you want to do this aciton (patient will receive 1 penalty point)?`,
        button: {
            no: "No",
            yes: "Yes",
        },
        callback: (confirm) => {
            if (confirm) {
                appointmentService.patientNotShowedUp(this.loggedUser.id, this.appointment.patientId, this.appointment.id).then(() => {
                    makeToast(this, "Success", "Patient successfully punished with 1 penalty point!", "success");
                    this.appointment = null;
                })
                .catch(() => {
                    makeToast(this, "Error",  "Error while punishing patient!", "danger");
                    this.appointment = null;
                });
            }
        }});
    },
    displayMedicine(medicine) {
      this.medicineToDisplay = medicine;
      this.$refs.medicineDetailsModal.show();
    },
    removeChosenMedicine(chosenMedicine) {
      let index =  this.chosenMedicineIds.indexOf(chosenMedicine.medicine.id);
      if (index > -1) {
        this.chosenMedicineIds.splice(index, 1);
      }

      let chosenIndex = this.chosenMedicines.indexOf(chosenMedicine);
      if (chosenIndex > -1) {
        this.chosenMedicines.splice(chosenIndex, 1);
      }
      this.fetchMedicinesPage();
    },
    addMedicine(medicine) {
      medicineService.checkIfMedicineIsInStock(this.loggedUser.id, this.appointment.pharmacyId, medicine.id, this.appointment.id)
      .then((response) => {
        if (response.data === true) {
          this.medicineToDefine = medicine;
          this.$refs.medicineDefiningModal.show();
        }
        else {
          makeToast(this, "Not in stock", "Requested medicine is not in stock!", "danger");
          this.chosenMedicineIds.push(medicine.id);
          this.medicineToReplace = medicine;
          this.fetchMedicinesPage();
          this.fetchReplacementMedicinesPage();
        }
      })
    },
    addMedicineToList(medicine, quantity, therapyDays) {
      makeToast(this, "Success", "Medicine succesfully added!", "success");
      this.chosenMedicines.push(
        {medicine : medicine,
        quantity: quantity,
        therapyDays: therapyDays
        });
      this.chosenMedicineIds.push(medicine.id);
      this.pageAllMedicines = 1;
      this.fetchMedicinesPage();
      this.replacementMedicines = null;
    },
    validateData() {
      this.$confirm({
          title: "Conclude appointment",
          message: `Are you sure you want to conclude appointment?`,
          button: {
            no: "No",
            yes: "Yes",
          },
          callback: (confirm) => {
            if (confirm) {
              let medicinesToSend = [];
              this.chosenMedicines.forEach(chosen => {
                medicinesToSend.push({
                  medicineStockId: chosen.medicine.id,
                  therapyDays: chosen.therapyDays,
                  quantity: chosen.quantity
                });
              });

              appointmentService.concludeAppointment(this.loggedUser.id, this.reportText, this.appointment.pharmacyId, this.appointment.patientId, this.appointment.id, medicinesToSend).then(() => {
                this.setEmployeeAppointmentScheduled(false);
                this.$router.push({ name: "Home" }).catch(() => {});
              }).catch((error) => {
                  makeToast(this, "Error", error.response.data.message, "danger");
                  this.chosenMedicines = [];
                  this.chosenMedicineIds = [];
                  this.replacementMedicines = null;
                  this.pageAllMedicines = 1;
                  this.fetchMedicinesPage();
              });
            }
            },
      });
    }
  },
  computed: {  
     ...mapGetters(["loggedUser", "userRole", "employeeAppointmentScheduled"]),
     size: function () {
      return this.numCols * this.numRows;
    },
    cardWidth: function () {
      return Math.round(12 / this.numCols);
    },
  }
};
</script>

<style scoped>
#not-showed{
    margin-left: auto;
    margin-right: 6%;
}

#begin{
    margin-right: auto;
}

/deep/ .centered-input input{
  text-align: center;
}
</style>
