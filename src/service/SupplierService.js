import axios from "axios";
import ServiceBase from "./ServiceBase";

class SupplierService extends ServiceBase {
    constructor() {
        super();
    }

    registerSupplier(payload){
        return axios.post(`${this.basePath}/suppliers`, payload);
    }

    updateOffer(supplierId, offerId, payload){
        return axios.put(`${this.basePath}/suppliers/${supplierId}/offers/${offerId}`, payload);
    }

    updateProfileInfo(id, payload) {
        return axios.put(`${this.basePath}/suppliers/${id}`, payload);
    }

    getDetails(id){
        return axios.get(`${this.basePath}/suppliers/${id}`);
    }
    
}

export default new SupplierService();