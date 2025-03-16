import styled from '@emotion/styled';

export const ProgressWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

export const ProgressBarElement = styled.div`
  width: 100%;
  background-color: #b0b0b0;
  border-radius: 8px;
  height: 10px;
  position: relative;

  @media (max-width: 1024px) {
    height: 9px;
  }

  @media (max-width: 768px) {
    height: 8px;
  }

  @media (max-width: 480px) {
    height: 6px;
  }
`;

export const ProgressFill = styled.div`
  height: 100%;
  width: ${(props) => props.progress}%;
  background-color: ${(props) => props.progress < 100 ? '#ffeb3b' : '#4caf50'};
  border-radius: 8px;
  transition: background-color 0.3s ease, width 0.3s ease;

  @media (max-width: 1024px) {
    border-radius: 7px;
  }

  @media (max-width: 768px) {
    border-radius: 6px;
  }

  @media (max-width: 480px) {
    border-radius: 5px;
  }
`;