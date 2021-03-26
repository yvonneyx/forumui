import axios from 'axios';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  HOME_UPLOAD_AVATAR_BEGIN,
  HOME_UPLOAD_AVATAR_SUCCESS,
  HOME_UPLOAD_AVATAR_FAILURE,
  HOME_UPLOAD_AVATAR_DISMISS_ERROR,
} from './constants';

export function uploadAvatar(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_UPLOAD_AVATAR_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const { action, data, file, headers, onError, onProgress, onSuccess, withCredentials } = args;
      const doRequest = axios
        .post(action, data, {
          withCredentials,
          headers,
          onUploadProgress: ({ total, loaded }) => {
            onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file);
          },
        })
      doRequest.then(
        (res) => {
          onSuccess(res, file);
          dispatch({
            type: HOME_UPLOAD_AVATAR_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          onError();
          dispatch({
            type: HOME_UPLOAD_AVATAR_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissUploadAvatarError() {
  return {
    type: HOME_UPLOAD_AVATAR_DISMISS_ERROR,
  };
}

export function useUploadAvatar(params) {
  const dispatch = useDispatch();

  const { uploadAvatarPending, uploadAvatarError } = useSelector(
    state => ({
      uploadAvatarPending: state.home.uploadAvatarPending,
      uploadAvatarError: state.home.uploadAvatarError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(uploadAvatar(...args));
  }, [dispatch]);

  useEffect(() => {
    if (params) boundAction(...(params || []));
  }, [...(params || []), boundAction]); // eslint-disable-line

  const boundDismissError = useCallback(() => {
    return dispatch(dismissUploadAvatarError());
  }, [dispatch]);

  return {
    uploadAvatar: boundAction,
    uploadAvatarPending,
    uploadAvatarError,
    dismissUploadAvatarError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_UPLOAD_AVATAR_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        uploadAvatarPending: true,
        uploadAvatarError: null,
      };

    case HOME_UPLOAD_AVATAR_SUCCESS:
      // The request is success
      return {
        ...state,
        uploadAvatarPending: false,
        uploadAvatarError: null,
      };

    case HOME_UPLOAD_AVATAR_FAILURE:
      // The request is failed
      return {
        ...state,
        uploadAvatarPending: false,
        uploadAvatarError: action.data.error,
      };

    case HOME_UPLOAD_AVATAR_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        uploadAvatarError: null,
      };

    default:
      return state;
  }
}
