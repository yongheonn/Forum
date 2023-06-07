import React, { useState, Fragment, useEffect } from 'react';
import styled from 'styled-components';
import ModalPopup from '../Components/ModalPopup';

const Title = styled.h1`
  text-align: center;
`;

const GuestLoginNotice = () => {
  const message = '';

  return (
    <Fragment>
      <span>
        <Title> 공지사항 </Title>
        <br />
        <br />
        현재 게시판에는 로그인하지 않으면 사용이 불가능한 기능이 있습니다.(ex: 글쓰기, 추천, 글 수정, 글 삭제, 주제
        생성, 주제 수정 등)
        <br />
        <br />
        이를 로그인하지 않아도 사용가능하게 하면 spring security의 의미가 퇴색되고, 여러가지 문제가 발생하므로, 임시로
        모든 기능을 사용 가능한 게스트 로그인을 도입했습니다.
        <br />
        <br />
        현재 관리자 권한으로 모든 권한을 사용하고자 한다면, 상단 로그인에 들어가 게스트로 로그인 항목으로 로그인하시거나
        <br />
        id: test_admin
        <br />
        pw:test_admin_pw
        <br />
        를 통해서 직접 로그인해보셔도 됩니다.
        <br />
        <br />
        또한, oAuth 로그인의 경우 구글은 가능하지만, 카카오와 네이버의 경우 그족에 별도의 신청을 필요로하므로,
        포트폴리오 목적에서는 불가능하여 사용이 불가능하니 참고 부탁드립니다.
        <br />
        <br />
        현재 창을 닫으면 1일 동안 다시 열지 않으며, 직접 확인하고 싶으신 경우 상단의 공지사항 항목을 통해 확인하시기
        바랍니다.
      </span>
    </Fragment>
  );
};

const Notice = ({ isClick }: { isClick: boolean }) => {
  const [modalState, setModalState] = useState(false);

  const clickHandler = () => {
    setModalState(false);
  };

  const checkExp = () => {
    const noticeDate = localStorage.getItem('notice');
    const now = new Date();
    if (noticeDate !== null) {
      if (now.getTime() > parseInt(noticeDate, 10)) {
        setModalState(true);
        localStorage.setItem('notice', (now.getTime() + 24 * 60 * 60 * 1000).toString());
      }
    } else {
      setModalState(true);
      localStorage.setItem('notice', (now.getTime() + 24 * 60 * 60 * 1000).toString());
    }
  };

  useEffect(() => {
    if (!isClick) {
      checkExp();
    } else {
      setModalState(true);
    }
  }, []);

  return (
    <Fragment>
      {modalState ? (
        <ModalPopup _handleModal={() => clickHandler()}>
          <GuestLoginNotice />
        </ModalPopup>
      ) : null}
    </Fragment>
  );
};
export { Notice };
