import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  CHAT_ACCEPT_INVITATION_BEGIN,
  CHAT_ACCEPT_INVITATION_SUCCESS,
  CHAT_ACCEPT_INVITATION_FAILURE,
  CHAT_ACCEPT_INVITATION_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config} from '../../../common/globalConfig';

export function acceptInvitation(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: CHAT_ACCEPT_INVITATION_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/friend/update`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: CHAT_ACCEPT_INVITATION_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: CHAT_ACCEPT_INVITATION_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissAcceptInvitationError() {
  return {
    type: CHAT_ACCEPT_INVITATION_DISMISS_ERROR,
  };
}

export function useAcceptInvitation() {
  const dispatch = useDispatch();

  const { acceptInvitationPending, acceptInvitationError } = useSelector(
    state => ({
      acceptInvitationPending: state.chat.acceptInvitationPending,
      acceptInvitationError: state.chat.acceptInvitationError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(acceptInvitation(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissAcceptInvitationError());
  }, [dispatch]);

  return {
    acceptInvitation: boundAction,
    acceptInvitationPending,
    acceptInvitationError,
    dismissAcceptInvitationError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case CHAT_ACCEPT_INVITATION_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        acceptInvitationPending: true,
        acceptInvitationError: null,
      };

    case CHAT_ACCEPT_INVITATION_SUCCESS:
      // The request is success
      return {
        ...state,
        acceptInvitationPending: false,
        acceptInvitationError: null,
      };

    case CHAT_ACCEPT_INVITATION_FAILURE:
      // The request is failed
      return {
        ...state,
        acceptInvitationPending: false,
        acceptInvitationError: action.data.error,
      };

    case CHAT_ACCEPT_INVITATION_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        acceptInvitationError: null,
      };

    default:
      return state;
  }
}
