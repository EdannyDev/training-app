import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Spinner from '@/frontend/components/spinner';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ProfileContainer, FormContainer, InputContainer, InputWrapper, Icon, ToggleIcon, Input, Description, Line, Button, ButtonContainer } from '../frontend/styles/profile.styles';
import Notification from '../frontend/components/notification';
import DeleteConfirmationModal from '../frontend/components/modalDelete';

const Profile = () => {
  const [user, setUser] = useState({ name: '', email: '', newPassword: '', role: '' });
  const [userRole, setUserRole] = useState('');
  const [originalData, setOriginalData] = useState({ name: '', email: '', role: '' });
  const [notification, setNotification] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('https://backend-training-u5az.onrender.com/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setUser({ ...data, newPassword: '' });
        setOriginalData({ ...data, password: '' });
        setUserRole(data.role);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          showNotification('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'warning');
        } else {
          showNotification('Error al cargar el perfil', 'error');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, []);  

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const validateName = (value) => {
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
    if (value.length < 3 || value.length > 30) {
      showNotification("El nombre debe tener entre 3 y 30 caracteres.", 'error');
      return false;
    } else if (!nameRegex.test(value)) {
      showNotification("El nombre solo puede contener letras y espacios.", 'error');
      return false;
    }
    return true;
  };

  const validateEmail = (value) => {
    if (value.length < 5 || value.length > 50) {
      showNotification("El correo debe tener entre 5 y 50 caracteres.", 'error');
      return false;
    }
    return true;
  };

  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    if (!passwordRegex.test(value)) {
      showNotification("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.", 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isNameValid = validateName(user.name);
    const isEmailValid = validateEmail(user.email);
    const isPasswordValid = user.newPassword ? validatePassword(user.newPassword) : true;

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      return;
    }

    if (user.name === originalData.name && user.email === originalData.email && !user.newPassword) {
      showNotification('No has modificado ningún dato. Realiza cambios para actualizar.', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put('https://backend-training-u5az.onrender.com/api/users/profile', {
        name: user.name, email: user.email, password: user.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (user.newPassword) {
        showNotification('Contraseña actualizada. Cerrando sesión...', 'success');
        setTimeout(() => { 
          localStorage.removeItem('token'); 
          router.push('/login'); 
        }, 2000);
      } else {
        showNotification('Perfil actualizado. Verifica los cambios.', 'success');
        setOriginalData(user);
      }
    } catch {
      showNotification('Error al actualizar el perfil', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
        if (!token) {
      showNotification('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'warning');
      return;
    }
    try {
      const response = await axios.get('https://backend-training-u5az.onrender.com/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsModalOpen(false);
      showNotification('Cuenta eliminada exitosamente.', 'success');
      setTimeout(async () => {
        try {
          await axios.delete('https://backend-training-u5az.onrender.com/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          localStorage.removeItem('token');
          router.push('/login');
        } catch (error) {
          showNotification('Error al eliminar la cuenta', 'error');
        }
      }, 3000);
    } catch (error) {
      setIsModalOpen(false);
      showNotification('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'warning');
    }
  };  

  return (
    <>
    {loading ? (
    <Spinner />
    ) : (
    <ProfileContainer>
      <h1>Configuración de Perfil</h1>
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

      <FormContainer onSubmit={handleSubmit}>
        <InputContainer>
          <InputWrapper>
            <Icon><FontAwesomeIcon icon={faUser} /></Icon>
            <Input
              type="text"
              name="name"
              placeholder="Nombre"
              value={user.name}
              onChange={handleChange}
              maxLength="30"
            />
          </InputWrapper>
          <Description>Nombre con el que aparecerás en la app.</Description>
        </InputContainer>
        <Line />

        <InputContainer>
          <InputWrapper>
            <Icon><FontAwesomeIcon icon={faEnvelope} /></Icon>
            <Input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={user.email}
              onChange={handleChange}
              maxLength="50"
              disabled={userRole !== 'admin'}
            />
          </InputWrapper>
            {userRole === 'admin' ? (
              <Description>
                Correo del administrador. Tienes acceso total en la app.
              </Description>
            ) : (
              <Description>
                Correo asociado a tu puesto en ventas. <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>NO</span> es editable.
              </Description>
            )}
        </InputContainer>
        <Line />

        <InputContainer>
          <InputWrapper>
            <Icon><FontAwesomeIcon icon={faLock} /></Icon>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              placeholder="Nueva contraseña"
              value={user.newPassword}
              onChange={handleChange}
              maxLength="20"
            />
            <ToggleIcon onClick={() => setShowPassword(!showPassword)}>
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </ToggleIcon>
          </InputWrapper>
          <Description>Usa una contraseña segura y fácil de recordar.</Description>
        </InputContainer>
        <Line />

        <InputContainer>
          <p><strong>Rol:</strong> {user.role}</p>
          <Description>
            Tu rol asignado dentro del sistema. <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>NO</span> es editable.
          </Description>
        </InputContainer>
        <Line />

        <ButtonContainer>
          <Button type="submit" className="update"><FontAwesomeIcon icon={faSave} /> Actualizar Perfil</Button>
          <Button type="button" className="delete" onClick={() => setIsModalOpen(true)}>
            <FontAwesomeIcon icon={faTrash} /> Eliminar Cuenta
          </Button>
        </ButtonContainer>
      </FormContainer>

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDeleteAccount}
      />
    </ProfileContainer>
    )}
   </>
  );
};

export default Profile;