import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { AiOutlineSetting } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { HorizontalPanel } from '../Components/Panel';
import AccountMenu from './AccountMenu';

const NavBar = styled(HorizontalPanel)`
  a:link {
    color: #ffffff;
    text-decoration: none;
  }
  a:visited {
    color: #ffffff;
    text-decoration: none;
  }
  color: #ffffff;
  background-color: #3d414d;
  padding: 7px;
`;

const HomeLink = styled(Link)`
  margin-right: auto;
`;

const TopPannel = () => {
  const { t } = useTranslation();
  const temp = () => {
    alert('');
  };

  return (
    <NavBar>
      <HomeLink to={'/'}> Home </HomeLink>
      <Link to={'/setting/lang'}>
        <AiOutlineSetting />
        {t('setting')}
      </Link>
      <AccountMenu />
    </NavBar>
  );
};

export default TopPannel;
