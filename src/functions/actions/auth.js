import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

export default {
    namespaced: true,
    state: {
        token: null,
        user: null
    },
    getters: {
        authenticated(state) {
            return state.token && state.user;
        },
        user(state) {
            return state.user;
        }
    },
    mutations: {
        SET_TOKEN(state, token) {
            AsyncStorage.setItem("token", token);
        },
        SET_USER(state, user) {
            state.user = user;
        }
    },
    actions: {
        signin(cred) {
            return fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cred)
            }).then(response => response.json()).then(async (res) => {
                console.log(res)
                console.log(response)
                // await AsyncStorage.setItem("token", res.data.access_token)
            }).catch(error => {
                console.log(error)
            });
        },
        async register({dispatch}, cred) {
            let response = await axios.post("/auth/register", cred);
            return dispatch("attempt", response.data.access_token);
        },
        async refresh({dispatch}) {
            let response = axios.post("auth/refresh");
            return dispatch("attempt", response.data.access_token);
        },
        async attempt({commit, state}, token) {
            if (token) {
                commit("SET_TOKEN", token);
            }
            if (!state.token) {
                return;
            }
            try {
                let response = await axios.post("/auth/me");
                commit("SET_USER", response.data);
            } catch (error) {
                commit("SET_TOKEN", null);
                commit("SET_USER", null);
            }
        },
        async signOut({commit}) {
            return await axios.post("/auth/logout").then(() => {
                commit("SET_TOKEN", null);
                commit("SET_USER", null);
            });
        }
    }
};
