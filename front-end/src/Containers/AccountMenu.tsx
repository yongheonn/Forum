import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import '../styles/App.css';
import { AiOutlineUser } from 'react-icons/ai';
import Login from './Login';
import Register from './Register';
import { DropDown, Ul, Li } from '../Components/DropDown';
import Logout from './Logout';

const LoginDiv = styled.div`
  padding: 0px 4px;
`;

const RigsterDiv = styled.div`
  padding: 0px 4px;
`;

const GuestDiv = styled.div`
  display: flex;
  flexdirection: row;
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

  // eslint-disable-next-line class-methods-use-this
  return (
    <GuestDiv>
      <LoginDiv onClick={clickLogin} style={{ cursor: 'pointer' }}>
        <span>{t('login')}</span>
      </LoginDiv>
      <RigsterDiv onClick={clickRegister} style={{ cursor: 'pointer' }}>
        <span>{t('register')}</span>
      </RigsterDiv>
      {isLoginClick ? <Login setModalState={setLoginClick} /> : null}
      {isRegisterClick ? <Register setModalState={setRegisterClick} /> : null}
    </GuestDiv>
  );
};

class MemberMenu extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  render(): React.ReactNode {
    return (
      <DropDown element={<AiOutlineUser />}>
        <Ul>
          <Li>
            <Logout />
          </Li>
          <Li>
            <span>2</span>
          </Li>
        </Ul>
      </DropDown>
    );
  }
}

const AccountMenu = () => {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setIsLogin(localStorage.getItem('access_token') !== null);
  }, []);

  return isLogin ? <MemberMenu /> : <GuestMenu />;
};

export default AccountMenu;
