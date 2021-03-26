import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_UPLOAD_AVATAR_BEGIN,
  HOME_UPLOAD_AVATAR_SUCCESS,
  HOME_UPLOAD_AVATAR_FAILURE,
  HOME_UPLOAD_AVATAR_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  uploadAvatar,
  dismissUploadAvatarError,
  reducer,
} from '../../../../src/features/home/redux/uploadAvatar';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/uploadAvatar', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when uploadAvatar succeeds', () => {
    const store = mockStore({});

    return store.dispatch(uploadAvatar())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_UPLOAD_AVATAR_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_UPLOAD_AVATAR_SUCCESS);
      });
  });

  it('dispatches failure action when uploadAvatar fails', () => {
    const store = mockStore({});

    return store.dispatch(uploadAvatar({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_UPLOAD_AVATAR_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_UPLOAD_AVATAR_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissUploadAvatarError', () => {
    const expectedAction = {
      type: HOME_UPLOAD_AVATAR_DISMISS_ERROR,
    };
    expect(dismissUploadAvatarError()).toEqual(expectedAction);
  });

  it('handles action type HOME_UPLOAD_AVATAR_BEGIN correctly', () => {
    const prevState = { uploadAvatarPending: false };
    const state = reducer(
      prevState,
      { type: HOME_UPLOAD_AVATAR_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.uploadAvatarPending).toBe(true);
  });

  it('handles action type HOME_UPLOAD_AVATAR_SUCCESS correctly', () => {
    const prevState = { uploadAvatarPending: true };
    const state = reducer(
      prevState,
      { type: HOME_UPLOAD_AVATAR_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.uploadAvatarPending).toBe(false);
  });

  it('handles action type HOME_UPLOAD_AVATAR_FAILURE correctly', () => {
    const prevState = { uploadAvatarPending: true };
    const state = reducer(
      prevState,
      { type: HOME_UPLOAD_AVATAR_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.uploadAvatarPending).toBe(false);
    expect(state.uploadAvatarError).toEqual(expect.anything());
  });

  it('handles action type HOME_UPLOAD_AVATAR_DISMISS_ERROR correctly', () => {
    const prevState = { uploadAvatarError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_UPLOAD_AVATAR_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.uploadAvatarError).toBe(null);
  });
});

