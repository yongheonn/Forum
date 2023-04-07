import styled from 'styled-components';

const HorizontalPanel = styled.div`
  weight: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const VerticalPanel = styled.div`
  weight: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export { HorizontalPanel, VerticalPanel };
