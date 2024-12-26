import {CHANGE_KEY} from "../types/AdminTypes";
const initialState = {
	key: "1",
};
const adminReducer = (state = initialState, action) => {
	switch (action.type) {
		case CHANGE_KEY: {
			return {...state, key: action.key};
		}
		default:
			return state;
	}
};

export default adminReducer;
