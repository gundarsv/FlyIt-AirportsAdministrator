import AuthService from "./auth.service";
import { FileDTO } from "src/types/FileDTO";
import authHeader from "./auth-header";
import axios from "axios";

const API_URL = "https://flyit.azurewebsites.net/api/File/";

class FileService {
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

	uploadFile(file: File) {
		const formData = new FormData();
		formData.append("file", file);

		return this.axiosInstance.post<FileDTO>(API_URL, formData, { headers: { "content-type": "multipart/form-data", Authorization: authHeader().Authorization } });
	}

	deleteFile(filename: string) {
		return this.axiosInstance.delete<string>(API_URL + filename, { headers: authHeader() });
	}
}

export default new FileService();
