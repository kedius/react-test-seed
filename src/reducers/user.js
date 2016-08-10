import * as types from '../actions/user/types';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  id: null,
  isLoading: false,
  isAutheticating: false,
  token: localStorage.getItem('accessToken'),
  errors: null,
  role: 'GUEST'
});

const reducers = {
  [types.SET_ERRORS]: (state, action) =>
    state.set('errors', action.errors || null),

  [types.SET_USER_DATA]: (state, action) =>
    initialState.mergeDeep(action.user),

  [types.SET_USER_IS_LOADING]: (state, action) =>
    state.set('isLoading', action.isLoading),

  [types.SET_USER_IS_AUTHENTICATING]: (state, action) =>
    state.set('isAutheticating', action.isAutheticating),

  [types.RESET_USER_DATA]: (state, action) =>
    initialState.set('token', null)

};

export default (state = initialState, action) => {
  const reducer = reducers[action.type];

  return reducer ? reducer(state, action) : state;
}
