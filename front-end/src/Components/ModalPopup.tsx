import React from 'react';
import styled from 'styled-components';
import { AiOutlineClose } from 'react-icons/ai';

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalBlock = styled.div`
  position: absolute;
  top: 6.5rem;
  border-radius: 10px;
  padding: 1.5rem;
  background-color: white;
  width: 60rem;
  @media (max-width: 1120px) {
    width: 50rem;
  }
  @media (max-width: 50rem) {
    width: 80%;
  }
  min-height: 35rem;
  animation: modal-show 0.1s;
  padding: 10px;
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(5px);
  animation: modal-bg-show 0.1s;
  @keyframes modal-bg-show {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;

type Props = {
  _handleModal: () => void;
  children: React.ReactNode;
};

const ModalPopup = ({ _handleModal, children, ...rest }: Props) => (
  <Container>
    <ModalBackground onClick={_handleModal} />
    <AiOutlineClose
      onClick={_handleModal}
      style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', cursor: 'pointer' }}
    />
    <ModalBlock {...rest}>
      <Contents>{children}</Contents>
    </ModalBlock>
  </Container>
);

export default ModalPopup;
