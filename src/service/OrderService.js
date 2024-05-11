import ServiceBase from "./ServiceBase";
import axios from 'axios';


class OrderService extends ServiceBase {
    constructor() {
      super();
    }

    getAllOrders(page, size){
        return axios.get(`${this.basePath}/orders`, {
            params: {
                page: page,
                size: size,
                sort: "dueDate"
            }
        })
    }

    getOrderDetails(id){
        return axios.get(`${this.basePath}/orders/${id}`);
    }

    createOfferForOffer(orderId, payload){
        return axios.post(`${this.basePath}/orders/${orderId}/offers`, payload);
    }

}

export default new OrderService();