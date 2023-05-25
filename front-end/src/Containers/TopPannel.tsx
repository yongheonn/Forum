import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { AiOutlineSetting } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { HorizontalPanel } from '../Components/Panel';
import AccountMenu from './AccountMenu';

const NavBar = styled(HorizontalPanel)`
  color: #ffffff;
  background-color: #3d414d;
  padding: 7px 20px 7px 20px;
  font-size: 20px;
`;

const HomeLink = styled(Link)`
  margin-right: auto;
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
`;

const SettingLink = styled(Link)`
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
`;

const TopPannel = () => {
  const { t } = useTranslation();
  const temp = () => {
    alert('');
  };

  return (
    <NavBar>
      <HomeLink to={'/'}> Home </HomeLink>
      <SettingLink to={'/setting/lang'}>
        <AiOutlineSetting />
        {t('setting')}
      </SettingLink>
      <AccountMenu />
    </NavBar>
  );
};

export default TopPannel;
