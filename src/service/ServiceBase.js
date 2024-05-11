import axios from 'axios';
export default class ServiceBase {
  constructor() {
    this.basePath = "https://mrs-isa-tim-1-backend.herokuapp.com/api";
  }

  getImages(page, size){
     return axios.get("https://picsum.photos/v2/list",{ params: { page: page, limit: size} });
  }
}
