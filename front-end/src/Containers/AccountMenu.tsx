import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import '../styles/App.css';
import { AiOutlineUser } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { Login } from './Login';
import Register from './Register';
import { DropDown, Ul, Li } from '../Components/DropDown';
import Logout from './Logout';
import { LinkLiButton } from '../Components/Button';
import { HorizontalPanel } from '../Components/Panel';

const LoginDiv = styled.div`
  padding: 0px 4px;
  cursor: pointer;
  &:hover {
    color: black;
    background: #ffffff;
  }
`;

const RigsterDiv = styled.div`
  padding: 0px 4px;
  cursor: pointer;
  &:hover {
    color: black;
    background: #ffffff;
  }
`;

const GuestDiv = styled.div`
  display: flex;
  flexdirection: row;
`;

const Profile = styled(HorizontalPanel)`
  border-bottom-size: 1px;
  border-bottom-style: solid;
  border-bottom-color: #dddddd;
  padding-bottom: 10px;
  .icon {
    color: white;
    display: block;
  }
`;

const ProfileNick = styled.span`
  flex-grow: 1;
  font-weight: bold
  color: black;
  padding-left: 20px;
`;

const AccountSetting = styled(LinkLiButton)`
  text-decoration: none;
  color: black;
`;

const MemberDiv = styled.div`
  .icon {
    color: white;
    display: block;
    &:link {
      color: #ffffff;
      text-decoration: none;
    }
    &:visited {
      color: #ffffff;
      text-decoration: none;
    }
    &:hover {
      color: black;
      background: #ffffff;
    }
  }
`;

const GuestMenu = () => {
  const { t } = useTranslation();

  const [isLoginClick, setLoginClick] = useState(false);
  const [isRegisterClick, setRegisterClick] = useState(false);

  const clickLogin = () => {
    setLoginClick(true);
  };

  const clickRegister = () => {
    setRegisterClick(true);
  };

  return (
    <GuestDiv>
      <LoginDiv onClick={clickLogin}>
        <span>{t('login')}</span>
      </LoginDiv>
      <RigsterDiv onClick={clickRegister}>
        <span>{t('register')}</span>
      </RigsterDiv>
      {isLoginClick ? <Login setModalState={setLoginClick} /> : null}
      {isRegisterClick ? <Register setModalState={setRegisterClick} /> : null}
    </GuestDiv>
  );
};

const MemberMenu = () => {
  const { t } = useTranslation();
  const [nick, setNick] = useState('');

  useEffect(() => {
    const nick = localStorage.getItem('nick');

    if (nick) {
      setNick(nick);
    }
  }, []);

  return (
    <MemberDiv>
      <DropDown element={<AiOutlineUser className="icon" size={'27px'} />}>
        <Ul>
          <Li>
            <Profile>
              <AiOutlineUser className="icon" size={'27px'} />
              <ProfileNick>{nick}</ProfileNick>
            </Profile>
          </Li>
          <Li>
            <AccountSetting to={'/setting/account'}>{t('setting_account')}</AccountSetting>
          </Li>
          <Li>
            <Logout />
          </Li>
        </Ul>
      </DropDown>
    </MemberDiv>
  );
};

const AccountMenu = () => {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setIsLogin(localStorage.getItem('id') !== null);
  }, []);

  return isLogin ? <MemberMenu /> : <GuestMenu />;
};

export default AccountMenu;
