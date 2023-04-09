import React, { Fragment, useEffect } from 'react';
import Loading from '../Components/Loading';
import useInterval from '../Components/UseInterval';
import ModalPopup from '../Components/ModalPopup';
import { AjaxGetOption } from '../Modules/api_option';
import { apiUrl } from '../Modules/api_url';

const VerifyAuthLink = () => {
  let url = apiUrl + '/ajax/auth/email/verify?';

  const option: AjaxGetOption = {
    method: 'GET',
    'Access-Control-Expose-Headers': '*, Authorization',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
  };

  const verifyAuth = async () => {
    const nowUrl = window.location.href;
    const index = nowUrl.indexOf('email/');
    const urlInfo = nowUrl.slice(index + 6);
    const index2 = urlInfo.indexOf('/');
    const id = urlInfo.slice(0, index2);
    const key = urlInfo.slice(index2 + 1);
    url += 'id=' + id + '&key=' + key;
    const response = await fetch(url, option);
    if (response.status === 200) {
      const accessToken = response.headers.get('Authorization');
      if (typeof accessToken === 'string') localStorage.setItem('access_token', accessToken);
      window.location.href = '/';
    }
  };

  useEffect(() => {
    verifyAuth()
      .then(() => null)
      .catch(() => null);
  }, []);

  return <Fragment></Fragment>;
};

const LoadAuthState = () => {
  const url = apiUrl + '/ajax/auth/email/waiting';

  const option: AjaxGetOption = {
    method: 'GET',
    'Access-Control-Expose-Headers': '*, Authorization',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
  };

  const getAuthState = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) option.headers.Authorization = accessToken;
    const response = await fetch(url, option);
    if (response.status === 200) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      window.location.href = '/';
    }
    console.log('test');
  };

  useInterval(() => {
    getAuthState()
      .then(() => null)
      .catch(() => null);
  }, 5000);

  return (
    <Fragment>
      <Loading />
    </Fragment>
  );
};

const WaitEmailAuth = ({ setModalState }: { setModalState: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const clickHandler = () => {
    setModalState(false);
  };

  return (
    <ModalPopup _handleModal={() => clickHandler()}>
      <LoadAuthState />
    </ModalPopup>
  );
};

export { WaitEmailAuth, LoadAuthState, VerifyAuthLink };
