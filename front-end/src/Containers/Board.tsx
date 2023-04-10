import React, { ChangeEvent, Fragment, useContext, useEffect, useRef, useState } from 'react';
import { AiFillLock } from 'react-icons/ai';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { HorizontalPanel, VerticalPanel } from '../Components/Panel';
import { AjaxGetOption, AjaxPostOption } from '../Modules/api_option';
import { AppContext } from './App';
import { DeleteBoard } from './DeleteBoard';
import { ErrorPage } from './ErrorPage';
import { refreshAccessToken } from './RefreshToken';
import { UpdateBoard } from './WriteBoard';
import { apiUrl } from '../Modules/api_url';
import { MainContext } from './Main';

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

const HeaderPanel = styled(VerticalPanel)`
  border-color: #bbb;
  border-top-width: 1px;
  border-top-style: solid;
  border-bottom-width: 1px;
  border-bottom-style: solid;
`;

const TitlePanel = styled(HorizontalPanel)`
  background-color: #eee;
  border-color: #bbb;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  padding: 8px;
`;

const InfoLeftPanel = styled(HorizontalPanel)`
  padding: 8px;
`;

const InfoRightPanel = styled(HorizontalPanel)`
  margin-left: auto;
  padding: 8px;
`;

const Separator = styled.span`
  margin-left: 3px;
  margin-right: 3px;
  color: #ccc;
`;

const Header = ({ board }: { board: BoardT }) => {
  const { bno } = useParams();
  return (
    <Fragment>
      <HeaderPanel>
        <TitlePanel>
          {board.title}
          {board.pw === 'pw' ? <AiFillLock /> : null}
        </TitlePanel>
        <HorizontalPanel>
          <InfoLeftPanel>
            <span>{board.writer}</span>
            <Separator>{'|'}</Separator>
            <span>{'작성일 ' + board.reg_date}</span>
          </InfoLeftPanel>
          <InfoRightPanel>
            <span>{'조회수 ' + board.view.toString()}</span>
          </InfoRightPanel>
        </HorizontalPanel>
      </HeaderPanel>
    </Fragment>
  );
};

const MainTextPanel = styled.div`
  padding: 8px;
`;

const RecommendPanel = styled(HorizontalPanel)`
  padding: 8px;
  margin: auto;
`;

const Recommend = ({ recommend }: { recommend: number }) => {
  const url = apiUrl + '/ajax/board/recommend';
  const { bno } = useParams();
  const [recommendNum, setRecommendNum] = useState<number>(recommend);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const option: AjaxPostOption = {
    method: 'POST',
    body: !bno ? '' : bno,
    'Access-Control-Expose-Headers': '*, Authorization',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
    xhrFields: {
      withCredentials: true,
    },
  };

  const handleClick = () => {
    setRecommend()
      .then(() => null)
      .catch(() => null);
  };

  const setRecommend = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) option.headers.Authorization = accessToken;
    const response = await fetch(url, option);

    if (response.status === 200) {
      setRecommendNum(recommendNum + 1);
    } else if (response.status === 303) {
      refreshAccessToken(setRecommend)
        .then(() => null)
        .catch(() => null);
    } else if (response.status === 400) {
      setErrorMsg('이미 추천을 했습니다.');
    }
  };

  return (
    <Fragment>
      <RecommendPanel>
        <button onClick={handleClick}>{'추천 ' + recommendNum.toString()}</button>
        <span>{errorMsg}</span>
      </RecommendPanel>
    </Fragment>
  );
};

const UpdateLink = styled(Link)`
  &:link {
    color: #000000;
  }
  &:visited {
    color: #000000;
  }
  background-color: #f0f0f0;
  text-decoration: none;
  border-width: 1px;
  border-style: solid;
  border-color: #bbb;
  padding: 5px;
  margin-left: auto;
  font-size: 15px;
  float: right;
`;

const DeleteButton = styled.button`
  text-decoration: none;
  border-width: 1px;
  border-style: solid;
  border-color: #bbb;
  padding: 5px;
  margin-left: 7px;
  font-size: 15px;
  float: right;
`;

const MainText = ({
  board,
  setDeleteClick,
}: {
  board: BoardT;
  setDeleteClick: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { bno } = useParams();

  const clickDelete = () => {
    setDeleteClick(true);
  };
  return (
    <Fragment>
      <VerticalPanel>
        <MainTextPanel dangerouslySetInnerHTML={{ __html: board.content }} />
        <Recommend recommend={board.recommend} />
        {board.user_id === 'id' ? (
          <HorizontalPanel>
            <UpdateLink to={'update'}>수정</UpdateLink>
            <DeleteButton onClick={clickDelete}>삭제</DeleteButton>
          </HorizontalPanel>
        ) : null}
      </VerticalPanel>
    </Fragment>
  );
};

const Comment = () => {
  const { bno } = useParams();
  return (
    <Fragment>
      <Link to="">{bno}</Link>
    </Fragment>
  );
};

const CheckSecret = ({
  bno,
  setBoard,
  setSecretCheck,
}: {
  bno: string;
  setBoard: React.Dispatch<React.SetStateAction<BoardT>>;
  setSecretCheck: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [pw, setPw] = useState<string[]>(['', '', '', '', '', '']);
  const [selected, setSelected] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const inputFocus = useRef<HTMLInputElement | null>(null);
  const setEle = useContext(AppContext);

  const urlBase = apiUrl + '/ajax/board/read-secret';

  const option: AjaxGetOption = {
    method: 'GET',
    'Access-Control-Expose-Headers': '*, Authorization',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
    xhrFields: {
      withCredentials: true,
    },
  };

  const handleKeyInput = (e: ChangeEvent<HTMLInputElement>) => {
    const regExp = /^[0-9a-zA-Z]$/;
    const inputValue = e.currentTarget.value;
    const pwLen = pw.filter(pw => pw !== '').length;

    const isValid: boolean = regExp.test(inputValue[inputValue.length - 1]);
    const isDelete: boolean = inputValue.length === pwLen - 1;
    if (!isValid && !isDelete) return;
    if (isDelete && pw[selected] === '' && selected >= 1) setSelected(selected - 1);
    else if (isDelete) {
      const tempPw = [...pw];
      tempPw[selected] = '';
      setPw(tempPw);
    } else if (isValid) {
      const tempPw = [...pw];
      tempPw[selected] = inputValue[inputValue.length - 1];
      setPw(tempPw);
      if (selected <= 4) setSelected(selected + 1);
    }
  };

  const handleClick = (index: number) => {
    setSelected(index);
  };

  const getBoardSecret = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) option.headers.Authorization = accessToken;

    const url = urlBase + '?bno=' + bno + '&pw=' + pw.join('');
    const response = await fetch(url, option);

    if (response.status === 200) {
      const tempBoard: BoardT = (await response.json()) as BoardT;
      setSecretCheck(false);
      setBoard(tempBoard);
      setEle(null);
    } else if (response.status === 303) {
      refreshAccessToken(getBoardSecret)
        .then(() => null)
        .catch(() => null);
    } else if (response.status === 400) {
      setErrorMsg('비밀번호가 틀렸습니다. 다시입력해주세요.');
    }
  };

  useEffect(() => {
    setEle(inputFocus.current);
    inputFocus.current?.focus();
    const isValid = !pw.some(pw => pw === '');
    if (isValid) {
      getBoardSecret()
        .then(() => null)
        .catch(() => null);
    }
  }, []);

  useEffect(() => {
    inputFocus.current?.focus();
    const isValid = !pw.some(pw => pw === '');
    if (isValid) {
      getBoardSecret()
        .then(() => null)
        .catch(() => null);
    }
  }, [pw, selected]);

  return (
    <Fragment>
      <HorizontalPanel>
        <Key selected={selected === 0} key={0} onClick={() => handleClick(0)}>
          {pw[0]}
        </Key>
        <Key selected={selected === 1} key={1} onClick={() => handleClick(1)}>
          {pw[1]}
        </Key>
        <Key selected={selected === 2} key={2} onClick={() => handleClick(2)}>
          {pw[2]}
        </Key>
        <Key selected={selected === 3} key={3} onClick={() => handleClick(3)}>
          {pw[3]}
        </Key>
        <Key selected={selected === 4} key={4} onClick={() => handleClick(4)}>
          {pw[4]}
        </Key>
        <Key selected={selected === 5} key={5} onClick={() => handleClick(5)}>
          {pw[5]}
        </Key>
      </HorizontalPanel>
      <span>{errorMsg}</span>
      <KeyInput ref={inputFocus} onChange={handleKeyInput} value={pw.join('')} autoFocus></KeyInput>
    </Fragment>
  );
};

const Board = () => {
  const [board, setBoard] = useState<BoardT>({} as BoardT);

  const { bno } = useParams();
  const [error, setError] = useState(0);
  const urlBase = apiUrl + '/ajax/board/read';
  const { refreshBoard } = useContext(MainContext);
  const [isDeleteClick, setDeleteClick] = useState(false);

  const option: AjaxGetOption = {
    method: 'GET',
    'Access-Control-Expose-Headers': '*, Authorization',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
    xhrFields: {
      withCredentials: true,
    },
  };

  const [secretCheck, setSecretCheck] = useState(false);
  const [delay, setDelay] = useState(false);

  const getBoard = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) option.headers.Authorization = accessToken;
    const url = urlBase + '?bno=' + (bno as string);
    const response = await fetch(url, option);

    if (response.status === 200) {
      const tempBoard: BoardT = (await response.json()) as BoardT;
      setBoard(tempBoard);
      setDelay(true);
    } else if (response.status === 303) {
      refreshAccessToken(getBoard)
        .then(() => null)
        .catch(() => null);
    } else if (response.status === 404) {
      setError(404);
    } else if (response.status === 428) {
      setSecretCheck(true);
    }
  };

  useEffect(() => {
    getBoard()
      .then(() => null)
      .catch(() => null);
  }, [refreshBoard]);

  return (
    <Fragment>
      {
        // 나중에 main article로 이동 예정
        error ? (
          <ErrorPage code={error} />
        ) : (
          <Routes>
            <Route
              path=""
              element={
                <Fragment>
                  {secretCheck === true ? (
                    <CheckSecret bno={bno as string} setBoard={setBoard} setSecretCheck={setSecretCheck} />
                  ) : delay ? (
                    <VerticalPanel>
                      <Header board={board} />
                      <MainText board={board} setDeleteClick={setDeleteClick} />
                      <Comment />
                    </VerticalPanel>
                  ) : null}
                </Fragment>
              }
            />
            {delay ? <Route path="update" element={<UpdateBoard board={board} bno={bno as string} />} /> : null}
          </Routes>
        )
      }
      {isDeleteClick ? <DeleteBoard bno={bno as string} setDeleteClick={setDeleteClick} /> : null}
    </Fragment>
  );
};

export { Board };
