import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  CHAT_SEND_INVITATION_BEGIN,
  CHAT_SEND_INVITATION_SUCCESS,
  CHAT_SEND_INVITATION_FAILURE,
  CHAT_SEND_INVITATION_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config} from '../../../common/globalConfig';

export function sendInvitation(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: CHAT_SEND_INVITATION_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/friend/add`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: CHAT_SEND_INVITATION_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: CHAT_SEND_INVITATION_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissSendInvitationError() {
  return {
    type: CHAT_SEND_INVITATION_DISMISS_ERROR,
  };
}

export function useSendInvitation() {
  const dispatch = useDispatch();

  const { sendInvitationPending, sendInvitationError } = useSelector(
    state => ({
      sendInvitationPending: state.chat.sendInvitationPending,
      sendInvitationError: state.chat.sendInvitationError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(sendInvitation(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissSendInvitationError());
  }, [dispatch]);

  return {
    sendInvitation: boundAction,
    sendInvitationPending,
    sendInvitationError,
    dismissSendInvitationError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case CHAT_SEND_INVITATION_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        sendInvitationPending: true,
        sendInvitationError: null,
      };

    case CHAT_SEND_INVITATION_SUCCESS:
      // The request is success
      return {
        ...state,
        sendInvitationPending: false,
        sendInvitationError: null,
      };

    case CHAT_SEND_INVITATION_FAILURE:
      // The request is failed
      return {
        ...state,
        sendInvitationPending: false,
        sendInvitationError: action.data.error,
      };

    case CHAT_SEND_INVITATION_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        sendInvitationError: null,
      };

    default:
      return state;
  }
}
