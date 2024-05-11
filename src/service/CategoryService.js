import ServiceBase from "./ServiceBase"
import axios from 'axios'




class CategoryService extends ServiceBase {
    constructor(){
        super();
    }


    getCategories(page, size, sortCriteria, sortDirection){
        return axios.get(`${this.basePath}/patient-categories`, {
            params: {
                page: page,
                size: size,
                sort: `${sortCriteria},${sortDirection}`
            }
        })
    }

    deleteCategory(categoryId){
        return axios.delete(`${this.basePath}/patient-categories/${categoryId}`);
    }

    updateCategory(categoryId, payload){
        return axios.put(`${this.basePath}/patient-categories/${categoryId}`, payload);
    }

    createCategory(payload){
        return axios.post(`${this.basePath}/patient-categories`, payload);
    }

    getAppointmentPoints(){
        return axios.get(`${this.basePath}/system-settings/employee-appointment-points`);
    }

    updateAppointmentPoints(payload){
        return axios.put(`${this.basePath}/system-settings/employee-appointment-points`, payload);
    }
}


export default new CategoryService();