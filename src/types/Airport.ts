import { News } from "./News";

export interface Airport {
	id: number;
	iata: string;
	name: string;
	news: News[];
}
