import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '@/frontend/components/spinner';
import { 
  Container, 
  Title, 
  FAQList, 
  FAQItem, 
  Question, 
  Answer,
  Divider, 
  ErrorBadge,
  WarningBadge, 
  InputSearch,
  IconWrapper,
} from '../frontend/styles/faqPage.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faExclamationTriangle, faSearch } from '@fortawesome/free-solid-svg-icons';

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [noFAQsError, setNoFAQsError] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      setLoading(true);
      setError('');
      setNoFAQsError(false);
      setTokenExpired(false);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encuentra el token de autenticación');
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get('https://backend-training-231g.onrender.com/api/faqs', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.length === 0) {
          setNoFAQsError(true);
        } else {
          setFaqs(data);
          setFilteredFaqs(data);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            setTokenExpired(true);
          } else {
            setError('Error al obtener las FAQs');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const handleSearch = (e) => {
    let query = e.target.value;
    query = query.replace(/\s+/g, ' ');

    setSearchQuery(query);

    if (query.length === 0) {
      setFilteredFaqs(faqs);
      return;
    }

    const filtered = faqs.filter(({ question, answer }) =>
      question.toLowerCase().includes(query.toLowerCase()) ||
      answer.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredFaqs(filtered);
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (  
        <Container>
          <Title>Preguntas Frecuentes (FAQs)</Title>

          <InputSearch>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Búsqueda de FAQ..."
            />
            <IconWrapper>
              <FontAwesomeIcon icon={faSearch} />
            </IconWrapper>
          </InputSearch>

          <Divider />

          {tokenExpired && (
            <WarningBadge>
              <FontAwesomeIcon icon={faExclamationTriangle} style={{ fontSize: '15px' }} />
              &nbsp;Tu sesión ha expirado. Por favor, inicia sesión nuevamente.
            </WarningBadge>
          )}

          {noFAQsError && (
            <ErrorBadge>
              <FontAwesomeIcon icon={faExclamationCircle} style={{ fontSize: '15px' }} /> 
              &nbsp;No hay preguntas frecuentes disponibles.
            </ErrorBadge>
          )}

          {error && !tokenExpired && !noFAQsError && (
            <ErrorBadge>
              <FontAwesomeIcon icon={faExclamationCircle} style={{ fontSize: '15px' }} /> 
              {error}
            </ErrorBadge>
          )}

          <FAQList>
            {filteredFaqs.map(({ _id, question, answer }, index) => (
              <FAQItem key={_id} delay={index * 0.1}>
                <Question>{question}</Question>
                <Answer>{answer}</Answer>
                <Divider />
              </FAQItem>
            ))}
          </FAQList>
        </Container>
      )}
    </>
  );
};

export default FAQs;