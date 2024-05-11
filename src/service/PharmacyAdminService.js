import axios from "axios";
import ServiceBase from "./ServiceBase";


class PharmacyAdminService extends ServiceBase {
    constructor() {
        super();
    }

    getMyPharmacy(id) {
        return axios.get(`${this.basePath}/pharmacy-admins/${id}/pharmacy`);
    }

    registerPharmacyAdmin(payload) {
        return axios.post(`${this.basePath}/pharmacy-admins`, payload);
    }

    updateProfileInfo(id, payload) {
        return axios.put(`${this.basePath}/pharmacy-admins/${id}`, payload);
    }
}

export default new PharmacyAdminService();