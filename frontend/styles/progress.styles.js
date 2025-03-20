import styled from '@emotion/styled';

export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 90%;
  margin: 60px auto 0;

  @media (max-width: 768px) {
    max-width: 95%;
  }
`;

export const Title = styled.h1`
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #333;

  @media (max-width: 768px) {
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 25px;
    margin-bottom: 10px;
  }
`;

export const UserCard = styled.div`
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin: 10px 0;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
`;

export const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const UserInfo = styled.div`
  text-align: left;

  p {
    margin: 5px 0;
    font-size: 16px;
  }

  @media (max-width: 768px) {
    p {
      font-size: 14px;
    }
  }
`;

export const CompletedBadge = styled.span`
  background-color: #007bff;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  padding: 5px 12px;
  border-radius: 15px;
  display: inline-block;
  white-space: nowrap;
  text-align: center;
  min-width: 180px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  @media (max-width: 768px) {
    position: relative;
    left: auto;
    transform: none;
    align-self: center;
    margin-top: 5px;
  }
`;

export const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    align-self: flex-end;
  }
`;

export const TrainingsList = styled.div`
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #ddd;
`;

export const TrainingItem = styled.div`
  background-color: #f7f7f7;
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  span {
    flex: 1;
  }

  div {
    display: flex;
    gap: 10px;
    align-items: center;
    min-width: 120px;
    justify-content: flex-end;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    
    div {
      justify-content: flex-start;
      width: 100%;
      margin-top: 5px;
    }
  }
`;

export const TrainingBadge = styled.span`
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
  text-align: center;
  min-width: 90px;
  background-color: ${({ status }) =>
    status === 'completado' ? '#28a745' : '#ffc107'};
  color: ${({ status }) => (status === 'completado' ? '#fff' : '#000')};
`;

export const ProgressBadge = styled.span`
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
  text-align: center;
  min-width: 50px;
  background-color: ${({ progress }) =>
    progress === 100 ? '#28a745' : '#ffc107'};
  color: ${({ progress }) => (progress === 100 ? '#fff' : '#000')};
`;

export const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 20px 0;
`;

export const BackButton = styled.button`
  background-color: #6c757d;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  width: fit-content;
  margin: 10px auto;

  &:hover {
    background-color: #5a6268;
  }

  @media (max-width: 768px) {
    width: 50%;
    font-size: 18px;
    padding: 8px 16px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    padding: 8px 12px;
  }
`;