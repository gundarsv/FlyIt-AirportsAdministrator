import { Airport } from "src/types/Airport";
import AuthService from "./auth.service";
import authHeader from "./auth-header";
import axios from "axios";

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

	deleteAirport(airportId: number) {
		return this.axiosInstance.delete<Airport>(API_URL + airportId, { headers: authHeader() });
	}

	updateAirport(airport: Airport) {
		return this.axiosInstance.put<Airport>(
			API_URL + airport.id,
			{
				iata: airport.iata,
				name: airport.name,
				mapUrl: airport.mapUrl,
				mapName: airport.mapName,
				rentingCompanyName: airport.rentingCompanyName,
				rentingCompanyUrl: airport.rentingCompanyUrl,
				rentingCompanyPhoneNo: airport.rentingCompanyPhoneNo,
				taxiPhoneNo: airport.taxiPhoneNo,
				emergencyPhoneNo: airport.emergencyPhoneNo,
			},
			{ headers: authHeader() },
		);
	}

	addAirport(
		iata: string,
		airportName: string,
		mapUrl: string,
		mapName: string,
		rentingCompanyName: string,
		rentingCompanyUrl: string,
		rentingCompanyPhoneNo: string,
		taxiPhoneNo: string,
		emergencyPhoneNo: string,
	) {
		return this.axiosInstance.post<Airport>(
			API_URL,
			{
				iata: iata,
				name: airportName,
				mapUrl: mapUrl,
				mapName: mapName,
				rentingCompanyName: rentingCompanyName,
				rentingCompanyUrl: rentingCompanyUrl,
				rentingCompanyPhoneNo: rentingCompanyPhoneNo,
				taxiPhoneNo: taxiPhoneNo,
				emergencyPhoneNo: emergencyPhoneNo,
			},
			{ headers: authHeader() },
		);
	}
}

export default new AirportService();
