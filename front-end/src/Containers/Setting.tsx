import React, { Fragment, MouseEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import '../styles/App.css';
import { LangSetting } from './LangSetting';

const SettingPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  a:link {
    text-decoration: none;
  }
  a:visited {
    text-decoration: none;
  }
`;

const Tab = styled.ul`
  display: flex;
  flex-direction: row;
  flex: 1;
  border-bottom-color: #bbbbbb;
  border-bottom-width: 1px;
  border-bottom-style: solid;
`;

const Setting: React.FC = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number>(0);
  const location = useLocation();

  const TabItem = styled(NavLink)`
    margin-right: 20px;
    color: ${({ selected }: { selected: boolean }) => (selected ? '#5e88d7' : '#000000')};
  `;

  const clickHandler = (index: number) => {
    setSelected(index);
  };

  useEffect(() => {
    const path = location.pathname;
    if (path.search(/lang/) !== -1) setSelected(0);
    else if (path.search(/etc/) !== -1) setSelected(1);
  }, []);

  return (
    <SettingPanel>
      <Tab>
        <TabItem selected={selected === 0} onClick={() => clickHandler(0)} to={'/setting/lang'}>
          {t('setting_lang')}
        </TabItem>

        <TabItem selected={selected === 1} onClick={() => clickHandler(1)} to={'/setting/etc'}>
          {t('setting_etc')}
        </TabItem>
      </Tab>
      <div>
        <Routes>
          <Route path={'lang'} element={<LangSetting />} />
          <Route path={'etc'} element={<span>기타</span>} />
        </Routes>
      </div>
    </SettingPanel>
  );
};

export default Setting;
