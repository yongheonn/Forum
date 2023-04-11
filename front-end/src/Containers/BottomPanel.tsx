import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { HorizontalPanel, VerticalPanel } from '../Components/Panel';

const NavBar = styled(VerticalPanel)`
  color: #ffffff;
  background-color: #3d414d;
  padding: 7px;
`;

const Email = styled.span`
  margin: auto;
`;
const Github = styled.a`
  color: blue !important;
  &:link {
    text-decoration: none;
  }

  &:visited {
    text-decoration: none;
  }

  &:hover {
    text-decoration: underline;
  }
`;

const Blog = styled.a`
  color: blue !important;
  &:link {
    text-decoration: none;
  }

  &:visited {
    text-decoration: none;
  }

  &:hover {
    text-decoration: underline;
  }

  margin-left: 10px;
`;

const BottomPanel = () => {
  const { t } = useTranslation();
  const temp = () => {
    alert('');
  };

  return (
    <NavBar>
      <Email>연락 이메일:&nbsp; yongheonn99@gmail.com</Email>
      <HorizontalPanel style={{ margin: 'auto' }}>
        <Github href={'https://github.com/yongheonn/Forum'}>GitHub</Github>
        <Blog href={'https://yongheonn.github.io/'}>Blog</Blog>
      </HorizontalPanel>
    </NavBar>
  );
};

export default BottomPanel;
