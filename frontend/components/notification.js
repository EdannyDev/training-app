import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NotificationContainer, NotificationContent, CloseButton } from '../styles/notification.styles';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  let icon;
  if (type === 'success') {
    icon = faCheckCircle;
  } else if (type === 'warning') {
    icon = faExclamationTriangle;
  } else {
    icon = faExclamationCircle;
  }

  return (
    <NotificationContainer type={type}>
      <NotificationContent>
        <FontAwesomeIcon icon={icon} />
        <span>{message}</span>
      </NotificationContent>
      <CloseButton onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} />
      </CloseButton>
    </NotificationContainer>
  );
};

export default Notification;