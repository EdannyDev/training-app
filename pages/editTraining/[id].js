import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Notification from '../../frontend/components/notification';
import Spinner from '@/frontend/components/spinner';
import { 
  Container, 
  Title, 
  Form, 
  Input, 
  Textarea, 
  FileInput, 
  CheckboxContainer, 
  SectionTitle, 
  ButtonContainer, 
  BackButton, 
  EditTrainingButton, 
  DeleteButton,
  FilePreviewContainer
} from '../../frontend/styles/editTraining.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUpload, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

const EditTraining = () => {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    roles: [],
    section: '',
    module: '',
    submodule: '',
    documentUrl: '',
    videoUrl: '',
    documentName: '',
    videoName: '',
  });
  
  const [initialData, setInitialData] = useState(null);
  const [previewDocument, setPreviewDocument] = useState('');
  const [previewVideo, setPreviewVideo] = useState('');
  const [deleteDocument, setDeleteDocument] = useState(false);
  const [deleteVideo, setDeleteVideo] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [loading, setLoading] = useState(true);

  const allRoles = ['asesor', 'asesorJR', 'gerente_sucursal', 'gerente_zona'];

  useEffect(() => {
    const fetchTraining = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/training/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const { title, description, roles, section, module, submodule, document, video } = response.data;
        setFormData({
          title,
          description,
          roles,
          section,
          module,
          submodule,
          documentUrl: document?.fileUrl || '',
          videoUrl: video?.fileUrl || '',
          documentName: document?.originalFileName || '',
          videoName: video?.originalFileName || ''
        });
  
        setInitialData({
          title,
          description,
          roles,
          section,
          module,
          submodule,
          documentUrl: document?.fileUrl || '',
          videoUrl: video?.fileUrl || '',
          documentName: document?.originalFileName || '',
          videoName: video?.originalFileName || ''
        });
  
        setPreviewDocument(document?.fileUrl || '');
        setPreviewVideo(video?.fileUrl || '');
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setNotificationMessage('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          setNotificationType('warning');
          setShowNotification(true);
        } else {
          handleNotification('Error al cargar los datos del material', 'error');
        }
      } finally {
        setLoading(false);
      }    
    };
  
    if (id) fetchTraining();
  }, [id]);  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleRole = (role) => {
    setFormData((prev) => {
      const newRoles = prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role];
      return { ...prev, roles: newRoles };
    });
  };

  const handleSelectAllRoles = () => {
    if (formData.roles.length === allRoles.length) {
      setFormData((prev) => ({ ...prev, roles: [] }));
    } else {
      setFormData((prev) => ({ ...prev, roles: allRoles }));
    }
  };

  const handleDocumentUpload = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'darkdanny25',
        uploadPreset: 'jewl7kdx',
        sources: ['local', 'url'],
        resourceType: 'auto',
        folder: 'documents',
      },
      (error, result) => {
        if (error) return handleNotification('Error al cargar el documento.', 'error');

        if (result.event === 'success') {
          const uploadedFile = result.info;
          const fileUrl = uploadedFile.secure_url;
          const extension = fileUrl.split('.').pop().toLowerCase();

          if (!['pdf', 'docx', 'pptx'].includes(extension)) {
            return handleNotification('Solo se permiten documentos (PDF, DOCX, PPTX).', 'error');
          }

          setFormData((prev) => ({
            ...prev,
            documentUrl: fileUrl,
            documentName: uploadedFile.original_filename,
          }));

          setPreviewDocument(fileUrl);
          setDeleteDocument(false);
          handleNotification('Documento cargado con éxito.');
        }
      }
    );
    widget.open();
  };

  const handleVideoUpload = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'darkdanny25',
        uploadPreset: 'jewl7kdx',
        sources: ['local', 'url'],
        resourceType: 'video',
        folder: 'videos',
      },
      (error, result) => {
        if (error) return handleNotification('Error al cargar el video.', 'error');

        if (result.event === 'success') {
          const uploadedFile = result.info;
          const fileUrl = uploadedFile.secure_url;
          const extension = fileUrl.split('.').pop().toLowerCase();

          if (extension !== 'mp4') {
            return handleNotification('Solo se permiten videos en formato MP4.', 'error');
          }

          setFormData((prev) => ({
            ...prev,
            videoUrl: fileUrl,
            videoName: uploadedFile.original_filename,
          }));

          setPreviewVideo(fileUrl);
          setDeleteVideo(false);
          handleNotification('Video cargado con éxito.');
        }
      }
    );
    widget.open();
  };

  const handleDeleteDocument = () => {
    setFormData((prev) => ({ ...prev, documentUrl: '', documentName: '' }));
    setPreviewDocument('');
    setDeleteDocument(true);
  };

  const handleDeleteVideo = () => {
    setFormData((prev) => ({ ...prev, videoUrl: '', videoName: '' }));
    setPreviewVideo('');
    setDeleteVideo(true);
  };

  const handleNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const validateInputs = () => {
    if (formData.title.length < 5 || formData.title.length > 100) {
      handleNotification('El título debe tener entre 5 y 100 caracteres.', 'error');
      return false;
    }
    if (formData.description.length < 10 || formData.description.length > 500) {
      handleNotification('La descripción debe tener entre 10 y 500 caracteres.', 'error');
      return false;
    }
    if (formData.section.length < 3 || formData.section.length > 50) {
      handleNotification('La sección debe tener entre 3 y 50 caracteres.', 'error');
      return false;
    }
    if (formData.module && (formData.module.length < 3 || formData.module.length > 50)) {
      handleNotification('El módulo debe tener entre 3 y 50 caracteres.', 'error');
      return false;
    }
    if (formData.submodule && (formData.submodule.length < 3 || formData.submodule.length > 50)) {
      handleNotification('El submódulo debe tener entre 3 y 50 caracteres.', 'error');
      return false;
    }
    if (!formData.roles.length) {
      handleNotification('Debes seleccionar al menos un rol.', 'error');
      return false;
    }  
    if (!formData.documentUrl && !formData.videoUrl) {
      handleNotification('Debes subir al menos un archivo (documento o video).', 'error');
      return false;
    }
    return true;
  };

  const hasChanges = () => {
    const cleanFormData = { ...formData };
    delete cleanFormData.deleteDocument;
    delete cleanFormData.deleteVideo;

    const cleanInitialData = { ...initialData };
    delete cleanInitialData.deleteDocument;
    delete cleanInitialData.deleteVideo;

    return JSON.stringify(cleanFormData) !== JSON.stringify(cleanInitialData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return handleNotification('No hay token de autenticación', 'error');

    if (!validateInputs()) return;

    if (!hasChanges()) {
      handleNotification('No has realizado ningún cambio.', 'error');
      return;
    }

    const updatedData = {
      ...formData,
      deleteDocument,
      deleteVideo
    };

    try {
      await axios.put(`http://localhost:5000/api/training/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      handleNotification('Capacitación actualizada con éxito');
      setTimeout(() => router.push('/table'), 3000);
    } catch (error) {
      handleNotification(error.response?.data?.error || 'Error al actualizar la capacitación', 'error');
    }
  };

  return (
    <>
    {loading ? (
      <Spinner />
    ) : (
    <Container>
      {showNotification && (
        <Notification message={notificationMessage} type={notificationType} onClose={() => setShowNotification(false)} />
      )}
      <Form onSubmit={handleSubmit}>
        <Title>Editar Capacitación</Title>
        <Input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Título" required />
        <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descripción" required />
        <Input type="text" name="section" value={formData.section} onChange={handleChange} placeholder="Sección" required />
        <Input type="text" name="module" value={formData.module} onChange={handleChange} placeholder="Módulo" />
        <Input type="text" name="submodule" value={formData.submodule} onChange={handleChange} placeholder="Submódulo (opcional)" />

        <FileInput>
          <label onClick={handleDocumentUpload}>
            <FontAwesomeIcon icon={faUpload} /> Seleccionar Documento
          </label>
        </FileInput>
        {previewDocument && (
          <>
            <FilePreviewContainer>
              <embed src={previewDocument} type="application/pdf" width="100%" height="300px" />
            </FilePreviewContainer>
              <DeleteButton type="button" onClick={handleDeleteDocument}>
                <FontAwesomeIcon icon={faTrash} /> Eliminar Documento
              </DeleteButton>
          </>
        )}

        <FileInput>
          <label onClick={handleVideoUpload}>
            <FontAwesomeIcon icon={faUpload} /> Seleccionar Video
          </label>
        </FileInput>
        {previewVideo && (
          <>
            <FilePreviewContainer>
              <video src={previewVideo} controls width="100%" />
            </FilePreviewContainer>
              <DeleteButton type="button" onClick={handleDeleteVideo}>
                <FontAwesomeIcon icon={faTrash} /> Eliminar Video
              </DeleteButton>
          </>
        )}

        <SectionTitle>Asignar Roles</SectionTitle>
        <CheckboxContainer>
          <label>
            <input type="checkbox" checked={formData.roles.length === allRoles.length} onChange={handleSelectAllRoles} /> Seleccionar todos
          </label>
          {allRoles.map((role) => (
            <label key={role}>
              <input type="checkbox" checked={formData.roles.includes(role)} onChange={() => toggleRole(role)} />
              &nbsp;{role}
            </label>
          ))}
        </CheckboxContainer>

        <ButtonContainer>
          <EditTrainingButton type="submit">
            <FontAwesomeIcon icon={faSave} /> Actualizar Capacitación
          </EditTrainingButton>
          <BackButton type="button" onClick={() => router.push('/table')}>
            <FontAwesomeIcon icon={faArrowLeft} /> Regresar
          </BackButton>
        </ButtonContainer>
      </Form>
    </Container>
    )}
   </>
  );
};

export default EditTraining;