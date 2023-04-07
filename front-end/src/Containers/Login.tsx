import React, { Dispatch, ErrorInfo, Fragment, SetStateAction, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Navigate, useNavigate } from 'react-router-dom';
import '../styles/App.css';
import { useTranslation } from 'react-i18next';
import ModalPopup from '../Components/ModalPopup';
import { AjaxPostOption } from '../Modules/api_option';
import { apiUrl } from '../Modules/api_url';

const Form = styled.form`
  color: #000000 !important;
`;
type UserData = {
  id: string;
  nick: string;
  email: string;
  auth: number;
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
    'Access-Control-Expose-Headers': '*, Authorization',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
  };

  const getToken = async () => {
    const response = await fetch(url, option);
    if (response.status === 200) {
      const accessToken = response.headers.get('Authorization');
      if (typeof accessToken === 'string') localStorage.setItem('access_token', accessToken);
      const data: UserData = (await response.json()) as UserData;
      localStorage.setItem('id', data.id);
      localStorage.setItem('nick', data.nick);
      localStorage.setItem('email', data.email);
      localStorage.setItem('auth', data.auth.toString());
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

export default Login;
