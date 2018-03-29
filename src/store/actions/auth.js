import axios from 'axios';
import * as actionTypes from './actionTypes';
import { APP_NAME, API_URL } from '../../utils/const';

export const authStart = () => ({
  type: actionTypes.AUTH_START
});

export const authSuccess = (username, password, authData) => ({
  type: actionTypes.AUTH_SUCCESS,
  username,
  password,
  authData
});

export const authFail = (error) => ({
  type: actionTypes.AUTH_FAIL,
  error
});

export const logout = () => {
  localStorage.removeItem(`${APP_NAME}-key-expiration-date`);
  localStorage.removeItem(`${APP_NAME}-title`);
  localStorage.removeItem(`${APP_NAME}-profileImage`);
  localStorage.removeItem(`${APP_NAME}-authKey`);
  localStorage.removeItem(`${APP_NAME}-patientTypeName`);
  localStorage.removeItem(`${APP_NAME}-firstName`);
  localStorage.removeItem(`${APP_NAME}-lastName`);
  localStorage.removeItem(`${APP_NAME}-email`);
  localStorage.removeItem(`${APP_NAME}-phone`);
  localStorage.removeItem(`${APP_NAME}-phoneIsConfirmed`);
  localStorage.removeItem(`${APP_NAME}-birthday`);

  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const auth = (username, password) => dispatch => {
  dispatch(authStart());

  axios.post(`${API_URL}/user/login`, { username, password })
    // eslint-disable-next-line promise/always-return
    .then(response => {
      const expirationDate = new Date(new Date().getTime() + (response.data.expires_in * 1000));
      localStorage.setItem(`${APP_NAME}-key-expiration-date`, expirationDate);
      localStorage.setItem(`${APP_NAME}-title`, response.data.title);
      localStorage.setItem(`${APP_NAME}-profileImage`, response.data.profile_image);
      localStorage.setItem(`${APP_NAME}-authKey`, response.data.auth_key);
      localStorage.setItem(`${APP_NAME}-patientTypeName`, response.data.patient_type_name);
      localStorage.setItem(`${APP_NAME}-firstName`, response.data.first_name);
      localStorage.setItem(`${APP_NAME}-lastName`, response.data.last_name);
      localStorage.setItem(`${APP_NAME}-email`, response.data.email);
      localStorage.setItem(`${APP_NAME}-phone`, response.data.phone);
      localStorage.setItem(`${APP_NAME}-phoneIsConfirmed`, response.data.phone_is_confirmed);
      localStorage.setItem(`${APP_NAME}-birthday`, response.data.birthday);

      dispatch(checkAuthTimeout(response.data.expires_in));

      dispatch(authSuccess(username, password, response.data));
    })
    .catch(error => {
      dispatch(authFail(error.response.data));
    });
};

export const checkAuthTimeout = (expirationTime) => dispatch => {
  setTimeout(() => dispatch(logout()), expirationTime * 1000);
};

export const authCheckState = () => dispatch => {
  const authKey = localStorage.getItem(`${APP_NAME}-authKey');
  if (!authKey) {
    dispatch(logout());
  } else {
    const expirationDate = new Date(localStorage.getItem(`${APP_NAME}-key-expiration-date`));

    if (expirationDate <= new Date()) {
      dispatch(logout());
    } else {
      const title = localStorage.getItem(`${APP_NAME}-title`);
      const profileImage = localStorage.getItem(`${APP_NAME}-profileImage`);
      const patientTypeName = localStorage.getItem(`${APP_NAME}-patientTypeName`);
      const firstName = localStorage.getItem(`${APP_NAME}-firstName``);
      const lastName = localStorage.getItem(`${APP_NAME}-lastName`);
      const email = localStorage.getItem(`${APP_NAME}-email`);
      const phone = localStorage.getItem(`${APP_NAME}-phone`);
      const phoneIsConfirmed = localStorage.getItem(`${APP_NAME}-phoneIsConfirmed`);
      const birthday = localStorage.getItem(`${APP_NAME}-birthday`);

      dispatch(authSuccess(null, null, {
        title,
        profile_image: profileImage,
        auth_key: authKey,
        patient_type_name: patientTypeName,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        phone_is_confirmed: phoneIsConfirmed,
        birthday
      }));
    }
  }
};

export const updateUserInfoStart = () => ({
  type: actionTypes.UPDATE_USER_INFO_START
});

export const updateUserInfoSuccess = authData => ({
  type: actionTypes.UPDATE_USER_INFO_SUCCESS,
  authData
});

export const updateUserInfoFail = (error) => ({
  type: actionTypes.UPDATE_USER_INFO_FAIL,
  error
});

export const updateUserInfo = (token, data) => dispatch => {
  dispatch(updateUserInfoStart());
  const options = {
    headers: {
      'X-ACCESS-TOKEN': token
    }
  };
  axios.post(`${API_URL}/user`, data, options)
    // eslint-disable-next-line promise/always-return
    .then(response => {
      localStorage.setItem(`${APP_NAME}-firstName`, response.data.first_name);
      localStorage.setItem(`${APP_NAME}-lastName`, response.data.last_name);
      localStorage.setItem(`${APP_NAME}-email`, response.data.email);
      localStorage.setItem(`${APP_NAME}-phone`, response.data.phone);
      localStorage.setItem(`${APP_NAME}-birthday`, response.data.birthday);

      dispatch(updateUserInfoSuccess(response.data));
    })
    .catch(error => {
      dispatch(updateUserInfoFail(error.response.data));
    });
};

export const getUserInfo = (token) => dispatch => {
  dispatch(updateUserInfoStart());
  const options = {
    headers: {
      'X-ACCESS-TOKEN': token
    }
  };
  axios.get(`${API_URL}/user`, options)
    // eslint-disable-next-line promise/always-return
    .then(response => {
      localStorage.setItem(`${APP_NAME}-firstName`, response.data.first_name);
      localStorage.setItem(`${APP_NAME}-lastName`, response.data.last_name);
      localStorage.setItem(`${APP_NAME}-email`, response.data.email);
      localStorage.setItem(`${APP_NAME}-phone`, response.data.phone);
      localStorage.setItem(`${APP_NAME}-birthday`, response.data.birthday);

      dispatch(updateUserInfoSuccess(response.data));
    })
    .catch(error => {
      dispatch(updateUserInfoFail(error.response.data));
    });
};
