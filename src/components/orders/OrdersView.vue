<template>
  <b-container class="order-container">
    <h1>Orders</h1>
    <div v-if="pageOrders">
    <b-container>
      <b-row class="row-spacing" v-for="(row, rowI) in numRows" :key="rowI">
        <b-col
          v-bind:lg="cardWidth"
          sm="12"
          v-for="(order, index) in pageOrders.content.slice(
            rowI * numCols,
            rowI * numCols + numCols
          )"
          :key="index"
        >
          
          <OrderCard :order="order" :key="order.id">
          </OrderCard>
        </b-col>
      </b-row>
    </b-container>
      <h1 v-if="pageOrders.empty">No orders found.</h1>
      <b-pagination
        v-model="page"
        :total-rows="pageOrders.totalElements"
        :per-page="size"
        first-number
        last-number
        align="center"
        v-on:input="load"
      ></b-pagination>
    </div>
    <h1 v-else>No orders found.</h1>
  </b-container>
</template>

<script>
import OrderCard from "../orders/OrderCard"
import orderService from "../../service/OrderService"

export default {
    name: "OrdersView",
    components: {
        OrderCard
    },
    data() {
        return{
            page: 1,
            cardWidth: 3,
            pageOrders: null,
            size: 8,
            numRows: 3,
            numCols: 4
        }
        

    },
    mounted(){
        this.load();
    }
    ,
    methods: {
        load(){
            orderService.getAllOrders(this.page - 1, this.size)
                .then(response=>{
                    this.pageOrders = response.data;
                })

        }
    }


}
</script>

<style scoped>
.row-spacing {
     margin-top: 15px;
    margin-bottom: 15px;
}

.order-container{
    background: white;
}
</style>