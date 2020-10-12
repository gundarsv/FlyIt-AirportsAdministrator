import axios from "axios";
import AuthService from "./auth.service";

const API_URL = "https://flyit.azurewebsites.net/api/User";

class UserService {
	private axiosInstance = axios.create();

	constructor() {
		this.axiosInstance.interceptors.response.use(
			response => {
				return response;
			},
			error => {
				if (error.response.status === 401) {
					AuthService.logout();
					window.location.reload();
				}

				return Promise.reject(error);
			},
		);
	}
}

export default new UserService();
