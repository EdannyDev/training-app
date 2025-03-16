import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, -10px);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -10px);
  }
`;

const dropDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-50px);
  }
  70% {
    opacity: 1;
    transform: translateY(5px);
  }
  100% {
    transform: translateY(0);
  }
`;

const backdropBlur = keyframes`
  0% {
    backdrop-filter: blur(0px);
  }
  100% {
    backdrop-filter: blur(5px);
  }
`;

const fadeInScale = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

export const ContentContainer = styled.div`
  width: 100%;
  max-width: 90%;
  margin: 50px auto;
  padding: 20px;
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: 95%;
    padding: 4vw;
  }

  @media (max-width: 480px) {
    padding: 5vw;
  }
`;

export const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  word-wrap: break-word;
  overflow: hidden;
  animation: ${dropDown} 0.8s ease-out;

  @media (max-width: 768px) {
    font-size: 5vw;
  }

  @media (max-width: 480px) {
    font-size: 6vw;
  }
`;

export const InputSearch = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 20px auto;

  input {
    width: 100%;
    padding: 10px 40px 10px 15px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    font-family: inherit;
    transition: border-color 0.3s;

    @media (max-width: 768px) {
      font-size: 14px;
      padding: 10px 35px 10px 10px;
    }

    @media (max-width: 425px) {
      font-size: 12px;
      padding: 8px 30px 8px 10px;
    }
  }

  &:focus-within input {
    border-color: #1e1e1e;
    outline: none;
  }
`;

export const IconWrapper = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #888;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 425px) {
    font-size: 16px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #2874a6;
  margin-bottom: 16px;
  word-wrap: break-word;
  overflow: hidden;
  animation: ${dropDown} 0.9s ease-out;

  @media (max-width: 768px) {
    font-size: 5vw;
  }

  @media (max-width: 480px) {
    font-size: 6vw;
  }
`;

export const SectionDivider = styled.div`
  border-bottom: 1.5px solid #292929;
  margin-top: 30px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-top: 5vw;
    margin-bottom: 3vw;
  }

  @media (max-width: 480px) {
    margin-top: 6vw;
    margin-bottom: 4vw;
  }
`;

export const ModuleContainer = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 6px;
  background-color: #c9c9c9;
  word-wrap: break-word;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 3vw;
  }

  @media (max-width: 480px) {
    padding: 4vw;
  }
`;

export const ModuleTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #2E2E2E;
  margin-top: 5px;
  margin-bottom: 10px;
  word-wrap: break-word;
  overflow: hidden;
  animation: ${dropDown} 1s ease-out;

  @media (max-width: 768px) {
    font-size: 4vw;
  }

  @media (max-width: 480px) {
    font-size: 5vw;
  }
`;

export const NoSubmoduleText = styled.p`
  font-size: 16px;
  color: #292929;
  margin-top: 15px;
  margin-bottom: 10px;
  word-wrap: break-word;
  overflow: hidden;
  animation: ${dropDown} 1.6s ease-out;

  @media (max-width: 768px) {
    font-size: 3vw;
  }

  @media (max-width: 480px) {
    font-size: 4vw;
  }
`;

export const SubmoduleTitle = styled.h4`
  font-size: 16px;
  font-weight: 500;
  color: #f98400;
  margin-bottom: 8px;
  word-wrap: break-word;
  overflow: hidden;
  animation: ${dropDown} 1.1s ease-out;

  @media (max-width: 768px) {
    font-size: 4vw;
  }

  @media (max-width: 480px) {
    font-size: 5vw;
  }
`;

export const MaterialContainer = styled.div`
  padding: 12px;
  border-radius: 5px;
  background-color: #fefefe;
  margin-bottom: 10px;
  word-wrap: break-word;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 3vw;
  }

  @media (max-width: 480px) {
    padding: 4vw;
  }
`;

export const MaterialTitle = styled.h4`
  font-size: 16px;
  font-weight: bold;
  color: #555;
  margin-top: 6px;
  margin-bottom: 6px;
  word-wrap: break-word;
  overflow: hidden;
  animation: ${dropDown} 1.2s ease-out;

  @media (max-width: 768px) {
    font-size: 4vw;
  }

  @media (max-width: 480px) {
    font-size: 5vw;
  }
`;

export const MaterialDescription = styled.p`
  font-size: 14px;
  color: #777;
  margin-top: 6px;
  margin-bottom: 6px;
  word-wrap: break-word;
  overflow: hidden;
  animation: ${dropDown} 1.3s ease-out;

  @media (max-width: 768px) {
    font-size: 3vw;
  }

  @media (max-width: 480px) {
    font-size: 4vw;
  }
`;

export const MaterialRoles = styled.p`
  font-size: 14px;
  color: #888;
  margin-top: 20px;
  margin-bottom: -5px;
  font-style: italic;
  word-wrap: break-word;
  overflow: hidden;
  animation: ${dropDown} 1.4s ease-out;

  @media (max-width: 768px) {
    font-size: 3vw;
  }

  @media (max-width: 480px) {
    font-size: 4vw;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
  animation: ${backdropBlur} 0.5s ease-out forwards;
`;

export const ModalContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 50%;
  max-height: 90vh;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  animation: ${fadeInScale} 0.4s ease-out;

  @media (max-width: 768px) {
    width: 80%;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const ModalTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 1.3rem;
  color: #333;
  font-weight: bold;
  text-align: center;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const ModalContent = styled.div`
  width: 100%;
  max-height: 100vh;

  iframe {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }

  video {
    width: 100%;
    height: auto;
    max-height: 70vh;
    background-color: transparent;
    border-radius: 5px;
  }
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #888;
  font-size: 24px;

  &:hover {
    color: #555;
  }
`;

export const DocumentButton = styled.button`
  display: inline-flex;
  align-items: center;
  background-color: #0070f3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #005bb5;
  }

  &:focus {
    outline: none;
  }

  svg {
    margin-right: 8px;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
  }
`;

export const VideoButton = styled.button`
  display: inline-flex;
  align-items: center;
  background-color: #f39c12;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e67e22;
  }

  &:focus {
    outline: none;
  }

  svg {
    margin-right: 8px;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
  }
`;

export const ErrorBadge = styled.div`
  background-color: #ff4d4f;
  color: white;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  word-wrap: break-word;
  overflow: hidden;
  animation: ${dropDown} 0.7s ease-out;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 6px;
  }
`;

export const WarningBadge = styled.div`
  background-color: #f39c12;
  color: white;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  word-wrap: break-word;
  overflow: hidden;
  animation: ${dropDown} 0.7s ease-out;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 6px;
  }
`;

export const ButtonTest = styled.button`
  background: #28a745;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: fit-content;

  &:hover {
    background: #218838;
  }

  @media (max-width: 768px) {
    width: 80%;
    font-size: 20px;
  }

  @media (max-width: 480px) {
    width: 90%;
    font-size: 18px;
  }
`;

export const ButtonTestRetry = styled.button`
  background: #ffa726;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: fit-content;

  &:hover {
    background: #fb8c00;
  }

  @media (max-width: 768px) {
    width: 80%;
    font-size: 20px;
  }

  @media (max-width: 480px) {
    width: 90%;
    font-size: 18px;
  }
`;

export const NotificationContainer = styled.div`
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background-color: ${({ type }) =>
    type === 'success' ? '#4caf50' : type === 'error' ? '#dc3545' : '#ff9800'};
  color: #fff;
  padding: 16px 24px;
  border-radius: 6px;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: center;
  animation: ${fadeIn} 0.3s ease-in-out, ${fadeOut} 0.3s ease-in-out 4s forwards;

  @media (max-width: 768px) {
    max-width: 400px;
    width: 90%;
    font-size: 14px;
    padding: 12px 18px;
    gap: 6px;
  }

  @media (max-width: 480px) {
    max-width: 400px;
    width: 90%;
    font-size: 14px;
    padding: 10px 15px;
    gap: 5px;
  }
`;

export const NotificationMessage = styled.p`
  margin: 0;
  font-size: 16px;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    color: #ddd;
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;