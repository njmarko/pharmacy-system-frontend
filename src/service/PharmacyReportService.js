import ServiceBase from "./ServiceBase";
import axios from 'axios';

class PharmacyReportService extends ServiceBase {
    constructor() {
        super();
    }

    getMedicinePurchaseReport(pharmacyId, medicineIds, from, to, type) {
        return axios.get(`${this.basePath}/pharmacies/${pharmacyId}/purchased-medicines`, {
            params: {
                medicineIds: medicineIds.join(','),
                from: from,
                to: to,
                type: type
            }
        });
    }

    getBarchartData(pharmacyId, from, to, type) {
        return axios.get(`${this.basePath}/pharmacies/${pharmacyId}/purchased-medicines/barchart`, {
            params: {
                from: from,
                to: to,
                type: type
            }
        });
    }

    getAppointmentLineChart(pharmacyId, from, to, type, employeeTypes) {
        return axios.get(`${this.basePath}/pharmacies/${pharmacyId}/appointments-report`, {
            params: {
                from: from,
                to: to,
                type: type,
                employeeTypes: employeeTypes.join(',')
            }
        });
    }

    getAppointmentBarChart(pharmacyId, from, to, type) {
        return axios.get(`${this.basePath}/pharmacies/${pharmacyId}/appointments-report/barchart`, {
            params: {
                from: from,
                to: to,
                type: type,
            }
        });
    }

    getIncomeLineChart(pharmacyId, from, to, type, incomeTypes) {
        return axios.get(`${this.basePath}/pharmacies/${pharmacyId}/income-report`, {
            params: {
                from: from,
                to: to,
                type: type,
                incomeTypes: incomeTypes.join(',')
            }
        })
    }

    getIncomeBarChart(pharmacyId, from, to, type) {
        return axios.get(`${this.basePath}/pharmacies/${pharmacyId}/income-report/barchart`, {
            params: {
                from: from,
                to: to,
                type: type,
            }
        });
    }
}

export default new PharmacyReportService();