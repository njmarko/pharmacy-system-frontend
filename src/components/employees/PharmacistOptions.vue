<template>
  <div>
    <b-row class="align-self-md-stretch mb-2">
      <b-card-group deck class>
        <b-col class="col-lg-4 col-md-6 col-sm-12">
          <PharmacyOptionCard
            title="List of examined patients"
            :route="{ name: 'ExaminedPatientsView' }"
            image="https://image.freepik.com/free-photo/doctor-examines-patient-medicine-health-care-concept_1328-3126.jpg"
          />
        </b-col>
        <b-col class="col-lg-4 col-md-6 col-sm-12">
          <PharmacyOptionCard
            title="Start examination"
            :route="{ name: 'AppointmentStartView' }"
            image="https://previews.123rf.com/images/morganka/morganka1511/morganka151100045/47974340-portrait-of-beautiful-female-doctor-holding-stethoscope-head-ready-to-examine-patient-focus-on-eyes-.jpg"
          />
        </b-col>
        <b-col class="col-lg-4 col-md-6 col-sm-12">
          <PharmacyOptionCard 
            title="Working calendar"
            :route="{ name: 'WorkingCalendarView' }"
            image="https://img.freepik.com/free-vector/business-man-working-desk-planning-schedule-task-board-planner-calendar-whiteboard_284092-1633.jpg?size=626&ext=jpg"
          />
        </b-col>
        <b-col class="col-lg-5 col-md-6 col-sm-12 ml-auto mr-auto">
          <PharmacyOptionCard
            title="Create request for leave"
            :route="{ name: 'EmployeeLeaveDaysRequestView' }"
            image="https://s17026.pcdn.co/wp-content/uploads/sites/9/2016/06/1-1057.jpg"
          />
        </b-col>
        <b-col class="col-lg-5 col-md-6 col-sm-12 ml-auto mr-auto">
          <PharmacyOptionCard 
            title="Issue medicine"
            :route="{ name: 'ReservationsView' }"
            image="https://media.npr.org/assets/img/2016/03/16/prescribing-drugs_custom-012d8e1dabbc7bb1b559c45ded917c81524c13d1.jpg"
          />
        </b-col>
      <br/>
     </b-card-group>
    </b-row>
  </div>
</template>

<script>
import PharmacyOptionCard from "../pharmacy/PharmacyOptionCard";

export default {
  name: "PharmacistOptions",
  components: {
    PharmacyOptionCard,
  },
};
</script>

<style scoped></style>
