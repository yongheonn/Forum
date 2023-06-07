import React, { Dispatch, Fragment, SetStateAction, createContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { HorizontalPanel, VerticalPanel } from '../Components/Panel';
import { AjaxGetOption } from '../Modules/api_option';
import { refreshAccessToken } from './RefreshToken';
import { apiUrl } from '../Modules/api_url';
import { CreateSubject } from './CreateSubject';
import { Subject } from './Subject';

type SubjectT = {
  id: string;
  title: string;
  description: string;
  admin: string;
  btotal: number;
};

const TitleSpan = styled.span`
  justify-content: center;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  align-items: center;
  width: 200px;
  font-size: 20px;
  color: black;
`;

const AdminSpan = styled.span`
  justify-content: center;
  color: black;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  align-items: center;
  width: 250px;
  font-size: 16px;
`;

const DescSpan = styled.span`
  justify-content: center;
  display: block;
  color: black;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  align-items: center;
  font-size: 16px;
`;

const SubjectBox = styled(VerticalPanel)`
  &:hover {
    background: #66b2ff;
  }
  border-size: 1px;
  border-style: solid;
  border-color: #ddd;
`;

const SubjectLink = styled(Link)`
  &:link {
    color: #000000;
  }
  &:visited {
    color: #bbbbbb;
  }
  text-decoration: none;
  padding: 10px;
`;

// admin 권한이 있을시 subject 생성 메뉴 보이게 만들 예정

const SubjectIntro = ({ subject }: { subject: SubjectT }) => {
  const { t } = useTranslation();
  return (
    <Fragment>
      <SubjectBox>
        <TitleSpan>{subject.title + ' ' + t('subject')}</TitleSpan>
        <AdminSpan>{subject.admin}</AdminSpan>
        <DescSpan dangerouslySetInnerHTML={{ __html: subject.description }}></DescSpan>
      </SubjectBox>
    </Fragment>
  );
};

const WriteLink = styled(Link)`
  &:link {
    color: #000000;
  }
  &:visited {
    color: #000000;
  }
  &:hover {
    background: #66b2ff;
  }
  text-decoration: none;
  border-width: 1px;
  border-style: solid;
  border-color: #bbb;
  padding: 5px;
  margin-left: auto;
  float: right;
`;

const SubjectFooter = styled(HorizontalPanel)`
  padding: 8px;
  margin-top: 12px;
`;

const SubjectList = () => {
  const url = apiUrl + '/ajax/subject/all';

  const option: AjaxGetOption = {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
  };

  const [subjectList, setSubjectList] = useState([] as SubjectT[]);

  const getSubjectList = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) option.headers.Authorization = accessToken;
    const response = await fetch(url, option);

    if (response.status === 200) {
      setSubjectList((await response.json()) as SubjectT[]);
    } else if (response.status === 303) {
      refreshAccessToken(getSubjectList)
        .then(() => null)
        .catch(() => null);
    }
  };

  useEffect(() => {
    getSubjectList()
      .then(() => null)
      .catch(() => null);
  }, []);

  return (
    <Fragment>
      <VerticalPanel>
        {subjectList.map(subject => (
          <SubjectLink to={'board/' + subject.id} key={subject.id}>
            <SubjectIntro subject={subject} />
          </SubjectLink>
        ))}
        {localStorage.getItem('auth') === 'ROLE_ADMIN' ? (
          <SubjectFooter>
            <WriteLink to={'/create'}>주제 생성</WriteLink>
          </SubjectFooter>
        ) : null}
      </VerticalPanel>
    </Fragment>
  );
};

export const MainContext = createContext<{
  refreshSubject: number;
  setRefreshSubject: Dispatch<SetStateAction<number>>;
  refreshBoard: number;
  setRefreshBoard: Dispatch<SetStateAction<number>>;
  refreshBoardList: number;
  setRefreshBoardList: Dispatch<SetStateAction<number>>;
}>(
  {} as {
    refreshSubject: number;
    setRefreshSubject: Dispatch<SetStateAction<number>>;
    refreshBoard: number;
    setRefreshBoard: Dispatch<SetStateAction<number>>;
    refreshBoardList: number;
    setRefreshBoardList: Dispatch<SetStateAction<number>>;
  }
);

const Main = () => {
  const [refreshSubject, setRefreshSubject] = useState<number>(1);
  const [refreshBoard, setRefreshBoard] = useState<number>(1);
  const [refreshBoardList, setRefreshBoardList] = useState<number>(1);
  return (
    <Fragment>
      <MainContext.Provider
        value={{
          refreshBoard,
          setRefreshBoard,
          refreshBoardList,
          setRefreshBoardList,
          refreshSubject,
          setRefreshSubject,
        }}>
        <Routes>
          <Route path="" element={<SubjectList />} />
          <Route path="/create" element={<CreateSubject />} />
          <Route path="/board/:sid/*" element={<Subject />} />
        </Routes>
      </MainContext.Provider>
    </Fragment>
  );
};

export { Main };
