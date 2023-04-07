import React, { ChangeEvent, Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import i18next from '../lang/i18n';
import '../styles/App.css';
import langList from '../lang/langList';

const SettingItemPanel = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 100px 820px;
  column-gap: 24px;
`;

const SetLangDefault = () => {
  const lang = localStorage.getItem('lang');
  if (lang !== null) {
    i18next.changeLanguage(lang).catch(err => {
      console.log(err);
    });
  }
};

const LangSetting: React.FC = () => {
  const { t } = useTranslation();

  const [selected, setSelected] = useState(langList[0]);

  const changeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    i18next.changeLanguage(selectedLang).catch(err => {
      console.log(err);
    });
    setSelected(selectedLang);
    localStorage.setItem('lang', selectedLang);
  };

  const langListSet: React.ReactNode = langList.map(lang => (
    <option value={lang} key={lang}>
      {lang}
    </option>
  ));

  useEffect(() => {
    const lang = localStorage.getItem('lang');
    if (lang !== null) {
      setSelected(lang);
      i18next.changeLanguage(lang).catch(err => {
        console.log(err);
      });
    }
  }, []);

  return (
    <Fragment>
      <select onChange={changeHandler} value={selected}>
        {langListSet}
      </select>
    </Fragment>
  );
};

export { LangSetting, SetLangDefault };
