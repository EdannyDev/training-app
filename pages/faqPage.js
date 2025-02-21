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
  InputSearch,
  IconWrapper,
} from '../frontend/styles/faqPage.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faSearch } from '@fortawesome/free-solid-svg-icons';

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [minLength] = useState(3);
  const [maxLength] = useState(50);
  const [noFAQsError, setNoFAQsError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encuentra el token de autenticación');
        return;
      }

      try {
        const { data } = await axios.get('https://backend-training-u5az.onrender.com/api/faqs', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.length === 0) {
          setNoFAQsError(true);
        } else {
          setFaqs(data);
          setFilteredFaqs(data);
        }
      } catch {
        setError('Error al obtener las FAQs');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const handleSearch = (e) => {
    let query = e.target.value;
    query = query.replace(/\s+/g, ' ');
    
    if (query.length > maxLength) {
      query = query.slice(0, maxLength);
    }
    setSearchQuery(query);

    if (query === '') {
      setFilteredFaqs(faqs);
      setError('');
      return;
    }

    if (query.length < minLength || query.length > maxLength) {
      setError(`La búsqueda debe tener entre ${minLength} y ${maxLength} caracteres.`);
      setFilteredFaqs([]);
      return;
    } else {
      setError('');
    }

    const filtered = faqs.filter(({ question, answer }) =>
      question.toLowerCase().includes(query) ||
      answer.toLowerCase().includes(query)
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
          maxLength={maxLength}
        />
        <IconWrapper>
          <FontAwesomeIcon icon={faSearch} />
        </IconWrapper>
      </InputSearch>
      <Divider />
      
      {error && (
        <ErrorBadge>
          <FontAwesomeIcon icon={faExclamationCircle} style={{ fontSize: '15px' }} /> {error}
        </ErrorBadge>
      )}

      {noFAQsError && (
        <ErrorBadge>
          <FontAwesomeIcon icon={faExclamationCircle} style={{ fontSize: '15px' }} /> No hay preguntas frecuentes disponibles.
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