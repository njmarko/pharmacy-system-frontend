import axios from "axios";
import ServiceBase from "./ServiceBase";

class ReservationService extends ServiceBase {
    constructor() {
        super();
    }

    getReservation(id) {
        return axios.get(`${this.basePath}/medicine-reservations/` + id);
    }

    issueReservation(id) {
        return axios.put(`${this.basePath}/medicine-reservations/issue/` + id);
    }

    getAllForPatient(patientId, reservationId, page, size, sortCriteria, sortDirection) {
        let sortcrit = "";
        if (sortCriteria) {
            if (!sortDirection) {
                sortDirection = "asc";
            }
            sortcrit = [sortCriteria, sortDirection].join();
        }
        return axios.get(`${this.basePath}/patients/` + patientId + `/medicine-reservations`,
            { params: { reservationId: reservationId, page: page, size: size, sort: sortcrit } });
    }

    getAllIssuedForPatient(patientId, reservationId, page, size, sortCriteria, sortDirection) {
        let sortcrit = "";
        if (sortCriteria) {
            if (!sortDirection) {
                sortDirection = "asc";
            }
            sortcrit = [sortCriteria, sortDirection].join();
        }
        return axios.get(`${this.basePath}/patients/${patientId}/issued-medicine-reservations`,
            { params: { reservationId: reservationId, page: page, size: size, sort: sortcrit } });
    }

    cancelReservation(patientId, reservationId) {
        return axios.put(`${this.basePath}/patients/` + patientId + `/medicine-reservations/` + reservationId + "/cancel");
    }
}

export default new ReservationService();