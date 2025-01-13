import {stationService} from "../services/StationService";
import {SET_LIST_STATION, SET_STATION_DETAIL} from "../types/StationTypes";
import {message} from "antd";

export const getListStationAction = () => {
	return async (dispatch) => {
		try {
			const result = await stationService.getListStation();
			if (result.status == 200) {
				dispatch({
					type: SET_LIST_STATION,
					listStation: result.data,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};
};

export const getDetailStationAction = (id) => {
	return async (dispatch) => {
		try {
			const result = await stationService.getDetailStation(id);
			if (result.status == 200) {
				dispatch({
					type: SET_STATION_DETAIL,
					stationDetail: result.data,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};
};

export const updateStationAction = (id, station) => {
	return async (dispatch) => {
		try {
			const result = await stationService.updateStation(id, station);
			if (result.status == 200) {
				message.success("Cập nhật bến xe thành công");
				dispatch(getListStationAction());
			}
		} catch (error) {
			message.error("Cập nhật bến xe thất bại");
			console.log(error);
		}
	};
};

export const createStationAction = (station) => {
	return async (dispatch) => {
		try {
			const result = await stationService.createStation(station);
			if (result.status == 200) {
				message.success("Thêm bến xe thành công");
				dispatch(getListStationAction());
			}
		} catch (error) {
			message.error("Thêm bến xe thất bại");
			console.log(error);
		}
	};
};

export const deleteStationAction = (id) => {
	return async (dispatch) => {
		try {
			const result = await stationService.deleteStation(id);
			if (result.status == 200) {
				message.success("Xóa bến xe thành công");
				dispatch(getListStationAction());
			}
		} catch (error) {
			message.error("Xóa bến xe thất bại");
			console.log(error);
		}
	};
};
