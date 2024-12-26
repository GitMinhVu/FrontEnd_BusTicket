import {OPEN_DRAWER, CLOSE_DRAWER} from "../types/DrawerTypes";

const initialState = {
	isOpenDrawer: false,
	title: "",
	content: "",
};

const drawerReducer = (state = initialState, action) => {
	switch (action.type) {
		case OPEN_DRAWER: {
			return {
				...state,
				isOpenDrawer: true,
				title: action.title,
				content: action.content,
			};
		}
		case CLOSE_DRAWER: {
			return {...state, isOpenDrawer: false};
		}
		default:
			return state;
	}
};

export default drawerReducer;
