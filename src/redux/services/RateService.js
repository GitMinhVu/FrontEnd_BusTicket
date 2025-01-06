import {baseService} from "./BaseService";

export class RateService extends baseService {
	constructor() {
		super();
	}

	createRate = (rateData) => {
		return this.post("/rate", rateData); // Matches the backend route exactly
	};
}

export const rateService = new RateService();
