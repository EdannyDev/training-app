import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  WelcomeContainer,
  Header,
  MainContent,
  Popup,
  PopupHeader,
  PopupBody,
  PopupFooter,
  Overlay,
  CloseButton,
  Logo,
  ContentWrapper,
} from '../frontend/styles/welcome.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faRightToBracket } from '@fortawesome/free-solid-svg-icons';

const Welcome = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const [popupClosed, setPopupClosed] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const { data } = await axios.get('https://backend-training-cs9o.onrender.com/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch {
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    fetchProfile();
  }, [router]);

  const handleButtonClick = () => {
    if (user.role === 'admin') {
      router.push('/table');
    } else {
      router.push('/training');
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupClosed(true);
  };

  if (!user) return null;

  return (
    <WelcomeContainer>
      {popupClosed && (
        <ContentWrapper>
          <Header>
            <h1>¡Bienvenido al software de capacitación!</h1>
            <p>Capacitación integral para el uso correcto del ERP de DIMMMSA.</p>
          </Header>
          <MainContent>
            <button onClick={handleButtonClick}>
              <FontAwesomeIcon icon={faRightToBracket} style={{ marginRight: '5px' }} />
              Comenzar
            </button>
          </MainContent>
        </ContentWrapper>
      )}

      {showPopup && (
        <>
          <Overlay onClick={handleClosePopup} />
          <Popup>
            <PopupHeader>
              <Logo src="/img/logo.png" alt="Logo de DIMMMSA" />
              <h2>¡Hola, <span>{user.name}</span>!</h2>
            </PopupHeader>
            <PopupBody>
              {user.role === 'admin' ? (
                <p>
                  Bienvenido, <strong>{user.role}</strong>. Como personal de RH, tienes el acceso total para gestionar la capacitación y optimizar el uso del ERP Nyx en DIMMMSA.
                </p>
              ) : (
                <p>
                  Bienvenido, <strong>{user.role}</strong>. Como parte del equipo de ventas, tendrás acceso a todo lo necesario para aprender y utilizar el ERP Nyx de forma efectiva.
                </p>
              )}
            </PopupBody>
            <PopupFooter>
              <CloseButton onClick={handleClosePopup}>
                <FontAwesomeIcon icon={faCheck} style={{ marginRight: '5px' }} />
                Entendido
              </CloseButton>
            </PopupFooter>
          </Popup>
        </>
      )}
    </WelcomeContainer>
  );
};

export default Welcome;