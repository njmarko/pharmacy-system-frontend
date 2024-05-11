<template>
  <div>
    <div v-if="reservation.price" id="reservation-window" >
        <br/>
        <div>
            <p>
                <strong>Price:</strong>
                {{ this.reservation.price }} RSD
            </p>
            <p>
                <strong>Reservation date:</strong>
                {{ this.reservation.reservedAt | moment("DD.MM.YYYY. HH.mm A") }}
            </p>
            <p>
                <strong>Reservation deadline:</strong>
                {{ this.reservation.reservationDeadline| moment("DD.MM.YYYY. HH.mm A") }}
            </p>
        </div>
        <hr />
        <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
        <b-col v-bind:class="{ 'col-lg-4 col-md-8 col-sm-12 ml-auto mr-auto': true, first: isFirst(index), last: isLast(index, rowI)}"
          v-bind:lg="cardWidth"
          v-for="(i, index) in slicedItems(rowI)"
          :key="index"
        >
          <ReservationItemCard  
            v-bind:reservationItem="i"
          />
        </b-col>
      </b-row>
      <b-pagination v-if="reservation.itemsDTO.length > numRows * numCols"
        v-model="currentPage"
        :total-rows="reservation.itemsDTO.length"
        :per-page="perPage"
        align="center"
      ></b-pagination>
      <hr/>
      <b-button id="issue-button" class="transition-element" variant="success" v-on:click="$emit('issue-reservation')">Issue reservation</b-button>
      <br/>
    </div>
    <br/>
</div>
</template>

<script>
import ReservationItemCard from "./ReservationItemCard";

export default {
  props: ["reservation"],
  name: "ReservationDetailView",
  components: {
    ReservationItemCard,
  },
  data: function () {
    return {
      numRows: 2,
      numCols: 3,
      currentPage: 1
    };
  },
  methods: {
    isFirst: function (index) {
      return index % this.numCols == 0;
    },
    isLast: function (index, rowI) {
      let items = this.slicedItems(rowI);
      return index == items.length - 1;
    },
    slicedItems: function (rowI) {
      let indexFirst = ((this.currentPage - 1) * 2 + rowI) * this.numCols;
      let indexLast =  ((this.currentPage - 1) * 2 + rowI) * this.numCols  + this.numCols;
      let items = this.reservation.itemsDTO.slice(indexFirst, indexLast);
      return items;
    }
  },
  computed: {
    perPage: function () {
      return this.numRows * this.numCols;
    },
    cardWidth: function () {
      return Math.round(12 / this.numCols);
    }
  },
};
</script>

<style scoped>
.row-spacing {
  margin-left: 2%;
  margin-right: 2%;
}
h1 {
  margin-bottom: 2%;
}
.first {
    margin-left: auto !important;
}
.last {
    margin-right: auto !important;
}
#issue-button {
    transition: 0.5s ease all;
}
#reservation-window {
  background: #eee;
  width: 75%;
  margin: auto;
  border-radius: 1.5em;
  transition: 0.5s ease all;
}
.transition-element:hover {
  box-shadow: #0000005e 0 12px 26px;
  transform: translate(0px, -10px);
}
</style>
