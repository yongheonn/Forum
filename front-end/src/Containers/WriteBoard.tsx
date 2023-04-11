import React, { ChangeEvent, Fragment, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { HorizontalPanel } from '../Components/Panel';
import { AjaxPostOption } from '../Modules/api_option';
import { refreshAccessToken } from './RefreshToken';
import { MainContext } from './Main';
import { apiUrl } from '../Modules/api_url';
import { CheckBox } from '../Components/CheckBox';

type BoardT = {
  bno: number; // 게시물 번호
  sid: string;
  s_bno: number;
  user_id: string;
  writer: string;
  title: string;
  content: string;
  view: number;
  recommend: number;
  reg_date: string;
  update_date: string;
  pw: string;
  deleted: boolean;
};

const Header = styled.div`
  background-color: #eee;
  border-color: #bbb;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  padding: 8px;
  margin-bottom: 10px;
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

const PwPanel = styled(HorizontalPanel)`
  border-color: #bbb;
  border-width: 1px;
  border-style: solid;
  margin-bottom: 20px;
`;

const Pw = styled.span`
  border-color: #000;
  border-right-width: 1px;
  border-right-style: solid;
  padding: 8px;
  white-space: nowrap;
`;

const PwInput = styled.input`
  padding-left: 8px;
  border-width: 0px;
  width: 100%;
`;

const ContentPanel = styled.div`
  border-color: #bbb;
  border-width: 1px;
  border-style: solid;
  height: 500px;
  padding: 20px;
  outline: none;
  overflow: scroll;
`;

const CreateBoard = ({ sid }: { sid: string }) => {
  const url = apiUrl + '/ajax/board/create';
  const navigate = useNavigate();
  const { refreshBoard, setRefreshBoard } = useContext(MainContext); // board 새로고침을 위한

  const [boardInput, setBoardInput] = useState<{ title: string; content: string; pw: string | null }>({
    title: '',
    content: '',
    pw: null,
  });

  const option: AjaxPostOption = {
    method: 'POST',
    body: '',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
  };

  const regiBoard = async () => {
    let { pw } = boardInput;
    if (pw === '') pw = null;
    option.body = JSON.stringify({ title: boardInput.title, content: boardInput.content, pw, sid });
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) option.headers.Authorization = accessToken;
    const response = await fetch(url, option);
    if (response.status === 200) {
      const bno = (await response.json()) as string;
      setRefreshBoard(refreshBoard * -1); // 상태 변화를 통한 새로고침
      navigate('../' + bno);
    } else if (response.status === 303) {
      refreshAccessToken(regiBoard)
        .then(() => null)
        .catch(() => null);
    } else if (response.status === 400) {
      alert('잘못된 요청');
    } else if (response.status === 401) {
      alert('권한 없음');
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      alert('권한이 없습니다. 로그인해주세요.');
      navigate('../');
    }
  }, []);

  return <WriteBoard boardInput={boardInput} actionBoard={regiBoard} setBoardInput={setBoardInput} />;
};

const UpdateBoard = ({ board, bno }: { board: BoardT; bno: string }) => {
  const url = apiUrl + '/ajax/board/update';
  const navigate = useNavigate();
  const { refreshBoard, setRefreshBoard } = useContext(MainContext); // board 새로고침을 위한
  const [boardInput, setBoardInput] = useState<{ title: string; content: string; pw: string | null }>({
    title: board.title,
    content: board.content,
    pw: board.pw,
  });

  const option: AjaxPostOption = {
    method: 'POST',
    body: '',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
  };

  const updateBoard = async () => {
    let { pw } = boardInput;
    if (pw === '') pw = null;
    option.body = JSON.stringify({ title: boardInput.title, content: boardInput.content, pw, bno });
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) option.headers.Authorization = accessToken;
    const response = await fetch(url, option);
    if (response.status === 200) {
      setRefreshBoard(refreshBoard * -1); // 상태 변화를 통한 새로고침
      navigate('../');
    } else if (response.status === 303) {
      refreshAccessToken(updateBoard)
        .then(() => null)
        .catch(() => null);
    } else if (response.status === 400) {
      alert('잘못된 요청');
    } else if (response.status === 401) {
      alert('권한 없음');
    }
  };

  return <WriteBoard boardInput={boardInput} actionBoard={updateBoard} setBoardInput={setBoardInput} />;
};

const WriteBoard = ({
  boardInput,
  actionBoard,
  setBoardInput,
}: {
  boardInput: { title: string; content: string; pw: string | null };
  actionBoard: () => Promise<void>;
  setBoardInput: React.Dispatch<React.SetStateAction<{ title: string; content: string; pw: string | null }>>;
}) => {
  const [content, setContent] = useState<string>(boardInput.content);
  const [pwCheck, setPwCheck] = useState<boolean>(boardInput.pw !== null);
  const [tempPw, setTempPw] = useState<string>(boardInput.pw ? boardInput.pw : '');
  const pwOptions = ['자신만 볼 수 있게', '코드로 일부 공개'];
  const [selectedOption, setSelectedOption] = useState<string>(
    boardInput.pw === 'nonpw' || boardInput.pw === null ? pwOptions[0] : pwOptions[1]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actionBoard()
      .then(() => null)
      .catch(() => null);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardInput({
      ...boardInput,
      title: e.target.value,
    });
  };

  const handlePwOheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setPwCheck(checked);
    if (checked === true) {
      if (selectedOption === '자신만 볼 수 있게')
        setBoardInput({
          ...boardInput,
          pw: 'nonpw',
        });
      else
        setBoardInput({
          ...boardInput,
          pw: tempPw,
        });
    }
  };

  const handlePwOptionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected: string = e.target.value;
    setSelectedOption(selected);
    if (selected === '자신만 볼 수 있게')
      setBoardInput({
        ...boardInput,
        pw: 'nonpw',
      });
    else
      setBoardInput({
        ...boardInput,
        pw: tempPw,
      });
  };

  const setPwOptions: React.ReactNode = pwOptions.map(pwOption => (
    <option value={pwOption} key={pwOption}>
      {pwOption}
    </option>
  ));

  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempPw(e.target.value);
    setBoardInput({
      ...boardInput,
      pw: e.target.value,
    });
  };

  const handleContentInput = (e: React.ChangeEvent<HTMLDivElement>) => {
    setBoardInput({
      ...boardInput,
      content: e.target.innerHTML,
    });
  };

  useEffect(() => {
    if (boardInput.content === '' || boardInput.content === undefined) setContent('<p><br /></p>');
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Header>글쓰기</Header>
      <TitlePanel>
        <Title>제목</Title>
        <TitleInput id="title" maxLength={75} value={boardInput.title} onChange={handleTitleChange} />
      </TitlePanel>
      <PwPanel>
        <CheckBox disabled={false} checked={pwCheck} onChange={handlePwOheckChange}>
          <Pw>비밀글</Pw>
        </CheckBox>
        {pwCheck ? (
          <Fragment>
            <select onChange={handlePwOptionChange} value={selectedOption}>
              {setPwOptions}
            </select>
            {selectedOption === '코드로 일부 공개' ? (
              <PwInput
                id="pw"
                maxLength={6}
                value={tempPw}
                onChange={handlePwChange}
                disabled={selectedOption !== '코드로 일부 공개'}
              />
            ) : null}
          </Fragment>
        ) : null}
      </PwPanel>
      <ContentPanel
        id="content"
        contentEditable={true}
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={handleContentInput}></ContentPanel>
      <button type="submit">
        <span>작성하기</span>
      </button>
    </form>
  );
};

export { CreateBoard, UpdateBoard };
