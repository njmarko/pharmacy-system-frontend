import ServiceBase from "./ServiceBase";
import axios from 'axios';

class OfferService extends ServiceBase {
    constructor() {
      super();
    }

    getOffers(supplierId, status){
        return axios.get(`${this.basePath}/suppliers/${supplierId}/offers`, {
            params: {
                status: status
            }
        })
    }
}

export default new OfferService();