import axios from "axios";
import store from "@/store";

export default function fetchApi(secured = true) {
	if (secured) {
		let api = axios.create({
			baseURL: process.env.VUE_APP_GOHUB_API_URL || 'none',
			headers: {
				// "Authorization": `bearer ${store.state.token}`,
				"token": `${store.state.token}`
			}
		});

		api.interceptors.response.use((response) => response, (error) => {
			let { data = '', status = 500, statusText = 'Une erreur inattendue s’est produite' } = (error && error.response) || {};
			console.log('data:', data)
			console.log('statusText:', statusText)
      // ElNotification.error({ title: 'Erreur', message: `${status} - ${statusText} ${typeof data === 'string' ? data : ''}` });
			return Promise.reject(status);
		});

		return api;

	} else {
		return axios.create({
			baseURL: process.env.VUE_APP_GOHUB_API_URL || 'none'
		});
	}
} 
