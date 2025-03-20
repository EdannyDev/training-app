import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { 
  Button, 
  Input, 
  FormContainer, 
  Title, 
  IconWrapper, 
  TextRedirect, 
  TogglePasswordButton, 
  Notification, 
  TipMessage 
} from '../frontend/styles/register.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash, faExclamationCircle, faCheckCircle, faUserShield } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSecurityCode, setShowSecurityCode] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showEmailTip, setShowEmailTip] = useState(false);
  const [showPasswordTip, setShowPasswordTip] = useState(false);
  const [showSecurityCodeTip, setShowSecurityCodeTip] = useState(false);
  const [nameError, setNameError] = useState(null);
  const router = useRouter();

  const validateName = (value) => {
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (value.trim() === '') {
      setNameError({ message: 'El nombre es obligatorio.', type: 'error' });
    } else if (!nameRegex.test(value)) {
      setNameError({ message: 'El nombre solo puede contener letras y espacios.', type: 'error' });
    } else {
      setNameError(null);
    }
    setName(value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setNotification(null);

    if (nameError) return;

    try {
      const response = await axios.post('https://backend-training-nni3.onrender.com/api/users/register', { name, email, password, securityCode });

      if (response.status === 201) {
        setNotification({ message: 'Registro exitoso. Por favor, Inicia Sesión.', type: 'success' });
        setTimeout(() => {
          setNotification(null);
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      setNotification({ message: 'Ocurrió un error al registrar.', type: 'error' });
    }
  };

  return (
    <>
      <FormContainer onSubmit={handleRegister}>
        <Title>Registro</Title>

        <div style={{ position: 'relative' }}>
          <IconWrapper>
            <FontAwesomeIcon icon={faUser} />
          </IconWrapper>
          <Input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => validateName(e.target.value)}
            required
            minLength="3"
            maxLength="30"
            onFocus={() => setNameError(null)}
            onBlur={() => {
              if (name.trim() === '') {
                setNameError({ message: 'El nombre es obligatorio.', type: 'error' });
              }
            }}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <IconWrapper>
            <FontAwesomeIcon icon={faEnvelope} />
          </IconWrapper>
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setShowEmailTip(e.target.value === '');
            }}
            onFocus={() => setShowEmailTip(email === '')}
            onBlur={() => setShowEmailTip(false)}
            required
            minLength="5"
            maxLength="50"
          />
          {showEmailTip && (
            <TipMessage>
              Tip: El email de acceso es tu nombre y rol, por ejemplo: <b>example@adviser.com</b> es para asesores.
            </TipMessage>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <IconWrapper>
            <FontAwesomeIcon icon={faLock} />
          </IconWrapper>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setShowPasswordTip(e.target.value === '');
            }}
            onFocus={() => setShowPasswordTip(password === '')}
            onBlur={() => setShowPasswordTip(false)}
            required
            minLength="8"
            maxLength="20"
          />
          <TogglePasswordButton type="button" onClick={() => setShowPassword(!showPassword)}>
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </TogglePasswordButton>
          {showPasswordTip && (
            <TipMessage>
              Tip: La contraseña debe tener al menos 8 caracteres, una <b>mayúscula</b>, una <b>minúscula</b>, un <b>número</b> y un <b>carácter especial</b>.
            </TipMessage>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <IconWrapper>
            <FontAwesomeIcon icon={faUserShield} />
          </IconWrapper>
          <Input
            type={showSecurityCode ? 'text' : 'password'}
            placeholder="Código de seguridad"
            value={securityCode}
            onChange={(e) => {
              setSecurityCode(e.target.value);
              setShowSecurityCodeTip(e.target.value === '');
            }}
            onFocus={() => setShowSecurityCodeTip(securityCode === '')}
            onBlur={() => setShowSecurityCodeTip(false)}
            required
            minLength="6"
            maxLength="20"
          />
          <TogglePasswordButton type="button" onClick={() => setShowSecurityCode(!showSecurityCode)}>
            <FontAwesomeIcon icon={showSecurityCode ? faEye : faEyeSlash} />
          </TogglePasswordButton>
          {showSecurityCodeTip && (
            <TipMessage>
              Tip: El código de seguridad debe ser personal y recuerda <b>GUARDARLO</b> de manera segura.
            </TipMessage>
          )}
        </div>

        <Button type="submit">Registrarme</Button>
        <TextRedirect>
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </TextRedirect>
      </FormContainer>

      {notification && (
        <Notification type={notification.type}>
          <FontAwesomeIcon icon={notification.type === 'error' ? faExclamationCircle : faCheckCircle} />
          {notification.message}
        </Notification>
      )}

      {nameError && (
        <Notification type="error">
          <FontAwesomeIcon icon={faExclamationCircle} />
          {nameError.message}
        </Notification>
      )}
    </>
  );
};

export default Register;