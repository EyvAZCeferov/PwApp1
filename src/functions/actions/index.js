import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import auth from "./auth";
axios.defaults.baseURL = "http://localhost:8000/api/";
axios.defaults.headers.common["Authorization"] = "Bearer" + AsyncStorage.getItem("token");

export default auth