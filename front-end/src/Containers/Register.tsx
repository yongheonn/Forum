import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import '../styles/App.css';
import { useTranslation } from 'react-i18next';
import ModalPopup from '../Components/ModalPopup';
import { AjaxPostOption } from '../Modules/api_option';
import { LoadAuthState } from './WaitEmailAuth';
import { apiUrl } from '../Modules/api_url';

type FormDataType = { id: string; pw: string; pwRe: string; nick: string; email: string };
type FormValidType = { id: boolean; pw: boolean; pwRe: boolean; nick: boolean; email: boolean };

const IdForm = ({
  values,
  valid,
  setValues,
  setValid,
}: {
  values: FormDataType;
  valid: FormValidType;
  setValues: React.Dispatch<React.SetStateAction<FormDataType>>;
  setValid: React.Dispatch<React.SetStateAction<FormValidType>>;
}) => {
  const url = apiUrl + '/ajax/register/id-exist';
  const [msg, setMsg] = useState('');
  const { t } = useTranslation();

  const option: AjaxPostOption = {
    method: 'POST',
    body: '',
    'Access-Control-Expose-Headers': '*, Authorization',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });

    setValid({
      ...valid,
      [e.target.name]: isValid(e.target.value),
    });
  };

  const isValid = (value: string) => {
    if (isEmpty(value)) return false;
    if (!isValidRegExp(value)) return false;
    return checkIsValid(value).then(isDuplicate => !isDuplicate);
  };

  const isEmpty = (value: string) => {
    if (value !== '') return false;
    setMsg('필수 정보입니다.');
    return true;
  };

  const isValidRegExp = (value: string) => {
    const regExp = /^[a-z0-9_-]{5,20}$/;
    const isMatch = regExp.test(value);
    if (isMatch) return true;
    setMsg('5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.');

    return false;
  };

  const checkIsValid = async (value: string) => {
    option.body = JSON.stringify({ id: value });
    const response = await fetch(url, option);
    if (response.status === 200) {
      try {
        const isDuplicate: boolean = (await response.json()) as boolean;
        if (typeof isDuplicate !== 'boolean') throw new Error();
        isDuplicate ? setMsg('이미 사용중이거나 탈퇴한 아이디입니다.') : setMsg('사용 가능한 아이디입니다.');
        return isDuplicate;
      } catch (e) {
        setMsg(t('msg_error'));
        console.error(e);
      }
    } else {
      setMsg(t('msg_error'));
    }
  };

  return (
    <Fragment>
      <h3>
        <label htmlFor="id">{t('register_id')}</label>
      </h3>
      <input type="text" name="id" maxLength={20} placeholder={t('register_id_holder')} onChange={changeHandler} />
      <span aria-live="assertive">{msg}</span>
    </Fragment>
  );
};

const PwForm = ({
  values,
  valid,
  setValues,
  setValid,
}: {
  values: FormDataType;
  valid: FormValidType;
  setValues: React.Dispatch<React.SetStateAction<FormDataType>>;
  setValid: React.Dispatch<React.SetStateAction<FormValidType>>;
}) => {
  const [msg, setMsg] = useState('');
  const { t } = useTranslation();

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });

    setValid({
      ...valid,
      [e.target.name]: isValid(e.target.value),
    });
  };

  const isValid = (value: string) => {
    if (isEmpty(value)) return false;
    if (!isValidRegExp(value)) return false;
    return true;
  };

  const isEmpty = (value: string) => {
    if (value !== '') return false;
    setMsg('필수 정보입니다.');
    return true;
  };

  const isValidRegExp = (value: string) => {
    const regExp = /^[a-zA-Z0-9{}[\]/?.,;:|)*~`!^\-_+<>@#$%&\\=('"]{8,16}$/;
    const isMatch = regExp.test(value);
    isMatch ? setMsg('사용 가능한 비밀번호입니다.') : setMsg('8~16자 영문 대소문자, 숫자, 특수문자를 사용하세요.');

    return isMatch;
  };

  return (
    <Fragment>
      <h3>
        <label htmlFor="pw">{t('register_pw')}</label>
      </h3>
      <input type="text" name="pw" maxLength={20} placeholder={t('register_pw_holder')} onChange={changeHandler} />
      <span aria-live="assertive">{msg}</span>
    </Fragment>
  );
};

const PwReForm = ({
  values,
  valid,
  setValues,
  setValid,
}: {
  values: FormDataType;
  valid: FormValidType;
  setValues: React.Dispatch<React.SetStateAction<FormDataType>>;
  setValid: React.Dispatch<React.SetStateAction<FormValidType>>;
}) => {
  const [msg, setMsg] = useState('');

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
    setValid({
      ...valid,
      [e.target.name]: isValid(values.pw, e.target.value),
    });
  };

  const isValid = (value: string, valueRe: string) => {
    if (isEmpty(value)) return false;
    if (!isEqual(value, valueRe)) return false;
    return true;
  };

  const isEmpty = (value: string) => {
    if (value !== '') return false;
    setMsg('필수 정보입니다.');
    return true;
  };

  const isEqual = (value: string, valueRe: string) => {
    const isEqual = value === valueRe;
    isEqual ? setMsg('비밀번호가 일치합니다.') : setMsg('비밀번호가 일치하지 않습니다.');

    return isEqual;
  };

  return (
    <Fragment>
      <h3>
        <label htmlFor="pwRe">비밀번호 재입력</label>
      </h3>
      <input type="text" name="pwRe" maxLength={20} placeholder="비밀번호 재입력" onChange={changeHandler} />
      <span aria-live="assertive">{msg}</span>
    </Fragment>
  );
};

const NickForm = ({
  values,
  valid,
  setValues,
  setValid,
}: {
  values: FormDataType;
  valid: FormValidType;
  setValues: React.Dispatch<React.SetStateAction<FormDataType>>;
  setValid: React.Dispatch<React.SetStateAction<FormValidType>>;
}) => {
  const url = apiUrl + '/ajax/register/nick-exist';
  const [msg, setMsg] = useState('');
  const { t } = useTranslation();

  const option: AjaxPostOption = {
    method: 'POST',
    body: '',
    'Access-Control-Expose-Headers': '*, Authorization',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
    setValid({
      ...valid,
      [e.target.name]: isValid(e.target.value),
    });
  };

  const isValid = (value: string) => {
    if (isEmpty(value)) return false;
    if (!isValidRegExp(value)) return false;
    return checkIsDuplicate(value).then(isDuplicate => !isDuplicate);
  };

  const isEmpty = (value: string) => {
    if (value !== '') return false;
    setMsg('필수 정보입니다.');
    return true;
  };

  const isValidRegExp = (value: string) => {
    const regExp = /^[a-zA-Z0-9_\-ㄱ-ㅎㅏ-ㅣ가-힣]{5,20}$/;
    const isMatch = regExp.test(value);
    if (isMatch) return true;
    setMsg('5~20자의 영문 대소문자, 숫자, 한글과 특수기호(_),(-)만 사용 가능합니다.');

    return false;
  };

  const checkIsDuplicate = async (value: string) => {
    option.body = JSON.stringify({ nick: value });
    const response = await fetch(url, option);
    if (response.status === 200) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const isDuplicate: boolean = await response.json();
        if (typeof isDuplicate !== 'boolean') throw new Error();
        isDuplicate ? setMsg('이미 사용중인 닉네임입니다.') : setMsg('사용 가능한 닉네임입니다.');
        return isDuplicate;
      } catch (e) {
        setMsg(t('msg_error'));
        console.error(e);
      }
    }
  };

  return (
    <Fragment>
      <h3>
        <label htmlFor="nick">닉네임</label>
      </h3>
      <input type="text" name="nick" maxLength={20} placeholder="닉네임 입력" onChange={changeHandler} />
      <span aria-live="assertive">{msg}</span>
    </Fragment>
  );
};

const EmailForm = ({
  values,
  valid,
  setValues,
  setValid,
}: {
  values: FormDataType;
  valid: FormValidType;
  setValues: React.Dispatch<React.SetStateAction<FormDataType>>;
  setValid: React.Dispatch<React.SetStateAction<FormValidType>>;
}) => {
  const url = apiUrl + '/ajax/register/email-exist';
  const [msg, setMsg] = useState('');
  const { t } = useTranslation();

  const option: AjaxPostOption = {
    method: 'POST',
    body: '',
    'Access-Control-Expose-Headers': '*, Authorization',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
    setValid({
      ...valid,
      [e.target.name]: isValid(e.target.value),
    });
  };

  const isValid = (value: string) => {
    if (isEmpty(value)) return false;
    if (!isValidRegExp(value)) return false;
    return checkIsDuplicate(value).then(isDuplicate => !isDuplicate);
  };

  const isEmpty = (value: string) => {
    if (value !== '') return false;
    setMsg('필수 정보입니다.');
    return true;
  };

  const isValidRegExp = (value: string) => {
    const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]+$/i;
    const isMatch = regExp.test(value);
    if (isMatch) return true;
    setMsg('올바른 이메일을 입력해주세요.');

    return false;
  };

  const checkIsDuplicate = async (value: string) => {
    option.body = JSON.stringify({ email: value });
    const response = await fetch(url, option);
    if (response.status === 200) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const isDuplicate: boolean = await response.json();
        if (typeof isDuplicate !== 'boolean') throw new Error();
        isDuplicate ? setMsg('이미 사용중이거나 탈퇴한 이메일입니다.') : setMsg('사용 가능한 이메일입니다.');
        return isDuplicate;
      } catch (e) {
        setMsg(t('msg_error'));
        console.error(e);
      }
    }
  };

  return (
    <Fragment>
      <h3>
        <label htmlFor="email">이메일</label>
      </h3>
      <input type="text" name="email" maxLength={50} placeholder="ex: abc@def.com" onChange={changeHandler} />
      <span aria-live="assertive">{msg}</span>
    </Fragment>
  );
};

type UserData = {
  id: string;
  nick: string;
  email: string;
  auth: number;
};

const Form = styled.form`
  color: #000000 !important;
`;

const RegisterForm = ({ setOnEmailAuth }: { setOnEmailAuth: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const url = apiUrl + '/ajax/register/';
  const emailUrl = apiUrl + '/ajax/auth/email/';
  const { t } = useTranslation();

  const [values, setValues] = useState({
    id: '',
    pw: '',
    pwRe: '',
    nick: '',
    email: '',
  });

  const [valid, setValid] = useState({
    id: false,
    pw: false,
    pwRe: false,
    nick: false,
    email: false,
  });

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

  const register = async () => {
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
      await emailAuth();
    } else if (response.status === 400) {
      console.error('400 err');
    }
  };

  const emailAuth = async () => {
    option.body = '';
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) option.headers.Authorization = accessToken;
    const response = await fetch(emailUrl, option);
    if (response.status === 200) {
      setOnEmailAuth(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isAllValid = valid.id && valid.pw && valid.pwRe && valid.nick && valid.email;
    if (isAllValid) {
      register()
        .then(() => null)
        .catch(() => null);
    }
  };

  return (
    <Fragment>
      <Form onSubmit={handleSubmit}>
        <IdForm values={values} valid={valid} setValues={setValues} setValid={setValid} />
        <PwForm values={values} valid={valid} setValues={setValues} setValid={setValid} />
        <PwReForm values={values} valid={valid} setValues={setValues} setValid={setValid} />
        <NickForm values={values} valid={valid} setValues={setValues} setValid={setValid} />
        <EmailForm values={values} valid={valid} setValues={setValues} setValid={setValid} />

        <br />
        <br />
        <br />
        <br />
        <button type="submit">
          <span>{t('register_submit')}</span>
        </button>
      </Form>
    </Fragment>
  );
};

// eslint-disable-next-line arrow-body-style
const Register = ({ setModalState }: { setModalState: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [onEmailAuth, setOnEmailAuth] = useState(false);

  const clickHandler = () => {
    setModalState(false);
  };

  return (
    <ModalPopup _handleModal={() => clickHandler()}>
      {onEmailAuth ? <LoadAuthState /> : <RegisterForm setOnEmailAuth={setOnEmailAuth} />}
    </ModalPopup>
  );
};

export default Register;
