import {PREVIEW_FALSE, PREVIEW_TRUE, SET_DETAIL_PASSENGER, SET_LIST_PASSENGER} from "../types/PassengerTypes";

const initialState = {
	listPassenger: [],
	passengerDetail: {},
};

const passengerReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_LIST_PASSENGER: {
			return {...state, listPassenger: action.listPassenger};
		}
		case SET_DETAIL_PASSENGER: {
			return {...state, passengerDetail: action.passengerDetail};
		}
		case PREVIEW_TRUE: {
			let passengerDetailUpdate = {...state.passengerDetail};

			let index = passengerDetailUpdate.passengerCar.findIndex((item) => item.id === action.vehicleId);
			if (index !== -1) {
				passengerDetailUpdate.passengerCar[index].visible = true;
				return {...state, passengerDetail: passengerDetailUpdate};
			}
			break;
		}
		case PREVIEW_FALSE: {
			let passengerDetailUpdate = {...state.passengerDetail};

			let index = passengerDetailUpdate.passengerCar.findIndex((item) => item.id === action.vehicleId);
			if (index !== -1) {
				passengerDetailUpdate.passengerCar[index].visible = false;
				return {...state, passengerDetail: passengerDetailUpdate};
			}
			break;
		}
		default:
			return state;
	}
};

export default passengerReducer;
