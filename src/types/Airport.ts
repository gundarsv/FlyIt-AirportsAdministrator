import { News } from "./News";

export interface Airport {
	id: number;
	iata: string;
	name: string;
	mapUrl: string;
	mapName: string;
	rentingCompanyUrl: string;
	rentingCompanyName: string;
	rentingCompanyPhoneNo: string;
	taxiPhoneNo: string;
	emergencyPhoneNo: string;
}
