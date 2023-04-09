import React, { Fragment, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ModalPopup from '../Components/ModalPopup';
import { HorizontalPanel } from '../Components/Panel';
import { AjaxPostOption } from '../Modules/api_option';
import { refreshAccessToken } from './RefreshToken';
import { MainContext } from './Main';
import { apiUrl } from '../Modules/api_url';

const DeletePopup = styled(ModalPopup)`
  width: auto;
  height: auto;
  display: grid;
  place-items: center;
  min-height: 30px;
`;

const DeleteBoard = ({
  bno,
  setDeleteClick,
}: {
  bno: string;
  setDeleteClick: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const url = apiUrl + '/ajax/board/delete';
  const navigate = useNavigate();
  const { refreshBoardList, setRefreshBoardList } = useContext(MainContext);

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

  const clickHandler = () => {
    setDeleteClick(false);
  };
  const confirm = () => {
    deleteBoard()
      .then(() => null)
      .catch(() => null);
  };

  const deleteBoard = async () => {
    option.body = JSON.stringify(bno);
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) option.headers.Authorization = accessToken;
    const response = await fetch(url, option);
    if (response.status === 200) {
      console.log('성공');
      setRefreshBoardList(refreshBoardList * -1); // 상태 변화를 통한 새로고침
      navigate('../');
    } else if (response.status === 303) {
      refreshAccessToken(deleteBoard)
        .then(() => null)
        .catch(() => null);
    } else if (response.status === 400) {
      console.log('잘못된 요청');
    } else if (response.status === 401) {
      console.log('권한 없음');
    }
  };

  return (
    <DeletePopup _handleModal={() => clickHandler()}>
      <span> 정말로 삭제하시겠습니까?</span>
      <HorizontalPanel>
        <button onClick={confirm}>확인</button>
        <button onClick={clickHandler}>취소</button>
      </HorizontalPanel>
    </DeletePopup>
  );
};

export { DeleteBoard };
