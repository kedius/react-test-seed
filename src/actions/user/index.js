import * as types from './types.js';

export const setUser = user => {
  localStorage.setItem('accessToken', user.token);

  return {
    type: types.SET_USER_DATA,
    user
  };
};

export const setErrors = errors => ({
  type: types.SET_ERRORS,
  errors
});

export const resetUser = () => {
  localStorage.removeItem('accessToken');

  return {
    type: types.RESET_USER_DATA
  };
};

export const setIsLoading = (isLoading = true) => ({
  type: types.SET_USER_IS_LOADING,
  isLoading
});

export const setIsAuthenticating = (isAutheticating = true) => ({
  type: types.SET_USER_IS_AUTHENTICATING,
  isAutheticating
});

export const initUser = accessToken => ({
  type: types.INIT_USER,
  accessToken
});

export const login = credentials => ({
  type: types.LOGIN_USER,
  credentials
});
