import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { HorizontalPanel } from '../Components/Panel';
import { AjaxPostOption } from '../Modules/api_option';
import { refreshAccessToken } from './RefreshToken';
import { apiUrl } from '../Modules/api_url';
import { MainContext } from './Main';

type SubjectT = {
  id: string;
  title: string;
  description: string;
  admin: string;
  btotal: number;
};

const Header = styled.div`
  background-color: #eee;
  border-color: #bbb;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  padding: 8px;
  margin-bottom: 10px;
`;

const IdPanel = styled(HorizontalPanel)`
  border-color: #bbb;
  border-width: 1px;
  border-style: solid;
  margin-bottom: 20px;
`;

const Id = styled.span`
  border-color: #000;
  border-right-width: 1px;
  border-right-style: solid;
  padding: 8px;
  white-space: nowrap;
`;

const IdInput = styled.input`
  padding-left: 8px;
  border-width: 0px;
  width: 100%;
`;

const TitlePanel = styled(HorizontalPanel)`
  border-color: #bbb;
  border-width: 1px;
  border-style: solid;
  margin-bottom: 20px;
`;

const Title = styled.span`
  border-color: #000;
  border-right-width: 1px;
  border-right-style: solid;
  padding: 8px;
  white-space: nowrap;
`;

const TitleInput = styled.input`
  padding-left: 8px;
  border-width: 0px;
  width: 100%;
`;

const AdminPanel = styled(HorizontalPanel)`
  border-color: #bbb;
  border-width: 1px;
  border-style: solid;
  margin-bottom: 20px;
`;

const Admin = styled.span`
  border-color: #000;
  border-right-width: 1px;
  border-right-style: solid;
  padding: 8px;
  white-space: nowrap;
`;

const AdminInput = styled.input`
  padding-left: 8px;
  border-width: 0px;
  width: 100%;
`;

const DescriptionPanel = styled.div`
  border-color: #bbb;
  border-width: 1px;
  border-style: solid;
  height: 500px;
  padding: 20px;
  outline: none;
  overflow: scroll;
`;

const CreateSubject = () => {
  const url = apiUrl + '/ajax/subject/regi';
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshSubject, setRefreshSubject } = useContext(MainContext); // board 새로고침을 위한

  const [subjectInput, setSubjectInput] = useState<{ id: string; title: string; description: string; admin: string }>({
    id: '',
    title: '',
    description: '',
    admin: '',
  });

  const option: AjaxPostOption = {
    method: 'POST',
    body: '',
    'Access-Control-Expose-Headers': '*, Authorization',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
  };

  const regiSubject = async () => {
    option.body = JSON.stringify({
      id: subjectInput.id,
      title: subjectInput.title,
      description: subjectInput.description,
      admin: subjectInput.admin,
    });
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) option.headers.Authorization = accessToken;
    const response = await fetch(url, option);
    if (response.status === 200) {
      const sid = (await response.json()) as string;
      console.log('성공');
      setRefreshSubject(refreshSubject * -1); // 상태 변화를 통한 새로고침
      console.log('성공2');
      navigate('../board/' + sid);
    } else if (response.status === 303) {
      refreshAccessToken(regiSubject)
        .then(() => null)
        .catch(() => null);
    } else if (response.status === 400) {
      console.log('잘못된 요청');
    } else if (response.status === 401) {
      console.log('권한 없음');
    }
  };

  return (
    <WriteSubject
      subjectInput={subjectInput}
      actionSubject={regiSubject}
      setSubjectInput={setSubjectInput}
      isUpdate={false}
    />
  );
};

const UpdateSubject = ({ subject }: { subject: SubjectT }) => {
  const url = apiUrl + '/ajax/subject/update';
  const navigate = useNavigate();
  const { refreshSubject, setRefreshSubject } = useContext(MainContext); // board 새로고침을 위한
  const [subjectInput, setSubjectInput] = useState<{
    id: string;
    title: string;
    description: string;
    admin: string;
  }>({
    id: subject.id,
    title: subject.title,
    description: subject.description,
    admin: subject.admin,
  });

  const option: AjaxPostOption = {
    method: 'POST',
    body: '',
    'Access-Control-Expose-Headers': '*, Authorization',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
  };

  const updateSubject = async () => {
    option.body = JSON.stringify({
      id: subject.id,
      title: subjectInput.title,
      description: subjectInput.description,
      admin: subjectInput.admin,
    });
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) option.headers.Authorization = accessToken;
    const response = await fetch(url, option);
    if (response.status === 200) {
      console.log('성공');
      setRefreshSubject(refreshSubject * -1); // 상태 변화를 통한 새로고침
      console.log('성공2');
      navigate('../');
    } else if (response.status === 303) {
      refreshAccessToken(updateSubject)
        .then(() => null)
        .catch(() => null);
    } else if (response.status === 400) {
      console.log('잘못된 요청');
    } else if (response.status === 401) {
      console.log('권한 없음');
    }
  };

  return (
    <WriteSubject
      subjectInput={subjectInput}
      actionSubject={updateSubject}
      setSubjectInput={setSubjectInput}
      isUpdate={true}
    />
  );
};

const WriteSubject = ({
  subjectInput,
  actionSubject,
  setSubjectInput,
  isUpdate,
}: {
  subjectInput: { id: string; title: string; description: string; admin: string };
  actionSubject: () => Promise<void>;
  setSubjectInput: React.Dispatch<
    React.SetStateAction<{ id: string; title: string; description: string; admin: string }>
  >;
  isUpdate: boolean;
}) => {
  const descriptionPanel = useRef<HTMLDivElement | null>(null);
  const titleInput = useRef<HTMLInputElement | null>(null);
  const idInput = useRef<HTMLInputElement | null>(null);
  const adminInput = useRef<HTMLInputElement | null>(null);
  const [description, setDescription] = useState<string>(subjectInput.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actionSubject()
      .then(() => null)
      .catch(() => null);
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubjectInput({
      ...subjectInput,
      id: e.target.value,
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubjectInput({
      ...subjectInput,
      title: e.target.value,
    });
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubjectInput({
      ...subjectInput,
      admin: e.target.value,
    });
  };

  const handleDescriptionInput = (e: React.ChangeEvent<HTMLDivElement>) => {
    setSubjectInput({
      ...subjectInput,
      description: e.target.innerHTML,
    });
  };

  useEffect(() => {
    if (subjectInput.description === '' || subjectInput.description === undefined) setDescription('<p><br /></p>');
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Header>주제 작성</Header>
      {isUpdate ? null : (
        <IdPanel>
          <Id>주제 고유 아이디</Id>
          <IdInput id="id" ref={idInput} maxLength={12} value={subjectInput.id} onChange={handleIdChange} />
        </IdPanel>
      )}
      <TitlePanel>
        <Title>제목</Title>
        <TitleInput
          id="title"
          ref={titleInput}
          maxLength={75}
          value={subjectInput.title}
          onChange={handleTitleChange}
        />
      </TitlePanel>
      <AdminPanel>
        <Admin>주제 관리자</Admin>
        <AdminInput
          id="admin"
          ref={adminInput}
          maxLength={21}
          value={subjectInput.admin}
          onChange={handleAdminChange}
        />
      </AdminPanel>
      <DescriptionPanel
        id="content"
        ref={descriptionPanel}
        contentEditable={true}
        dangerouslySetInnerHTML={{ __html: description }}
        onInput={handleDescriptionInput}></DescriptionPanel>
      <button type="submit">
        <span>작성하기</span>
      </button>
    </form>
  );
};

export { CreateSubject, UpdateSubject };
