import React from 'react';
import { useTranslation } from 'react-i18next';
import { LiButton } from '../Components/Button';
import { AjaxPostOption } from '../Modules/api_option';
import { apiUrl } from '../Modules/api_url';

const Logout = () => {
  const { t } = useTranslation();

  const url = apiUrl + '/ajax/logout/';

  const option: AjaxPostOption = {
    method: 'POST',
    body: '',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
  };

  const requestLogout = async () => {
    const response = await fetch(url, option);
    if (response.status === 200) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('id');
      localStorage.removeItem('nick');
      localStorage.removeItem('email');
      localStorage.removeItem('auth');

      window.location.replace('/');
    } else {
      alert('오류가 발생했습니다.');
    }
  };

  const clickHandler = () => {
    requestLogout()
      .then(() => null)
      .catch(() => null);
  };

  return <LiButton onClick={() => clickHandler()}>{t('logout')}</LiButton>;
};

export default Logout;
