import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { VerticalPanel } from '../Components/Panel';
import { AjaxGetOption } from '../Modules/api_option';
import { refreshAccessToken } from './RefreshToken';
import { apiUrl } from '../Modules/api_url';

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
  color: black;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  align-items: center;
  width: 250px;
  font-size: 16px;
`;

const SubjectBox = styled(VerticalPanel)`
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
`;

// admin 권한이 있을시 subject 생성 메뉴 보이게 만들 예정

const SubjectIntro = ({ subject }: { subject: SubjectT }) => {
  const { t } = useTranslation();
  return (
    <Fragment>
      <SubjectBox>
        <TitleSpan>{subject.title + ' ' + t('subject')}</TitleSpan>
        <AdminSpan>{subject.admin}</AdminSpan>
        <DescSpan>{subject.description}</DescSpan>
      </SubjectBox>
    </Fragment>
  );
};

const SubjectList = () => {
  const url = apiUrl + '/ajax/subject/all';

  const option: AjaxGetOption = {
    method: 'GET',
    'Access-Control-Expose-Headers': '*, Authorization',
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
      </VerticalPanel>
    </Fragment>
  );
};

const Main = () => {
  let i;
  return (
    <Fragment>
      <SubjectList></SubjectList>
    </Fragment>
  );
};

export { Main };
