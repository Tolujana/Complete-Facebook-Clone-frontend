import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: 'https://socialmedia-site.herokuapp.com/api/',
  // baseURL: "http://localhost:8800/api",
  baseURL: "https://facebook-clone-apizz.onrender.com/api",
  // validateStatus: function (status) {
  //   return status >= 200 && status < 300; // default
  // },
});
