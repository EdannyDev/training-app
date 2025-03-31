import { useEffect, useState } from 'react';
import API from '../utils/api';
import { useRouter } from 'next/router';
import Spinner from '@/frontend/components/spinner';
import {
  UserTableContainer,
  UserTable,
  UserTableHead,
  UserTableBody,
  UserTableRow,
  UserTableCell,
  UserActionButton,
  UserManagementTitle,
  SearchContainer,
  InputContainer,
  Input,
  ProgressButton,
  SearchIcon,
  PaginationContainer,
  PaginationButton,
} from '../frontend/styles/users.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsProgress, faSearch, faUserPen, faUserXmark } from '@fortawesome/free-solid-svg-icons';
import DeleteConfirmationModal from '../frontend/components/modalDelete';
import Notification from '../frontend/components/notification';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const usersPerPage = 5;
  const minLength = 3;
  const maxLength = 50;

  const truncateText = (text, length = 20) => text.length > length ? `${text.slice(0, length)}...` : text;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await API.get('/users/list');
        setUsers(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setNotification({
            show: true,
            message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            type: 'warning',
          });
        } else {
          setNotification({
            show: true,
            message: 'Error al cargar usuarios',
            type: 'error',
          });
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);  

  const handleSearch = (e) => {
    let query = e.target.value;
    query = query.replace(/\s+/g, ' ');
    
    if (query.length > maxLength) {
      query = query.slice(0, maxLength);
    }
    setSearchTerm(query);

    if (query === '') {
      setNotification({ show: false, message: '', type: '' });
      return;
    }

    if (query.length < minLength || query.length > maxLength) {
      setNotification({
        show: true,
        message: `La búsqueda debe tener entre ${minLength} y ${maxLength} caracteres.`,
        type: 'error',
      });
      return;
    } else {
      setNotification({ show: false, message: '', type: '' });
    }
  };

  const filteredUsers = users.filter(
    ({ name, email, role }) =>
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const handlePagination = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setModalOpen(true);
  };

  const handleDelete = () => {
    const token = localStorage.getItem('token');  
    if (!token) {
      setNotification({
        show: true,
        message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        type: 'warning',
      });
      setModalOpen(false);
      return;
    }
  
    setLoading(true);
    API.delete(`/users/delete/${userToDelete}`)
      .then(() => {
        const updatedUsers = users.filter((user) => user._id !== userToDelete);
        setUsers(updatedUsers);
        const newTotalPages = Math.ceil(updatedUsers.length / usersPerPage);
        if ((currentPage - 1) * usersPerPage >= updatedUsers.length) {
          const newPage = Math.max(currentPage - 1, 1);
          setCurrentPage(newPage);
        }
        setNotification({ show: true, message: 'Usuario eliminado exitosamente', type: 'success' });
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setNotification({
            show: true,
            message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            type: 'warning',
          });
        } else {
          setNotification({
            show: true,
            message: 'Error al eliminar el usuario',
            type: 'error',
          });
        }
      })
      .finally(() => {
        setModalOpen(false);
        setLoading(false);
        setUserToDelete(null);
      });
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

  const handleEdit = (userId) => router.push(`/editUser/${userId}`);

  return (
    <>
    {loading ? (
      <Spinner />
    ) : (
    <UserTableContainer>
      <UserManagementTitle>Control de Usuarios</UserManagementTitle>
      <SearchContainer>
        <InputContainer>
          <Input
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={handleSearch}
            maxLength={maxLength}
          />
          <SearchIcon>
            <FontAwesomeIcon icon={faSearch} />
          </SearchIcon>
        </InputContainer>
        <ProgressButton onClick={() => router.push('/progress')}>
          <FontAwesomeIcon icon={faBarsProgress} />
          &nbsp;Ver Progresos
        </ProgressButton>
      </SearchContainer>

      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ show: false, message: '', type: '' })}
        />
      )}

      <UserTable>
        <UserTableHead>
          <tr>
            <UserTableCell>Nombre</UserTableCell>
            <UserTableCell>Email</UserTableCell>
            <UserTableCell>Rol</UserTableCell>
            <UserTableCell>Acciones</UserTableCell>
          </tr>
        </UserTableHead>
        <UserTableBody>
          {currentUsers.map(({ _id, name, email, role }) => (
            <UserTableRow key={_id}>
              <UserTableCell>{truncateText(name, 40)}</UserTableCell>
              <UserTableCell>{truncateText(email, 40)}</UserTableCell>
              <UserTableCell>{truncateText(role, 40)}</UserTableCell>
              <UserTableCell>
                <UserActionButton className="edit" onClick={() => handleEdit(_id)}>
                  <FontAwesomeIcon icon={faUserPen} />
                </UserActionButton>
                <UserActionButton className="delete" onClick={() => handleDeleteClick(_id)}>
                  <FontAwesomeIcon icon={faUserXmark} />
                </UserActionButton>
              </UserTableCell>
            </UserTableRow>
          ))}
        </UserTableBody>
      </UserTable>

      <PaginationContainer>
        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationButton
            key={i + 1}
            onClick={() => handlePagination(i + 1)}
            active={currentPage === i + 1}
          >
            {i + 1}
          </PaginationButton>
        ))}
      </PaginationContainer>

      <DeleteConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onDelete={handleDelete}
      />
    </UserTableContainer>
    )}
   </>
  );
};

export default UserManagement;