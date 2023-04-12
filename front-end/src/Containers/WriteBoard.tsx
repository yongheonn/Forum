import React, { ChangeEvent, Fragment, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  padding: 12px;
  white-space: nowrap;
`;

const PwInput = styled(HorizontalPanel)`
  padding-left: 8px;
  border-width: 0px;
`;

const PwError = styled.span`
  color: red;
  border-color: #000;
  padding: 8px;
  margin-left: 12px;
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

const KeyInput = styled.input`
  outline: none;
  cursor: none;
  width: 1px;
  height: 1px;
  border: none;
  font-size: 1px;
  color: transparent;
`;

const Key = styled.div`
  line-height: 50px;
  text-align: center;
  font-size: 30px;
  border-size: 1px;
  border-style: solid;
  border-color: ${({ selected }: { selected: boolean }) => (selected ? 'blue' : 'black')};
  color: ${({ selected }: { selected: boolean }) => (selected ? 'blue' : 'black')};
  width: 50px;
  height: 50px;
`;

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
  const pwOptions = ['자신만 볼 수 있게', '코드로 일부 공개'];
  const [selectedOption, setSelectedOption] = useState<string>(
    boardInput.pw === 'nonpw' || boardInput.pw === null ? pwOptions[0] : pwOptions[1]
  );
  const [pw, setPw] = useState<string[]>(['', '', '', '', '', '']);
  const [selectedKey, setSelectedKey] = useState(0);
  const [pwError, setPwError] = useState<string>('');
  const inputFocus = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwCheck && selectedOption === '코드로 일부 공개') {
      const isValid = !pw.some(pw => pw === '');
      if (!isValid) {
        setPwError('비밀번호를 영문 대소문자 및 숫자로 6글자를 채워주세요');
        return;
      }
    }
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
          pw: pw.join(''),
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
        pw: pw.join(''),
      });
  };

  const setPwOptions: React.ReactNode = pwOptions.map(pwOption => (
    <option value={pwOption} key={pwOption}>
      {pwOption}
    </option>
  ));

  const handleKeyInput = (e: ChangeEvent<HTMLInputElement>) => {
    const regExp = /^[0-9a-zA-Z]$/;
    const inputValue = e.currentTarget.value;
    const pwLen = pw.filter(pw => pw !== '').length;

    const isValid: boolean = regExp.test(inputValue[inputValue.length - 1]);
    const isDelete: boolean = inputValue.length === pwLen - 1;
    if (!isValid && !isDelete) return;
    if (isDelete && pw[selectedKey] === '' && selectedKey >= 1) setSelectedKey(selectedKey - 1);
    else if (isDelete) {
      const tempPw = [...pw];
      tempPw[selectedKey] = '';
      setPw(tempPw);
    } else if (isValid) {
      const tempPw = [...pw];
      tempPw[selectedKey] = inputValue[inputValue.length - 1];
      setPw(tempPw);
      if (selectedKey <= 4) setSelectedKey(selectedKey + 1);
    }
  };

  const handleKeyClick = (index: number) => {
    inputFocus.current?.focus();
    setSelectedKey(index);
  };

  const handleContentInput = (e: React.ChangeEvent<HTMLDivElement>) => {
    setBoardInput({
      ...boardInput,
      content: e.target.innerHTML,
    });
  };

  useEffect(() => {
    if (boardInput.content === '' || boardInput.content === undefined) setContent('<p><br /></p>');
    if (boardInput.pw && boardInput.pw !== '' && boardInput.pw !== 'nonpw') {
      const tempPw: string = boardInput.pw;

      setPw(tempPw.split(''));
    }
  }, []);

  useEffect(() => {
    setBoardInput({
      ...boardInput,
      pw: pw.join(''),
    });
  }, [pw]);

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
              <Fragment>
                <PwInput>
                  <Key selected={selectedKey === 0} key={0} onClick={() => handleKeyClick(0)}>
                    {pw[0]}
                  </Key>
                  <Key selected={selectedKey === 1} key={1} onClick={() => handleKeyClick(1)}>
                    {pw[1]}
                  </Key>
                  <Key selected={selectedKey === 2} key={2} onClick={() => handleKeyClick(2)}>
                    {pw[2]}
                  </Key>
                  <Key selected={selectedKey === 3} key={3} onClick={() => handleKeyClick(3)}>
                    {pw[3]}
                  </Key>
                  <Key selected={selectedKey === 4} key={4} onClick={() => handleKeyClick(4)}>
                    {pw[4]}
                  </Key>
                  <Key selected={selectedKey === 5} key={5} onClick={() => handleKeyClick(5)}>
                    {pw[5]}
                  </Key>
                </PwInput>
                <PwError>{pwError}</PwError>
                <KeyInput
                  ref={inputFocus}
                  onChange={handleKeyInput}
                  value={pw.join('')}
                  autoFocus
                  disabled={selectedOption !== '코드로 일부 공개'}></KeyInput>
              </Fragment>
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
