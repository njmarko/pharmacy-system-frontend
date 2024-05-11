import ServiceBase from "./ServiceBase";
import axios from 'axios';

class LeaveDaysRequestService extends ServiceBase {
    constructor() {
        super();
    }

    getPendingDermatologistsRequests(page, size) {
        return axios.get(`${this.basePath}/leave-days-requests`, {
            params: {
                page: page,
                size: size
            }
        });
    }

    respondToDermatologistRequestForLeave(id, response) {
        return axios.put(`${this.basePath}/leave-days-requests/${id}`, response);
    }

    createLeaveDaysRequest(employeeId, from, to) {
        return axios.post(`${this.basePath}/leave-days-requests/${employeeId}`, {
            "from" : from,
            "to" : to
        });
    }
}

export default new LeaveDaysRequestService();