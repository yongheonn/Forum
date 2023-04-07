/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { transform } from '@babel/core';
import React, {
  Dispatch,
  Fragment,
  MouseEvent,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { Button } from './LiButton';
import outsideClick from './OutsideClick';

const Li = styled.li`
  list-style: none;
`;

const Ul = styled.ul`
  padding-inline-start: 0px;
  list-style: none;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  color: #666666;
  line-height: 30px;
`;

const ListContainer = styled.div`
  border: 1px solid ${props => props.theme.borderColor};
  background-color: ${props => props.theme.bgColor};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  margin-top: 7px;
  padding-left: 20px;
  padding-right: 20px;
  position: absolute;
  display: block;
`;

const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;

  }
`;

type ChartProps = {
  element: React.ReactNode;
  children: React.ReactNode;
};

const DropDown = ({ element, children }: ChartProps) => {
  const [state, setState] = useState(false);

  const [x, setX] = useState(0);

  const containerRef = useRef(null);

  useEffect(() => {
    const resizeListener = () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const { x } = (containerRef.current as unknown as Element).getBoundingClientRect();
      const { width } = (containerRef.current as unknown as Element).getBoundingClientRect();
      if (x > window.innerWidth) setX(window.innerWidth - width);
    };
    window.addEventListener('resize', resizeListener);
  });

  const setInActive = () => {
    setState(false);
  };
  const wrapperRef = useRef(null);

  outsideClick(wrapperRef, setInActive);

  const clickButton = () => {
    setState(!state);
  };

  return (
    <div ref={wrapperRef}>
      <Button onClick={clickButton}>{element}</Button>
      {state ? (
        <ListContainer ref={containerRef} style={{ right: x.toString() + 'px' }}>
          {children}
        </ListContainer>
      ) : null}
    </div>
  );
};

export { Li, Ul, DropDown };
