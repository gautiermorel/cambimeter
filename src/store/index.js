import { createStore } from 'vuex';
import fetchApi from "@/services/http";
import router from "@/router";

export default createStore({
	state: {
		user: localStorage.getItem('may21_user') && JSON.parse(localStorage.getItem('may21_user')) || {},
		token: localStorage.getItem('may21_token') || '',
		expiration: localStorage.getItem('may21_token_expiration') || Date.now(),
		isBusy: false,
		error: ""
	},
	mutations: {
		setBusy: (state) => state.isBusy = true,
		clearBusy: (state) => state.isBusy = false,
		setError: (state, error) => state.error = error,
		clearError: (state) => state.error = "",
		setUser: (state, user) => {
			state.user = user;
			localStorage.setItem('may21_user', JSON.stringify(user))
		},
		setToken: (state, auth) => {
			state.token = auth.token;
			state.expiration = new Date(auth.expiration)

			localStorage.setItem('may21_token', auth.token)
			localStorage.setItem('may21_token_expiration', new Date(auth.expiration))
		},
		clearToken: (state) => {
			state.token = "";
			state.expiration = Date.now();
			localStorage.setItem('may21_user', "")
			localStorage.setItem('may21_token', "")
			localStorage.setItem('may21_token_expiration', Date.now())
		}
	},
	getters: {
		getUser: (state) => (state && state.user) || {},
		isAuthenticated: (state) => state.token.length > 0 && new Date(state.expiration) > Date.now()
	},
	actions: {
		login: async ({ commit }, model) => {
			try {
				commit("setBusy");
				commit("clearError");

				const result = await fetchApi(false).post("/login", model);

				if (result.data.auth.token) {
					commit("setToken", result.data.auth);
					commit("setUser", result.data.user);
					router.push("/");
				}
				else {
					commit("setError", "Echec d'authentification");
				}
			} catch {
				commit("setError", "Echec de connexion");
			} finally {
				commit("clearBusy");
			}
		},
		signup: async ({ commit }, model) => {
			try {
				commit("setBusy");
				commit("clearError");

				const result = await fetchApi(false).post("/signup", model);

				if (result.data.auth.token) {
					commit("setToken", result.data.auth);
					commit("setUser", result.data.user);
					router.push("/");
				}
				else {
					commit("setError", "Echec d'authentification");
				}
			} catch {
				commit("setError", "Echec de reg");
			} finally {
				commit("clearBusy");
			}
		},
		logout: ({ commit }) => {
			commit("clearToken");
			router.push("/login");
		}
	}
})
