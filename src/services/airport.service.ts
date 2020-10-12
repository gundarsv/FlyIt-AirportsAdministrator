import axios from "axios";
import AuthService from "./auth.service";
import authHeader from "./auth-header";
import { Airport } from "src/types/Airport";

const API_URL = "https://flyit.azurewebsites.net/api/Airport/";

class AirportService {
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

	getAirports() {
		return this.axiosInstance.get<Array<Airport>>(API_URL, { headers: authHeader() });
	}
}

export default new AirportService();
