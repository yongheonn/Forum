import React, { createContext, Dispatch, Fragment, SetStateAction, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AiFillLock } from 'react-icons/ai';
import { Link, Route, Routes, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AjaxGetOption } from '../Modules/api_option';
import { HorizontalPanel, VerticalPanel } from '../Components/Panel';
import '../styles/BoardList.css';
import { refreshAccessToken } from './RefreshToken';
import { Board } from './Board';
import { CreateBoard } from './WriteBoard';
import { apiUrl } from '../Modules/api_url';
import { UpdateSubject } from './CreateSubject';
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

type SubjectT = {
  id: string;
  title: string;
  description: string;
  admin: string;
  btotal: number;
};

const BoardLink = styled(Link)`
  &:link {
    color: #000000;
  }
  &:visited {
    color: #bbbbbb;
  }
  &:hover {
    background: #66b2ff;
  }
  text-decoration: none;
`;

const BnoSpan = styled.span`
  justify-content: center;
  align-items: center;
  display: flex;
  width: 100px;
`;

const TitleSpan = styled.span`
  justify-content: left;
  align-items: center;
  display: flex;
  width: 390px;
`;

const WriterSpan = styled.span`
  justify-content: left;
  align-items: center;
  display: flex;
  width: 90px;
`;

const DateSpan = styled.span`
  justify-content: center;
  align-items: center;
  display: flex;
  width: 300px;
`;

const ViewSpan = styled.span`
  justify-content: center;
  align-items: center;
  display: flex;
  width: 100px;
`;

const RecommendSpan = styled.span`
  justify-content: center;
  align-items: center;
  display: flex;
  width: 100px;
`;

const SubjectInfoPanel = styled(HorizontalPanel)`
  padding: 8px;
`;

const SubjectLink = styled(Link)`
  &:link {
    color: #000000;
  }

  &:visited {
    color: #000000;
  }
  &:hover {
    color: #66b2ff;
  }
  text-decoration: none;
  font-weight: bold;
  background: #eeeeee;
  padding: 15px;
  flex-grow: 1;
  font-size: 20px;
`;

const SubjectInfo = ({ subject }: { subject: SubjectT }) => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <SubjectInfoPanel>
        <SubjectLink to={'/board/' + subject.id}>{subject.title + ' ' + t('subject')}</SubjectLink>
      </SubjectInfoPanel>
    </Fragment>
  );
};

const HeaderPanel = styled(HorizontalPanel)`
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-color: #bbb;
  padding: 8px;
`;

const BoardHeader = () => {
  const { t } = useTranslation();
  return (
    <Fragment>
      <HeaderPanel>
        <BnoSpan style={{ fontWeight: 'bold' }}>{t('board_no')}</BnoSpan>
        <TitleSpan style={{ fontWeight: 'bold' }}>{t('board_title')}</TitleSpan>
        <WriterSpan style={{ fontWeight: 'bold' }}>{t('board_writer')}</WriterSpan>
        <DateSpan style={{ fontWeight: 'bold' }}>{t('board_regdate')}</DateSpan>
        <ViewSpan style={{ fontWeight: 'bold' }}>{t('board_view')}</ViewSpan>
        <RecommendSpan style={{ fontWeight: 'bold' }}>{t('board_recommend')}</RecommendSpan>
      </HeaderPanel>
    </Fragment>
  );
};

const ColumnPanel = styled(HorizontalPanel)`
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-color: #bbb;
  padding: 8px;
`;

const BoardColumn = ({ board }: { board: BoardT }) => (
  <Fragment>
    <ColumnPanel>
      <BnoSpan>{board.s_bno}</BnoSpan>
      <TitleSpan>
        {board.title}
        {board.pw === 'pw' ? <AiFillLock /> : null}
      </TitleSpan>
      <WriterSpan>{board.writer}</WriterSpan>
      <DateSpan className="center">{board.reg_date}</DateSpan>
      <ViewSpan className="center">{board.view}</ViewSpan>
      <RecommendSpan className="center">{board.recommend}</RecommendSpan>
    </ColumnPanel>
  </Fragment>
);

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

const BoardFooter = styled(HorizontalPanel)`
  padding: 8px;
  margin-top: 12px;
`;

const BoardList = ({ subject, page }: { subject: SubjectT; page: string }) => {
  const urlBase = apiUrl + '/ajax/board/list';
  const { t } = useTranslation();
  const option: AjaxGetOption = {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
  };

  const [boardList, setBoardList] = useState([] as BoardT[]);

  const getBoardList = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) option.headers.Authorization = accessToken;
    const url = urlBase + '?sid=' + subject.id + '&page=' + page;
    const response = await fetch(url, option);

    if (response.status === 200) {
      const tempBoardList: BoardT[] = (await response.json()) as BoardT[];
      tempBoardList.reverse();
      checkTime(tempBoardList);
      setBoardList(tempBoardList);
    } else if (response.status === 303) {
      refreshAccessToken(getBoardList)
        .then(() => null)
        .catch(() => null);
    }
  };

  const checkTime = (tempBoardList: BoardT[]) => {
    const now = new Date();
    tempBoardList.forEach(board => {
      const dateExp = board.reg_date.split(/[-: ]/);
      const date = dateExp[2];
      if (Number(date) === now.getDate()) board.reg_date = dateExp[3] + ':' + dateExp[4];
      else board.reg_date = dateExp[0] + '-' + dateExp[1] + '-' + dateExp[2];
    });
  };

  useEffect(() => {
    getBoardList()
      .then(() => null)
      .catch(() => null);
  }, []);

  return (
    <Fragment>
      <VerticalPanel>
        <BoardHeader />
        {boardList.map(board => (
          <BoardLink to={board.bno.toString()} key={board.bno}>
            <BoardColumn board={board} />
          </BoardLink>
        ))}
        <BoardFooter>
          <WriteLink to={'/board/' + subject.id + '/create'}>{t('write')}</WriteLink>
          {localStorage.getItem('id') === subject.id || localStorage.getItem('auth') === 'ROLE_ADMIN' ? (
            <WriteLink to={'/board/' + subject.id + '/update'}>{t('edit_subject')}</WriteLink>
          ) : null}
        </BoardFooter>
      </VerticalPanel>
    </Fragment>
  );
};

const Subject = () => {
  const { sid } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const { refreshSubject } = useContext(MainContext);
  const [delay, setDelay] = useState(false);

  const urlBase = apiUrl + '/ajax/subject/get';

  const option: AjaxGetOption = {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: '',
    },
  };

  const [subject, setSubject] = useState<SubjectT>({} as SubjectT);

  const getSubject = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) option.headers.Authorization = accessToken;
    const url = urlBase + '?sid=' + (sid as string);
    const response = await fetch(url, option);

    if (response.status === 200) {
      const tempSubject: SubjectT = (await response.json()) as SubjectT;
      setSubject(tempSubject);
      setDelay(true);
    } else if (response.status === 303) {
      refreshAccessToken(getSubject)
        .then(() => null)
        .catch(() => null);
    }
  };

  useEffect(() => {
    getSubject()
      .then(() => null)
      .catch(() => null);
  }, [refreshSubject]);

  return (
    <Fragment>
      {delay ? <SubjectInfo subject={subject} /> : null}
      <Routes>
        {delay ? (
          <Route path="" element={<BoardList subject={subject} page={searchParams.get('page') ?? '1'} />} />
        ) : null}
        <Route path="create" element={<CreateBoard sid={sid as string} />} />
        {delay ? <Route path="update" element={<UpdateSubject subject={subject} />} /> : null}
        <Route path=":bno/*" element={<Board />} />
      </Routes>
    </Fragment>
  );
};

export { Subject };
