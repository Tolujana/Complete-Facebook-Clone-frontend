import axios from "axios";
const API = process.env.REACT_APP_API;
export const axiosInstance = axios.create({
  baseURL: API,
  // validateStatus: function (status) {
  //   return status >= 200 && status < 300; // default
  // },
});
