import {message} from "antd";
import {commentService} from "../services/CommentService";
import {GET_COMMENT_BY_PASSENGER, GET_COMMENT_BY_USER} from "../types/CommentTypes";
import {HIDE_LOADING_SPIN, SET_LOADING_SPIN} from "../types/LoadingTypes";

export const getCommentPassengerAction = (passengerId) => {
	return async (dispatch) => {
		try {
			const result = await commentService.getCommentByPassenger(passengerId);
			if (result.status == 200) {
				dispatch({type: SET_LOADING_SPIN});
				dispatch({
					type: GET_COMMENT_BY_PASSENGER,
					listCommentPassenger: result.data,
				});
				setTimeout(function () {
					dispatch({
						type: HIDE_LOADING_SPIN,
					});
				}, 500);
			}
		} catch (error) {
			console.log(error);
		}
	};
};

export const getCommentUserAction = (userId, passengerId) => {
	return async (dispatch) => {
		try {
			const result = await commentService.getCommentUserPassenger(userId, passengerId);
			if (result.status == 200) {
				dispatch({
					type: GET_COMMENT_BY_USER,
					listCommentUser: result.data,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};
};
export const createCommentUserAction = (userComment) => {
	return async (dispatch) => {
		try {
			const result = await commentService.createCommentUserPassenger(userComment);
			console.log("file: commentAction.js ~ line 47 ~ return ~ result", result);
			if (result.status == 201) {
				message.success("Bình luận thành công");
				dispatch(getCommentUserAction(userComment.userId, userComment.passengerId));
			}
		} catch (error) {
			console.log(error);
		}
	};
};
export const deleteCommentAction = (commentId, userId, passengerId) => {
	return async (dispatch) => {
		try {
			const result = await commentService.deleteComment(commentId);
			if (result.status === 200) {
				message.success("Xóa bình luận thành công");
				dispatch(getCommentUserAction(userId, passengerId));
			}
		} catch (error) {
			console.log(error);
			message.error("Xóa bình luận thất bại");
		}
	};
};
export const updateCommentAction = (comment) => {
	return async (dispatch) => {
		try {
			const result = await commentService.updateCommentUserPassenger(comment);
			if (result.status === 200) {
				message.success("Cập nhật bình luận thành công");
				dispatch(getCommentUserAction(comment.userId, comment.passengerId));
			}
		} catch (error) {
			console.log(error);
			message.error("Cập nhật bình luận thất bại");
		}
	};
};
