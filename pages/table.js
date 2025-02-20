import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Spinner from '@/frontend/components/spinner';
import {
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Input,
  AddButton,
  ActionButton,
  SearchContainer,
  InputContainer,
  SearchIcon,
  FileLink,
  Title,
  PaginationContainer,
  PaginationButton,
  FAQButton
} from '../frontend/styles/table.styles';
import DeleteConfirmationModal from '../frontend/components/modalDelete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faFileCirclePlus, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import Notification from '../frontend/components/notification';

const TrainingTable = () => {
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const minLength = 3;
  const maxLength = 50;

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/training', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const trainingsArray = Object.values(data).flatMap(modules =>
        Object.values(modules).flatMap(training => training)
      );

      setTrainings(trainingsArray);
      setFilteredTrainings(trainingsArray);
    } catch (error) {
      setNotification({ type: 'error', message: 'Error al cargar las capacitaciones' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    let query = e.target.value;  
    query = query.replace(/\s+/g, ' ');
    
    if (query.length > maxLength) {
      query = query.slice(0, maxLength);
    }
    setSearchTerm(query);
  
    if (query === '') {
      setFilteredTrainings(trainings);
      setNotification(null);
      return;
    }
  
    if (query.length < minLength || query.length > maxLength) {
      setNotification({
        type: 'error',
        message: `La búsqueda debe tener entre ${minLength} y ${maxLength} caracteres.`
      });
      setFilteredTrainings([]);
      return;
    } else {
      setNotification(null);
    }
  
    const filtered = trainings.filter((training) =>
      [training.title, training.description, training.type, training.roles.join(', '), 
       training.originalFileName, training.fileUrl, training.section, training.module, training.submodule]
       .some(val => val?.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredTrainings(filtered);
  };  

  const handlePagination = (pageNumber) => {
    const totalPages = Math.ceil(filteredTrainings.length / 5);
    if (pageNumber > totalPages) {
      setCurrentPage(totalPages);
    } else {
      setCurrentPage(pageNumber);
    }
  };

  const handleAddTraining = () => router.push('/addTraining');
  const handleGoToFAQ = () => router.push('/faqs');

  const handleDeleteClick = (training) => {
    setSelectedTraining(training);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/training/${selectedTraining._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const updatedTrainings = trainings.filter(t => t._id !== selectedTraining._id);
      setTrainings(updatedTrainings);
      setFilteredTrainings(updatedTrainings);
      setModalOpen(false);
      const totalPages = Math.ceil(updatedTrainings.length / 5);
      const lastPageWithData = totalPages > 0 ? totalPages : 1;
      if ((currentPage - 1) * 5 >= updatedTrainings.length) {
        const newPage = Math.max(currentPage - 1, 1);
        setCurrentPage(newPage);
      }
      setNotification({ type: 'success', message: 'Capacitación eliminada exitosamente' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Error al eliminar la capacitación' });
    }
  };

  const currentTrainings = filteredTrainings.slice((currentPage - 1) * 5, currentPage * 5);
  const totalPages = Math.ceil(filteredTrainings.length / 5);

  return (
    <Container>
      <Title>Control de Capacitación</Title>
      <SearchContainer>
        <InputContainer>
          <Input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearchChange}
            maxLength={maxLength}
          />
          <SearchIcon>
            <FontAwesomeIcon icon={faSearch} />
          </SearchIcon>
        </InputContainer>
        <FAQButton onClick={handleGoToFAQ}>
          <FontAwesomeIcon icon={faCircleQuestion} /> Ir a FAQs
        </FAQButton>
        <AddButton onClick={handleAddTraining}>
          <FontAwesomeIcon icon={faFileCirclePlus} /> Agregar Capacitación
        </AddButton>
      </SearchContainer>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {loading ? (
        <Spinner />
      ) : (
        <>
          <Table>
            <TableHead>
              <tr>
                {['Título', 'Descripción', 'Tipo', 'Roles', 'Sección', 'Módulo', 'Submódulo', 'Archivo', 'Acciones'].map((header) => (
                  <TableCell key={header} className={header === 'Acciones' ? '' : 'center'}>{header}</TableCell>
                ))}
              </tr>
            </TableHead>
            <TableBody>
              {currentTrainings.map((training, index) => (
                <TableRow key={training._id} className={index % 2 === 0 ? 'striped' : ''}>
                  <TableCell>{truncateText(training.title, 20)}</TableCell>
                  <TableCell>{truncateText(training.description, 30)}</TableCell>
                  <TableCell className="center">
                    {training.document && training.video ? 'Documento y Video' : training.document ? 'Documento' : 'Video'}
                  </TableCell>
                  <TableCell className="center">{truncateText(training.roles.join(', '), 20)}</TableCell>
                  <TableCell className="center">{truncateText(training.section, 30, 'Sección no disponible')}</TableCell>
                  <TableCell className="center">{truncateText(training.module, 30, 'Módulo no disponible')}</TableCell>
                  <TableCell className="center">{truncateText(training.submodule, 30, 'Submódulo no disponible')}</TableCell>
                  <TableCell className="center">
                    <ul>
                      {training.document && (
                        <li>
                          <FileLink href={training.document.fileUrl} target="_blank" rel="noopener noreferrer">
                            {truncateText(training.document.originalFileName, 30)}.{training.document.fileUrl.split('.').pop()}
                          </FileLink>
                        </li>
                      )}
                      {training.video && (
                        <li>
                          <FileLink href={training.video.fileUrl} target="_blank" rel="noopener noreferrer">
                            {truncateText(training.video.originalFileName, 30)}.{training.video.fileUrl.split('.').pop()}
                          </FileLink>
                        </li>
                      )}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <ActionButton className="edit" onClick={() => router.push(`/editTraining/${training._id}`)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </ActionButton>
                    <ActionButton className="delete" onClick={() => handleDeleteClick(training)}>
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
        </>
      )}

      <DeleteConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onDelete={handleDelete}
        title={selectedTraining?.title}
      />
    </Container>
  );

  function truncateText(text, length, fallback = '') {
    return text && text.length > length ? `${text.slice(0, length)}...` : (text || fallback);
  }
};

export default TrainingTable;