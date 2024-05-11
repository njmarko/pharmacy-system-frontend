import axios from "axios";
import ServiceBase from "./ServiceBase";

class UserService extends ServiceBase {
    constructor() {
        super();
    }

    //TODO: ovo mozda prebaciti u vuex actions
    login(payload) {
        return axios.post(`${this.basePath}/users/authenticate`, payload);
    }

    registerDermatologist(payload) {
        return axios.post(`${this.basePath}/pharmacy-employees/dermatologist`, payload);
    }

    updatePassword(userId, passwordDTO){
        return axios.post(`${this.basePath}/users/${userId}/password`, passwordDTO);
    }

    firstPaswordChange(userId, passwordDTO){
        return axios.post(`${this.basePath}/users/${userId}/first-password`, passwordDTO);
    }
}

export default new UserService();