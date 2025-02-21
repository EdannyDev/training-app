import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Notification from '../../frontend/components/notification';
import Spinner from '@/frontend/components/spinner';
import { 
  EditFAQContainer, 
  EditFAQCard,
  EditFAQTitle, 
  EditFAQInput, 
  EditFAQTextArea, 
  EditFAQButton, 
  BackButton, 
  RoleContainer, 
  RoleLabel, 
  ButtonGroup 
} from '../../frontend/styles/editFAQ.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';

const EditFAQ = () => {
  const [faq, setFaq] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [roles, setRoles] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchFAQ = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`https://backend-training-u5az.onrender.com/api/faqs/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setFaq(data);
          setQuestion(data.question);
          setAnswer(data.answer);
          setRoles(data.roles);
        } catch (error) {
          setNotification({ show: true, message: 'Error al cargar el FAQ. Intenta nuevamente.', type: 'error' });
        } finally {
          setLoading(false);
        }
      };
      fetchFAQ();
    }
  }, [id]);

  const handleRoleChange = ({ target: { value } }) => {
    setRoles((prev) => prev.includes(value) ? prev.filter((role) => role !== value) : [...prev, value]);
  };

  const validateField = (value, minLength, maxLength, fieldName) => {
    if (value.trim().length < minLength || value.trim().length > maxLength) {
      setNotification({ show: true, message: `${fieldName} debe tener entre ${minLength} y ${maxLength} caracteres.`, type: 'error' });
      return false;
    }
    return true;
  };

  const validateRoles = () => {
    if (roles.length === 0) {
      setNotification({ show: true, message: 'Selecciona al menos un rol para este FAQ.', type: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isQuestionValid = validateField(question, 5, 100, 'La pregunta');
    const isAnswerValid = validateField(answer, 10, 500, 'La respuesta');
    const areRolesValid = validateRoles();

    if (!(isQuestionValid && isAnswerValid && areRolesValid)) return;

    const updatedData = { question, answer, roles };
    const hasChanges = question !== faq.question || answer !== faq.answer || JSON.stringify(roles) !== JSON.stringify(faq.roles);

    if (!hasChanges) {
      setNotification({ show: true, message: 'No se han detectado cambios para actualizar el FAQ.', type: 'error' });
      return;
    }

    try {
      await axios.put(`https://backend-training-u5az.onrender.com/api/faqs/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setNotification({ show: true, message: 'Cambios guardados correctamente. Verifica en la lista de FAQs.', type: 'success' });
      setTimeout(() => {
        setNotification({ show: false });
        router.push('/faqs');
      }, 3000);
    } catch (error) {
      setNotification({ show: true, message: 'Error al actualizar el FAQ. Verifica los datos e intenta nuevamente.', type: 'error' });
    }
  };

  const handleBackButtonClick = (e) => {
    e.preventDefault();
    router.push('/faqs');
  };

  return (
    <>
    {loading ? (
      <Spinner />
    ) : (    
    <EditFAQContainer>
      {notification.show && <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ show: false })} />}
      <EditFAQCard>
        <EditFAQTitle>Editar FAQ</EditFAQTitle>
        <form onSubmit={handleSubmit}>
          <EditFAQInput
            type="text"
            placeholder="Pregunta"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength="100"
            required
          />
          <EditFAQTextArea
            placeholder="Respuesta"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            maxLength="500"
            required
          />
          <RoleContainer>
            <label>Roles:</label>
            <div>
              {['asesor', 'asesorJR', 'gerente_sucursal', 'gerente_zona'].map((role) => (
                <RoleLabel key={role}>
                  <input
                    type="checkbox"
                    value={role}
                    checked={roles.includes(role)}
                    onChange={handleRoleChange}
                  />
                  {role.replace('_', ' ').replace(/^./, (char) => char.toUpperCase())}
                </RoleLabel>
              ))}
            </div>
          </RoleContainer>
          <ButtonGroup>
            <EditFAQButton type="submit">
              <FontAwesomeIcon icon={faSave} /> Actualizar FAQ
            </EditFAQButton>
            <BackButton onClick={handleBackButtonClick}>
              <FontAwesomeIcon icon={faArrowLeft} /> Regresar
            </BackButton>
          </ButtonGroup>
        </form>
      </EditFAQCard>
    </EditFAQContainer>
    )}
   </>
  );
};

export default EditFAQ;