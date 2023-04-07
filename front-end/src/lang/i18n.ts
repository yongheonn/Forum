import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import langList from './langList';

import langEn from './translation/en.json';
import langKo from './translation/ko.json';

const resource = {
  english: {
    translation: langEn,
  },
  한국어: {
    translation: langKo,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources: resource,
    // 초기 설정 언어
    lng: '한국어',
    fallbackLng: langList,
    debug: true,
    defaultNS: 'translation',
    ns: 'translation',
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })
  .catch(err => {
    console.log(err);
  });

export default i18n;
