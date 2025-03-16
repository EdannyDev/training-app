import styled from "@emotion/styled";

export const Container = styled.div`
  max-width: 700px;
  margin: auto;
  padding: 20px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

export const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;

export const QuestionContainer = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  border: 2px solid #ccc;
  border-radius: 8px;
  background: #fff;
  text-align: left;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const QuestionText = styled.p`
  font-weight: bold;
  margin-bottom: 10px;
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const OptionButton = styled.button`
  background-color: ${(props) => (props.selected ? "#007bff" : "#f5f5f5")};
  color: ${(props) => (props.selected ? "white" : "black")};
  border: none;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease-in-out, color 0.3s ease-in-out;

  &:hover {
    background-color: ${(props) => (props.selected ? "#007bff" : "#999")};
    color: white;
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const SubmitButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 12px 15px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #218838;
  }

  @media (max-width: 768px) {
    width: 60%;
    font-size: 18px;
  }

  @media (max-width: 480px) {
    width: 100%;
    font-size: 20px;
  }
`;

export const MessageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 16px;
  padding: 12px 18px;
  margin: 10px auto;
  max-width: 300px;
  border-radius: 8px;
  text-align: center;
  color: white;
  background-color: ${(props) => (props.type === "success" ? "#28a745" : "#dc3545")};
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  svg {
    font-size: 18px;
  }

  @media (max-width: 768px) {
    padding: 14px 20px;
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
  }
`;