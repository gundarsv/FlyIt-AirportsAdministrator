import AuthService from "./auth.service";
import { Image } from "src/types/Image";
import authHeader from "./auth-header";
import axios from "axios";

const API_URL = "https://flyit.azurewebsites.net/api/Image/";

class ImageService {
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

	uploadImage(image: File) {
		const formData = new FormData();
		formData.append("image", image);

		return this.axiosInstance.post<Image>(API_URL, formData, { headers: { "content-type": "multipart/form-data", Authorization: authHeader().Authorization } });
	}

	deleteImage(filename: string) {
		return this.axiosInstance.delete<string>(API_URL + filename, { headers: authHeader() });
	}
}

export default new ImageService();
