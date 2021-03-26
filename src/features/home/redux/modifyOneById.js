import axios from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_MODIFY_ONE_BY_ID_BEGIN,
  HOME_MODIFY_ONE_BY_ID_SUCCESS,
  HOME_MODIFY_ONE_BY_ID_FAILURE,
  HOME_MODIFY_ONE_BY_ID_DISMISS_ERROR,
} from './constants';
import { serverUrl, config } from '../../../common/globalConfig';

export function modifyOneById(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_MODIFY_ONE_BY_ID_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = axios.post(`${serverUrl}/User/update`, args, config)
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_MODIFY_ONE_BY_ID_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_MODIFY_ONE_BY_ID_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissModifyOneByIdError() {
  return {
    type: HOME_MODIFY_ONE_BY_ID_DISMISS_ERROR,
  };
}

export function useModifyOneById() {
  const dispatch = useDispatch();

  const { modifyOneByIdPending, modifyOneByIdError } = useSelector(
    state => ({
      modifyOneByIdPending: state.home.modifyOneByIdPending,
      modifyOneByIdError: state.home.modifyOneByIdError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(modifyOneById(...args));
  }, [dispatch]);

  const boundDismissError = useCallback(() => {
    return dispatch(dismissModifyOneByIdError());
  }, [dispatch]);

  return {
    modifyOneById: boundAction,
    modifyOneByIdPending,
    modifyOneByIdError,
    dismissModifyOneByIdError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_MODIFY_ONE_BY_ID_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        modifyOneByIdPending: true,
        modifyOneByIdError: null,
      };

    case HOME_MODIFY_ONE_BY_ID_SUCCESS:
      // The request is success
      return {
        ...state,
        modifyOneByIdPending: false,
        modifyOneByIdError: null,
      };

    case HOME_MODIFY_ONE_BY_ID_FAILURE:
      // The request is failed
      return {
        ...state,
        modifyOneByIdPending: false,
        modifyOneByIdError: action.data.error,
      };

    case HOME_MODIFY_ONE_BY_ID_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        modifyOneByIdError: null,
      };

    default:
      return state;
  }
}
