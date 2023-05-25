import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { HorizontalPanel, VerticalPanel } from '../Components/Panel';
import { AjaxPostOption } from '../Modules/api_option';
import { apiUrl } from '../Modules/api_url';
import { refreshAccessToken } from './RefreshToken';

const AccountPanel = styled(VerticalPanel)`
  border-style: solid;
  border-color: #dddddd;
  border-width: 1px;
  width: 100%;
`;

const IdPanel = styled(HorizontalPanel)`
  padding: 15px;
  grid-template-columns: ;
`;

const NickPanel = styled(HorizontalPanel)`
  border-style: solid;
  border-color: #dddddd;
  border-width: 1px 0px 0px 0px;
  padding: 15px;
`;

const EmailPanel = styled(HorizontalPanel)`
  border-style: solid;
  border-color: #dddddd;
  border-width: 1px 0px 0px 0px;
  padding: 15px;
`;

const AuthPanel = styled(HorizontalPanel)`
  border-style: solid;
  border-color: #dddddd;
  border-width: 1px 0px 0px 0px;
  padding: 15px;
`;

const SubmitPanel = styled(HorizontalPanel)`
  border-style: solid;
  border-color: #dddddd;
  border-width: 1px 0px 0px 0px;
  padding: 15px;
  background: #dddddd;
  justify-content: flex-end;
`;

const Id = styled.span`
  padding-right: 15px;
  width: 150px;
  padding: 5px 10px 5px 10px;
`;

const Nick = styled.span`
  padding-right: 15px;
  width: 150px;
  padding: 5px 10px 5px 10px;
`;

const Email = styled.span`
  padding-right: 15px;
  width: 150px;
  padding: 5px 10px 5px 10px;
`;

const Auth = styled.span`
  padding-right: 15px;
  width: 150px;
  padding: 5px 10px 5px 10px;
`;

const IdSpan = styled.span`
  border-style: solid;
  border-color: #dddddd;
  borde-width: 1px;
  flex-grow: 1;
  padding: 5px 10px 5px 10px;
  background: #dddddd;
`;

const NickInput = styled.input`
  border-style: solid;
  border-color: #dddddd;
  borde-width: 1px;
  flex-grow: 1;
  padding: 5px 10px 5px 10px;
  margin-bottom: 7px;
  font-size: 16px;
  height: 24px;
`;

const EmailSpan = styled.span`
  border-style: solid;
  border-color: #dddddd;
  borde-width: 1px;
  flex-grow: 1;
  padding: 5px 10px 5px 10px;
  background: #dddddd;
`;

const AuthSpan = styled.span`
  border-style: solid;
  border-color: #dddddd;
  borde-width: 1px;
  flex-grow: 1;
  padding: 5px 10px 5px 10px;
  background: #dddddd;
`;

const SubmitButton = styled.button`
  color: white;
  border-width: 0px;
  padding: 7px;
  font-size: 15px;
  cursor: ${({ changed }: { changed: boolean }) => (changed ? 'pointer' : 'not-allowed')};
  background: ${({ changed }: { changed: boolean }) => (changed ? '#66b2ff' : '#b0b0b0')};

  &:hover {
    background: ${({ changed }: { changed: boolean }) => (changed ? '#3399ff' : '#b0b0b0')};
  }
  &:active {
    background: ${({ changed }: { changed: boolean }) => (changed ? '#0080ff' : '#b0b0b0')};
  }
`;

const AccountInfo = () => {
  const url = apiUrl + '/ajax/account/update';
  const [id, setId] = useState('');
  const [nick, setNick] = useState('');
  const [nickInput, setNickInput] = useState('');
  const [email, setEmail] = useState('');
  const [auth, setAuth] = useState('');
  const [isChanged, setIsChanged] = useState(false);

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

  const nickChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickInput(e.target.value);
    if (nick === e.target.value) setIsChanged(false);
    else setIsChanged(true);
  };

  const onSubmitClickHandler = () => {
    submitAccountChange()
      .then(() => null)
      .catch(() => null);
  };

  const submitAccountChange = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) option.headers.Authorization = accessToken;
    option.body = JSON.stringify({ id: '', nick: nickInput, email: '', auth: -1 });
    const response = await fetch(url, option);

    if (response.status === 200) {
      setNick(nickInput);
      localStorage.setItem('nick', nickInput);
      setIsChanged(false);
      alert(nickInput + ' 반영 완료');
    } else if (response.status === 303) {
      refreshAccessToken(submitAccountChange)
        .then(() => null)
        .catch(() => null);
    } else if (response.status === 400) {
      alert('잘못된 요청입니다.');
    } else if (response.status === 401) {
      alert('로그인 해주세요.');
    }
  };

  useEffect(() => {
    const id = localStorage.getItem('id');
    const nick = localStorage.getItem('nick');
    const email = localStorage.getItem('email');
    const auth = localStorage.getItem('auth');

    if (id && nick && email && auth) {
      setId(id);
      setNickInput(nick);
      setNick(nick);
      setEmail(email);

      if (auth === 'ROLE_GUEST') setAuth('게스트 계정');
      else if (auth === 'ROLE_USER_NONCERT') setAuth('이메일 인증 안된 계정');
      else if (auth === 'ROLE_USER_CERT') setAuth('이메일 인증 완료된 계정');
      else if (auth === 'ROLE_ADMIN') setAuth('관리자 계정');
    }
  }, []);

  return (
    <Fragment>
      <h3>프로필 설정</h3>
      <AccountPanel>
        <IdPanel>
          <Id>아이디</Id>
          <IdSpan>{id}</IdSpan>
        </IdPanel>
        <NickPanel>
          <Nick>닉네임</Nick>
          <VerticalPanel>
            <NickInput type="text" maxLength={20} value={nickInput} onChange={nickChangeHandler} />
            <span>
              닉네임 변경이 가능합니다. 5~20자의 영문 대소문자, 숫자, 한글과 특수기호(_),(-)만 사용 가능합니다.
            </span>
          </VerticalPanel>
        </NickPanel>
        <EmailPanel>
          <Email>이메일</Email>
          <EmailSpan>{email}</EmailSpan>
        </EmailPanel>
        <AuthPanel>
          <Auth>권한</Auth>
          <AuthSpan>{auth}</AuthSpan>
        </AuthPanel>
        <SubmitPanel>
          <SubmitButton changed={isChanged} disabled={!isChanged} onClick={onSubmitClickHandler}>
            {' '}
            변경 내용 저장{' '}
          </SubmitButton>
        </SubmitPanel>
      </AccountPanel>
    </Fragment>
  );
};

export { AccountInfo };
