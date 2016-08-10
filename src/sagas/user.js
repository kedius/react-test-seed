import { takeEvery } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import * as types from './../actions/user/types';
import * as actions from './../actions/user';
import ApiFetch from '../utils/api-fetch';


function* initUser(action) {
  const { accessToken } = action;

  yield put(actions.setIsLoading());
  try {
    const data = yield new ApiFetch().get('login', { accessToken });
    yield put(actions.setUser(data));
  } catch (exception) {
    console.warn(exception.error);
    yield put(actions.setIsLoading(false));
  }
}

function* loginUser(action) {
  const { credentials } = action;
  yield put(actions.setIsAuthenticating());

  try {
    const data = yield new ApiFetch().post('login', credentials);

    yield put(actions.setIsLoading());
    yield put(actions.setUser(data));
  } catch (exception) {
    yield put(actions.setErrors(exception.error));
    yield put(actions.setIsLoading(false));
  }

  yield put(actions.setIsAuthenticating(false));
}

export default function* userSaga() {
  yield [
    takeEvery(types.INIT_USER, initUser),
    takeEvery(types.LOGIN_USER, loginUser)
  ];
}
