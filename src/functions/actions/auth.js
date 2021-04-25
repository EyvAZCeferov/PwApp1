import AsyncStorage from "@react-native-community/async-storage";

export default {
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
            AsyncStorage.setItem("user", user);
        }
    },
    actions: {
        async signin({dispatch}, cred) {
            fetch("/auth/login", {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: cred
            }).then((response) => {
                return dispatch("attempt", response.data.access_token);
            }).catch((error) => {
                console.error(error);
            });
        },
        async register({dispatch}, cred) {
            fetch("/auth/register", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                },
                body: cred
            }).then(response => {
                return dispatch("attempt", response.data.access_token)
            }).catch(error => {
                console.log(error)
            });
        },
        async refresh({dispatch}) {
            fetch("auth/refresh", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + await AsyncStorage.getItem("token"),
                    "Content-type": "application/json",
                },
            }).then(response => {
                return dispatch("attempt", response.data.access_token);
            }).catch(error => {
                console.log(error)
            });
        },
        async attempt({commit, state}, token) {
            if (token) {
                commit("SET_TOKEN", token);
                fetch("/auth/me", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + token,
                        "Content-type": "application/json",
                    },
                }).then(e => {
                    commit("SET_USER", e.data);
                }).catch(error => {
                    console.log(error)
                });
            }
            if (!token) {
                return;
            }
        },
        async signOut({commit}) {
            fetch("/auth/logout", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + await AsyncStorage.getItem("token"),
                    "Content-type": "application/json",
                },
            }).then(() => {
                commit("SET_TOKEN", null);
                commit("SET_USER", null);
            });
        }
    }
};
