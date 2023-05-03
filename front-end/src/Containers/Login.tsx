import React, { Dispatch, ErrorInfo, Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import '../styles/App.css';
import { useTranslation } from 'react-i18next';
import ModalPopup from '../Components/ModalPopup';
import { AjaxGetOption, AjaxPostOption } from '../Modules/api_option';
import { apiUrl } from '../Modules/api_url';

const Form = styled.form`
  color: #000000 !important;
`;

const Google = styled.img`
  width: 177px;
  height: 43px;
`;

const Naver = styled.img`
  width: 177px;
  height: 43px;
`;

const Kakao = styled.img`
  width: 177px;
  height: 43px;
`;

type UserData = {
  id: string;
  nick: string;
  email: string;
  auth: number;
};

const OAuthLogin = () => {
  const url = apiUrl + '/ajax/login/oauth';
  const [searchParams, setSearchParams] = useSearchParams();

  const option: AjaxGetOption = {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
  };

  const getLoginInfo = async () => {
    const accessToken = searchParams.get('access_token');
    if (accessToken !== null) localStorage.setItem('access_token', accessToken);
    if (accessToken) option.headers.Authorization = accessToken;
    const response = await fetch(url, option);
    if (response.status === 200) {
      const data: UserData = (await response.json()) as UserData;
      localStorage.setItem('id', data.id);
      localStorage.setItem('nick', data.nick);
      localStorage.setItem('email', data.email);
      let auth = '';
      if (data.auth === 0) auth = 'ROLE_GUEST';
      else if (data.auth === 1) auth = 'ROLE_USER_NONCERT';
      else if (data.auth === 2) auth = 'ROLE_USER_CERT';
      else if (data.auth === 3) auth = 'ROLE_ADMIN';
      localStorage.setItem('auth', auth);
    } else if (response.status === 404) {
      alert('오류가 발생했습니다');
    } else {
      alert('오류가 발생했습니다');
    }

    window.location.replace('/');
  };
  useEffect(() => {
    getLoginInfo()
      .then(() => null)
      .catch(() => null);
  }, []);
  return <Fragment />;
};

const OAuthLoginError = () => {
  useEffect(() => {
    alert('오류가 발생했습니다');
    window.location.replace('/');
  }, []);
  return <Fragment />;
};

const LoginForm = () => {
  const url = apiUrl + '/ajax/login/';
  const { t } = useTranslation();

  const [values, setValues] = useState({
    id: '',
    pw: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const option: AjaxPostOption = {
    method: 'POST',
    body: JSON.stringify(values),
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
  };

  const getToken = async () => {
    const response = await fetch(url, option);
    if (response.status === 200) {
      const data: UserData = (await response.json()) as UserData;
      const accessToken = response.headers.get('Authorization');
      if (accessToken !== null) localStorage.setItem('access_token', accessToken);
      localStorage.setItem('id', data.id);
      localStorage.setItem('nick', data.nick);
      localStorage.setItem('email', data.email);
      let auth = '';
      if (data.auth === 0) auth = 'ROLE_GUEST';
      else if (data.auth === 1) auth = 'ROLE_USER_NONCERT';
      else if (data.auth === 2) auth = 'ROLE_USER_CERT';
      else if (data.auth === 3) auth = 'ROLE_ADMIN';
      localStorage.setItem('auth', auth);
    } else if (response.status === 404) {
      return '아이디 또는 비밀번호를 잘못 입력했습니다. 입력한 내용을 다시 확인해주세요.';
    } else {
      return t('msg_error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    getToken()
      .then(err => {
        if (typeof err === 'string') setError(err);
        else window.location.replace('/'); // 에러가 없으면 메인 화면으로 새로고침
      })
      .catch(e => {
        console.error(e);
        setError(t('msg_error'));
      });
  };

  return (
    <Fragment>
      <Form onSubmit={handleSubmit}>
        <h3>
          <label htmlFor="id">{t('login_id')}</label>
        </h3>
        <input type="text" name="id" maxLength={20} placeholder={t('login_id_holder')} onChange={handleChange} />

        <h3>
          <label htmlFor="pw">{t('login_pw')}</label>
        </h3>
        <input type="password" name="pw" maxLength={20} placeholder={t('login_pw_holder')} onChange={handleChange} />
        <span className="error_next_box" id="errorMsg" aria-live="assertive">
          {error}
        </span>
        <br />
        <br />
        <button type="submit">
          <span>{t('login_submit')}</span>
        </button>
      </Form>
      <a href={apiUrl + '/oauth2/authorization/google'}>
        <Google src="/img/oauth-google.png" />
      </a>
      <a href={apiUrl + '/oauth2/authorization/naver'}>
        <Naver src="/img/oauth-naver.png" />
      </a>
      <a href={apiUrl + '/oauth2/authorization/kakao'}>
        <Kakao src="/img/oauth-kakao.png" />
      </a>
    </Fragment>
  );
};

const Login = ({ setModalState }: { setModalState: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const clickHandler = () => {
    setModalState(false);
  };

  return (
    <ModalPopup _handleModal={() => clickHandler()}>
      <LoginForm />
    </ModalPopup>
  );
};

export { Login, OAuthLogin, OAuthLoginError };
