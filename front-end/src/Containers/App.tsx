import React, { createContext, Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { matchPath, Route, Routes, useParams } from 'react-router-dom';
import '../styles/App.css';
import { isMobile } from 'react-device-detect';
import Setting from './Setting';
import TopPannel from './TopPannel';
import { VerifyAuthLink } from './WaitEmailAuth';
import { Main } from './Main';
import { SetLangDefault } from './LangSetting';
import BottomPanel from './BottomPanel';
import { CreateSubject } from './CreateSubject';

if (process.env.REACT_APP_ENV === 'production') {
  console.log = () => null;
  console.warn = () => null;
  console.error = () => null;
}
const MainPanel = styled.div`
  max-width: 1300px;
  display: grid;
  grid-template-columns: ${isMobile ? '100%' : '0.7fr'};
  margin: auto;
`;

const MainArticle = styled.article`
  background-color: #ffffff;
  border-style: solid;
  min-height: 100vh;
  border-width: 1px;
  border-color: #bbbbbb;
  overflow: hidden;
  padding: 15px;
`;
/**
 * @todo redux 방식 공부(flux 패턴)
 */
export const AppContext = createContext<Dispatch<SetStateAction<HTMLInputElement | null>>>(
  {} as Dispatch<SetStateAction<HTMLInputElement | null>>
);

const App: React.FC = () => {
  const { t } = useTranslation();
  {
    console.log('test start');
  }

  const [ele, setEle] = useState<HTMLInputElement | null>(null);

  const handleClick = () => {
    console.log(ele);
    if (ele !== null) {
      ele.focus();
      ele.click();
    }
  };

  useEffect(() => {
    SetLangDefault();
  }, []);

  return (
    <Fragment>
      <TopPannel />
      <MainPanel>
        <MainArticle onClick={handleClick}>
          <AppContext.Provider value={setEle}>
            {/*
            ErrorPage를 여기에 구현 예정 아래 
            */}
            <Routes>
              <Route path="/*" element={<Main />} />
              <Route path="/setting/*" element={<Setting />} />
              <Route path="/auth/email/*" element={<VerifyAuthLink />} />
            </Routes>
          </AppContext.Provider>
        </MainArticle>
      </MainPanel>
      <BottomPanel />
    </Fragment>
  );
};

export default App;
