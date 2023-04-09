import styled, { keyframes } from 'styled-components';
import { AiOutlineLoading } from 'react-icons/ai';

const spin = keyframes`
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
    `;

const Loading = styled(AiOutlineLoading)`
  color: black;
  animation: ${spin} 2s linear infinite;
  height: ${props => props.height || '20px'};
  width: ${props => props.width || '20px'};
`;

export default Loading;
