export interface AuthenticationToken {
	accessToken: string;
	expiresAt: number;
	refreshToken: string;
}
