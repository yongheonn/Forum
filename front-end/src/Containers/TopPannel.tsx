import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { AiOutlineSetting } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { HorizontalPanel } from '../Components/Panel';
import AccountMenu from './AccountMenu';
import { Notice } from './Notice';

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

const NoticeDiv = styled.div`
  margin: 0 auto;
  padding: 0px 4px;
  cursor: pointer;
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
  const [noticeClick, setNoticeClick] = useState(false);
  const temp = () => {
    alert('');
  };

  const clickhandler = () => {
    setNoticeClick(true);
  };

  return (
    <Fragment>
      <NavBar>
        <HomeLink to={'/'}> Home </HomeLink>
        <NoticeDiv onClick={clickhandler}>공지사항</NoticeDiv>
        <SettingLink to={'/setting/lang'}>
          <AiOutlineSetting />
          {t('setting')}
        </SettingLink>
        <AccountMenu />
      </NavBar>
      {noticeClick ? <Notice setModalState={setNoticeClick} /> : null}
    </Fragment>
  );
};

export default TopPannel;
