import ServiceBase from "./ServiceBase";
import axios from 'axios';


class MedicineService extends ServiceBase {
    constructor() {
        super();
    }

    registerMedicine(payload) {
        return axios.post(`${this.basePath}/medicines`, payload);
    }

    getMedicineDetails(id) {
        return axios.get(`${this.basePath}/medicines/${id}`);
    }

    getAllMedicines(name, lowGrade, highGrade, issueOnRecipe, medicineType, page, size) {
        return axios.get(`${this.basePath}/medicines`, {
            params: {
                name: name,
                lowGrade: lowGrade,
                highGrade: highGrade,
                issueOnRecipe: issueOnRecipe,
                medicineType: medicineType,
                page: page,
                size: size
            }
        })
    }

    getNotInOrder(orderId, name, lowGrade, highGrade, issueOnRecipe, medicineType, page, size) {
        return axios.get(`${this.basePath}/medicines/not-in-order/${orderId}`, {
            params: {
                name: name,
                lowGrade: lowGrade,
                highGrade: highGrade,
                issueOnRecipe: issueOnRecipe,
                medicineType: medicineType,
                page: page,
                size: size
            }
        })
    }

    getPharmaciesForMedicine(id, page, size) {
        return axios.get(`${this.basePath}/medicine-stocks/medicine/${id}`, {
            params: {
                page: page,
                size: size
            }
        })
    }

    getAllMedicinesForPrescription(employeeId, pharmacyId, patientId, medicineName, chosenMedicineIds, page, size) {
        return axios.get(`${this.basePath}/medicine-stocks/all-prescriptions/${employeeId}`, {
            params: {
                pharmacyId: pharmacyId,
                patientId: patientId,
                medicineName: medicineName,
                chosenMedicineIds: chosenMedicineIds.join(','),
                page: page,
                size: size,
                sort: 'id,ASC'
            }
        })
    }

    checkIfMedicineIsInStock(employeeId, pharmacyId, medicineStockId, appointmentId) {
        return axios.get(`${this.basePath}/medicine-stocks/medicine-in-stock/${employeeId}`, {
            params: {
                pharmacyId: pharmacyId,
                medicineStockId: medicineStockId,
                appointmentId: appointmentId
            }
        })
    }

    getReplacementsForMedicine(employeeId, pharmacyId, medicineStockId, patientId, medicineName, appointmentId, chosenMedicineIds, page, size) {
        return axios.get(`${this.basePath}/medicine-stocks/all-replacement-medicines/${employeeId}`, {
            params: {
                pharmacyId: pharmacyId,
                patientId: patientId,
                medicineStockId: medicineStockId,
                appointmentId: appointmentId,
                chosenMedicineIds: chosenMedicineIds.join(','),
                medicineName: medicineName,
                page: page,
                size: size,
                sort: 'id,ASC'
            }
        })
    }

    getAllMedicine() {
        return axios.get(`${this.basePath}/medicines/all`);
    }

}

export default new MedicineService();