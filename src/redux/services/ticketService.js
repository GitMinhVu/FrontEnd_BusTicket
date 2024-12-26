import {baseService} from "./BaseService";

export class TicketService extends baseService {
	constructor() {
		super();
	}
	getTicketUser = (userId) => {
		return this.get(`/ticket?userId=${userId}`);
	};
	// getDetailTicket = (id) => {
	// 	return this.get(`/ticket/${id}`);
	// };
	getDetailTicket = (id, numberPhone) => {
		if (numberPhone) {
			return this.get(`/ticket/${id}?numberPhone=${numberPhone}`);
		}
		return this.get(`/ticket/${id}`);
	};
	cancelTicket = (id) => {
		return this.put(`/ticket/cancel/${id}`);
	};
	deleteTicket = (id) => {
		return this.delete(`/ticket/${id}`);
	};
	confirmTicket = (id) => {
		return this.put(`/ticket/confirm/${id}`);
	};
	updateTicket = (id, ticket) => {
		return this.put(`/ticket/${id}`, ticket);
	};
	getAllTicket = () => {
		return this.get(`/ticket/getall`);
	};
	getAllTicketByTrip = (id) => {
		return this.get(`/ticket/trip?tripPassengerId=${id}`);
	};
	// getTicketByPhoneAndId = (ticketId, numberPhone) => {
	// 	return this.get(`/ticket/${ticketId}?numberPhone=${numberPhone}`);
	// };
	// searchTicketByPhone = (numberPhone) => {
	// 	return this.get(`/ticket/search?numberPhone=${numberPhone.toString()}`);
	// };
}
export const ticketService = new TicketService();
