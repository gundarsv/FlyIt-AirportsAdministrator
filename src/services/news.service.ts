import AuthService from "./auth.service";
import { News } from "src/types/News";
import authHeader from "./auth-header";
import axios from "axios";

const API_URL = "https://flyit.azurewebsites.net/api/News/";

class NewsService {
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

	getNewsByAirportId(id: number) {
		return this.axiosInstance.get<News[]>(API_URL + "airport/" + id, { headers: authHeader() });
	}

	updateNews(news: News) {
		return this.axiosInstance.put<News>(
			API_URL + news.id,
			{
				body: news.body,
				imageName: news.imageName,
				imageurl: news.imageurl,
				title: news.title,
			},
			{ headers: authHeader() },
		);
	}

	addNews(news: News, airportId: number) {
		return this.axiosInstance.post<News>(
			API_URL + airportId,
			{
				body: news.body,
				imageName: news.imageName,
				imageurl: news.imageurl,
				title: news.title,
			},
			{ headers: authHeader() },
		);
	}

	deleteNews(id: number) {
		return this.axiosInstance.delete<News>(API_URL + id, { headers: authHeader() });
	}
}

export default new NewsService();
