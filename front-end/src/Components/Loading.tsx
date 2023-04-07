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
  animation: ${spin} 2s linear infinite;
`;

export default Loading;
