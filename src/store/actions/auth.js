import axios from 'axios';
import * as actionTypes from './actionTypes';
import { API_URL } from '../../utils/const';

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
  localStorage.removeItem('thc-react-menu-key-expiration-date');
  localStorage.removeItem('thc-react-menu-title');
  localStorage.removeItem('thc-react-menu-profileImage');
  localStorage.removeItem('thc-react-menu-authKey');
  localStorage.removeItem('thc-react-menu-patientTypeName');
  localStorage.removeItem('thc-react-menu-firstName');
  localStorage.removeItem('thc-react-menu-lastName');
  localStorage.removeItem('thc-react-menu-email');
  localStorage.removeItem('thc-react-menu-phone');
  localStorage.removeItem('thc-react-menu-phoneIsConfirmed');
  localStorage.removeItem('thc-react-menu-birthday');

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
      localStorage.setItem('thc-react-menu-key-expiration-date', expirationDate);
      localStorage.setItem('thc-react-menu-title', response.data.title);
      localStorage.setItem('thc-react-menu-profileImage', response.data.profile_image);
      localStorage.setItem('thc-react-menu-authKey', response.data.auth_key);
      localStorage.setItem('thc-react-menu-patientTypeName', response.data.patient_type_name);
      localStorage.setItem('thc-react-menu-firstName', response.data.first_name);
      localStorage.setItem('thc-react-menu-lastName', response.data.last_name);
      localStorage.setItem('thc-react-menu-email', response.data.email);
      localStorage.setItem('thc-react-menu-phone', response.data.phone);
      localStorage.setItem('thc-react-menu-phoneIsConfirmed', response.data.phone_is_confirmed);
      localStorage.setItem('thc-react-menu-birthday', response.data.birthday);

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
  const authKey = localStorage.getItem('thc-react-menu-authKey');
  if (!authKey) {
    dispatch(logout());
  } else {
    const expirationDate = new Date(localStorage.getItem('thc-react-menu-key-expiration-date'));

    if (expirationDate <= new Date()) {
      dispatch(logout());
    } else {
      const title = localStorage.getItem('thc-react-menu-title');
      const profileImage = localStorage.getItem('thc-react-menu-profileImage');
      const patientTypeName = localStorage.getItem('thc-react-menu-patientTypeName');
      const firstName = localStorage.getItem('thc-react-menu-firstName');
      const lastName = localStorage.getItem('thc-react-menu-lastName');
      const email = localStorage.getItem('thc-react-menu-email');
      const phone = localStorage.getItem('thc-react-menu-phone');
      const phoneIsConfirmed = localStorage.getItem('thc-react-menu-phoneIsConfirmed');
      const birthday = localStorage.getItem('thc-react-menu-birthday');

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
      localStorage.setItem('thc-react-menu-firstName', response.data.first_name);
      localStorage.setItem('thc-react-menu-lastName', response.data.last_name);
      localStorage.setItem('thc-react-menu-email', response.data.email);
      localStorage.setItem('thc-react-menu-phone', response.data.phone);
      localStorage.setItem('thc-react-menu-birthday', response.data.birthday);

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
      localStorage.setItem('thc-react-menu-firstName', response.data.first_name);
      localStorage.setItem('thc-react-menu-lastName', response.data.last_name);
      localStorage.setItem('thc-react-menu-email', response.data.email);
      localStorage.setItem('thc-react-menu-phone', response.data.phone);
      localStorage.setItem('thc-react-menu-birthday', response.data.birthday);

      dispatch(updateUserInfoSuccess(response.data));
    })
    .catch(error => {
      dispatch(updateUserInfoFail(error.response.data));
    });
};
