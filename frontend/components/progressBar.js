import React from 'react';
import { ProgressWrapper, ProgressBarElement, ProgressFill } from '../styles/progressBar.styles';

const ProgressBar = ({ progress }) => {
  const progressValue = Math.max(0, Math.min(100, progress));

  return (
    <ProgressWrapper>
      <ProgressBarElement>
        <ProgressFill progress={progressValue} />
      </ProgressBarElement>
    </ProgressWrapper>
  );
};

export default ProgressBar;