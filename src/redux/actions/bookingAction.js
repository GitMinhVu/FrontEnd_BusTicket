import {history} from "../../App";
import {STATUS_CODE} from "../../util/settings/config";
import {bookingService} from "../services/BookingService";
import _ from "lodash";
import {GET_IMG_VEHICLES, GET_PROVINCE, GET_TRIP_BY_USER, GET_TRIP_PASSENGER, SELECT_BOOKING_SEAT} from "../types/BookingTypes";
import {HIDE_LOADING, HIDE_LOADING_BUTTON, SET_LOADING} from "../types/LoadingTypes";
import {PayAction} from "./payAction";
import {message} from "antd";

export const getProvinceAction = () => {
	return async (dispatch) => {
		try {
			const result = await bookingService.getProvince();
			if (result.status == 201) {
				dispatch({
					type: GET_PROVINCE,
					listProvince: result.data,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};
};
export const getTripPassengerAction = (tripIds) => {
	return async (dispatch) => {
		dispatch({
			type: SET_LOADING,
		});

		// Handle array of trip IDs
		if (Array.isArray(tripIds)) {
			const promises = tripIds.map((id) => bookingService.getTripPassenger(id));
			const results = await Promise.all(promises);

			// Combine all results
			const allTrips = results.flatMap((result) =>
				result.data.map((item) => ({
					...item,
					openDetail: false,
					openBooking: false,
					isOpen: false,
				}))
			);

			dispatch({
				type: GET_TRIP_PASSENGER,
				listTripPassenger: allTrips,
			});
		}

		dispatch({
			type: HIDE_LOADING,
		});
	};
};

export const getTripByUserAction = (trip) => {
	return async (dispatch) => {
		const result = await bookingService.getTripByUser(trip);
		if (result.status == 200) {
			dispatch({
				type: GET_TRIP_BY_USER,
				tripByUser: result.data,
			});

			// Gọi getTripPassengerAction với tất cả các chuyến
			const allTrips = result.data.map((item) => item.id);
			dispatch(getTripPassengerAction(allTrips));

			history.push(`/booking/${result.data[0]?.id || "NoTrip"}/${trip.fromStation}/${trip.toStation}/${trip.startTime}`);

			dispatch({
				type: HIDE_LOADING_BUTTON,
			});
		}
	};
};
export const bookingSeatAction = (seat) => {
	return async (dispatch, getState) => {
		const listSeatSelected = getState().BookingReducer.listSeatSelected;

		dispatch({
			type: SELECT_BOOKING_SEAT,
			seat: seat,
		});
	};
};

// export const bookingTicketAction = (ticket, passenger) => {
// 	return async (dispatch) => {
// 		try {
// 			const result = await bookingService.booking(ticket);
// 			console.log(result);
// 			if (result.status == 200) {
// 				message.success("Đặt vé thành công");
// 				dispatch(PayAction(ticket, passenger));
// 			} else {
// 				message.error("đặt vé không thành công vì bạn đã đặt vé cho chuyến này rồi");
// 			}
// 		} catch (error) {
// 			message.error("đặt vé không thành công vì bạn đã đặt vé cho chuyến này rồi");
// 			console.log(error);
// 		}
// 	};
// };

export const bookingTicketAction = (ticket, passenger) => {
	return async (dispatch) => {
		try {
			const result = await bookingService.booking(ticket);
			if (result.status == 200) {
				message.success("Đặt vé thành công");
				if (ticket.payment_method === "Tiền mặt") {
					setTimeout(() => {
						window.location.href = "/";
					}, 1000);
				} else {
					dispatch(PayAction(ticket, passenger));
				}
			} else {
				message.error("Đặt vé không thành công vì bạn đã đặt vé cho chuyến này rồi");
			}
		} catch (error) {
			message.error("Đặt vé không thành công vì bạn đã đặt vé cho chuyến này rồi");
			console.log(error);
		}
	};
};
