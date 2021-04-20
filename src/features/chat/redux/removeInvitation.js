import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  CHAT_REMOVE_INVITATION_BEGIN,
  CHAT_REMOVE_INVITATION_SUCCESS,
  CHAT_REMOVE_INVITATION_FAILURE,
  CHAT_REMOVE_INVITATION_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import { serverUrl, config} from '../../../common/globalConfig';

export function removeInvitation(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: CHAT_REMOVE_INVITATION_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const requestJSON = JSON.stringify({ ...args });
      const doRequest = axios.post(`${serverUrl}/friend/remove`, requestJSON, config);
      doRequest.then(
        (res) => {
          dispatch({
            type: CHAT_REMOVE_INVITATION_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: CHAT_REMOVE_INVITATION_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissRemoveInvitationError() {
  return {
    type: CHAT_REMOVE_INVITATION_DISMISS_ERROR,
  };
}

export function useRemoveInvitation() {
  const dispatch = useDispatch();

  const { removeInvitationPending, removeInvitationError } = useSelector(
    state => ({
      removeInvitationPending: state.chat.removeInvitationPending,
      removeInvitationError: state.chat.removeInvitationError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(removeInvitation(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissRemoveInvitationError());
  }, [dispatch]);

  return {
    removeInvitation: boundAction,
    removeInvitationPending,
    removeInvitationError,
    dismissRemoveInvitationError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case CHAT_REMOVE_INVITATION_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        removeInvitationPending: true,
        removeInvitationError: null,
      };

    case CHAT_REMOVE_INVITATION_SUCCESS:
      // The request is success
      return {
        ...state,
        removeInvitationPending: false,
        removeInvitationError: null,
      };

    case CHAT_REMOVE_INVITATION_FAILURE:
      // The request is failed
      return {
        ...state,
        removeInvitationPending: false,
        removeInvitationError: action.data.error,
      };

    case CHAT_REMOVE_INVITATION_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        removeInvitationError: null,
      };

    default:
      return state;
  }
}
