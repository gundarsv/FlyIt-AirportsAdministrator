import { AuthenticationToken } from "src/types/Auth";

interface IAuthHeader {
	Authorization: string;
}

export default function authHeadder(): IAuthHeader {
	const authenticationToken: AuthenticationToken = JSON.parse(localStorage.getItem("token"));

	if (authenticationToken && authenticationToken.accessToken) {
		return { Authorization: "Bearer " + authenticationToken.accessToken };
	}

	return { Authorization: "" };
}
