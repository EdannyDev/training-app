import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { useRouter } from 'next/router';
import Spinner from '@/frontend/components/spinner';
import {
  Container,
  Title,
  SearchContainer,
  Input,
  AddButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  ActionButton,
  PaginationContainer,
  PaginationButton,
  SearchIcon,
  InputContainer,
  TrainingButton
} from '../frontend/styles/faqs.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrash, faFileLines, faClipboardQuestion } from '@fortawesome/free-solid-svg-icons';
import DeleteConfirmationModal from '../frontend/components/modalDelete';
import Notification from '../frontend/components/notification';

const FAQTable = () => {
  const [faqs, setFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [faqsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const minLength = 3;
  const maxLength = 50;

  const truncateText = (text, length = 20) => text.length > length ? `${text.slice(0, length)}...` : text;

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      try {
        const response = await API.get('/faqs');
        setFaqs(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setNotification({
            type: 'warning',
            message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
          });
          } else {
        setNotification({ message: 'Error al obtener las FAQs', type: 'error' });
        }
      } finally {
        setLoading(false);
      }  
    };

    fetchFaqs();
  }, []);

  const handleSearchChange = (e) => {
    let query = e.target.value;
    query = query.replace(/\s+/g, ' ');

    if (query.length > maxLength) {
      query = query.slice(0, maxLength);
    }
    setSearchTerm(query);
    
    if (query === '') {
      setNotification(null);
      return;
    }
    
    if (query.length < minLength || query.length > maxLength) {
      setNotification({
        type: 'error',
        message: `La búsqueda debe tener entre ${minLength} y ${maxLength} caracteres.`
      });
      return;
    } else {
      setNotification(null);
    }
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.roles.join(', ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastFAQ = currentPage * faqsPerPage;
  const indexOfFirstFAQ = indexOfLastFAQ - faqsPerPage;
  const currentFaqs = filteredFaqs.slice(indexOfFirstFAQ, indexOfLastFAQ);
  const totalPages = Math.ceil(filteredFaqs.length / faqsPerPage);

  const handlePagination = (pageNumber) => {
    if (pageNumber > totalPages) {
      setCurrentPage(totalPages);
    } else {
      setCurrentPage(pageNumber);
    }
  };

  const handleDeleteClick = (faq) => {
    setSelectedFAQ(faq);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await API.delete(`/faqs/${selectedFAQ._id}`);
      const updatedFaqs = faqs.filter(f => f._id !== selectedFAQ._id);
      setFaqs(updatedFaqs);
      setModalOpen(false);
      const newTotalPages = Math.ceil(updatedFaqs.length / faqsPerPage);
      if ((currentPage - 1) * faqsPerPage >= updatedFaqs.length) {
        setCurrentPage(Math.max(currentPage - 1, 1));
      }
      setNotification({ message: 'FAQ eliminada correctamente', type: 'success' });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setNotification({
          type: 'warning',
          message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
        });
      } else {
        setNotification({ message: 'Error al eliminar la FAQ', type: 'error' });
      }
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [modalOpen]);

  const handleAddFAQ = () => router.push('/addFAQ');
  const handleGoToTraining = () => router.push('/table');

  return (
    <>
    {loading ? (
      <Spinner />
    ) : (
    <Container>
      <Title>Control de FAQs</Title>
      <SearchContainer>
        <InputContainer>
          <Input
            type="text"
            placeholder="Buscar FAQ..."
            value={searchTerm}
            onChange={handleSearchChange}
            maxLength={maxLength}
          />
          <SearchIcon>
            <FontAwesomeIcon icon={faSearch} />
          </SearchIcon>
        </InputContainer>
        <TrainingButton onClick={handleGoToTraining}>
          <FontAwesomeIcon icon={faFileLines} /> Ir a Capacitación
        </TrainingButton>
        <AddButton onClick={handleAddFAQ}>
          <FontAwesomeIcon icon={faClipboardQuestion} /> Agregar FAQ
        </AddButton>
      </SearchContainer>

      <Table>
        <TableHead>
          <tr>
            <TableCell>Pregunta</TableCell>
            <TableCell>Respuesta</TableCell>
            <TableCell>Roles</TableCell>
            <TableCell>Acciones</TableCell>
          </tr>
        </TableHead>
        <TableBody>
          {currentFaqs.map((faq) => (
            <TableRow key={faq._id}>
              <TableCell>{truncateText(faq.question, 40)}</TableCell>
              <TableCell>{truncateText(faq.answer, 40)}</TableCell>
              <TableCell>{truncateText(faq.roles.join(', '), 40)}</TableCell>
              <TableCell>
                <ActionButton className="edit" onClick={() => router.push(`/editFAQ/${faq._id}`)}>
                  <FontAwesomeIcon icon={faEdit} />
                </ActionButton>
                <ActionButton className="delete" onClick={() => handleDeleteClick(faq)}>
                  <FontAwesomeIcon icon={faTrash} />
                </ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaginationContainer>
        {[...Array(totalPages)].map((_, index) => (
          <PaginationButton
            key={index}
            onClick={() => handlePagination(index + 1)}
            active={currentPage === index + 1}
          >
            {index + 1}
          </PaginationButton>
        ))}
      </PaginationContainer>



      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <DeleteConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onDelete={handleDelete}
        title={selectedFAQ?.question}
      />
    </Container>
    )}
   </>
  );
};

export default FAQTable;