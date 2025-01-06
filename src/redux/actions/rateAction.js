import {rateService} from "../services/RateService";

export const createRatingAction = (rateData) => {
	return async (dispatch) => {
		try {
			const result = await rateService.createRate(rateData);
			// You can dispatch additional actions here if needed
		} catch (error) {
			console.log(error);
		}
	};
};
