import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  Container,
  Title,
  Form,
  Input,
  Textarea,
  FileInput,
  PreviewContainer,
  CheckboxContainer,
  SectionTitle,
  ButtonContainer,
  AddButton,
  BackButton,
} from '../frontend/styles/addTraining.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFileCirclePlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import Notification from '../frontend/components/notification';

const AddTraining = () => {
  const router = useRouter();
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
    videoName: ''
  });

  const [previewDocument, setPreviewDocument] = useState('');
  const [previewVideo, setPreviewVideo] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  const allRoles = ['asesor', 'asesorJR', 'gerente_sucursal', 'gerente_zona'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        if (error) return showNotification('Error al cargar el documento.', 'error');

        if (result.event === 'success') {
          const uploadedFile = result.info;
          const fileUrl = uploadedFile.secure_url;
          const extension = fileUrl.split('.').pop().toLowerCase();

          if (!['pdf', 'docx', 'pptx'].includes(extension)) {
            return showNotification('Solo se permiten documentos (PDF, DOCX, PPTX).', 'error');
          }

          setFormData((prev) => ({
            ...prev,
            documentUrl: fileUrl,
            documentName: uploadedFile.original_filename,
          }));

          setPreviewDocument(fileUrl);
          showNotification('Documento cargado con éxito.');
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
        if (error) return showNotification('Error al cargar el video.', 'error');

        if (result.event === 'success') {
          const uploadedFile = result.info;
          const fileUrl = uploadedFile.secure_url;
          const extension = fileUrl.split('.').pop().toLowerCase();

          if (extension !== 'mp4') {
            return showNotification('Solo se permiten videos en formato MP4.', 'error');
          }

          setFormData((prev) => ({
            ...prev,
            videoUrl: fileUrl,
            videoName: uploadedFile.original_filename,
          }));

          setPreviewVideo(fileUrl);
          showNotification('Video cargado con éxito.');
        }
      }
    );
    widget.open();
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const validateInputs = () => {
    if (formData.title.length < 5 || formData.title.length > 100) {
      showNotification('El título debe tener entre 5 y 100 caracteres.', 'error');
      return false;
    }
    if (formData.description.length < 10 || formData.description.length > 500) {
      showNotification('La descripción debe tener entre 10 y 500 caracteres.', 'error');
      return false;
    }
    if (formData.section.length < 3 || formData.section.length > 50) {
      showNotification('La sección debe tener entre 3 y 50 caracteres.', 'error');
      return false;
    }
    if (formData.module && (formData.module.length < 3 || formData.module.length > 50)) {
      showNotification('El módulo debe tener entre 3 y 50 caracteres.', 'error');
      return false;
    }
    if (formData.submodule && (formData.submodule.length < 3 || formData.submodule.length > 50)) {
      showNotification('El submódulo debe tener entre 3 y 50 caracteres.', 'error');
      return false;
    }
    if (!formData.roles.length) {
      showNotification('Debes seleccionar al menos un rol.', 'error');
      return false;
    }
    if (!(formData.documentUrl || formData.videoUrl)) {
      showNotification('Debes cargar al menos un archivo (documento o video).', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return showNotification('No hay token de autenticación', 'error');
    if (!validateInputs()) return;

    const data = { ...formData };

    try {
      await axios.post('https://backend-training-cs9o.onrender.com/api/trainings', data, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });

      showNotification('Capacitación agregada con éxito');
      setTimeout(() => router.push('/table'), 3000);
    } catch (error) {
      showNotification(error.response?.data?.error || 'Error al agregar la capacitación', 'error');
    }
  };

  return (
    <Container>
      {notification.message && <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />}

      <Form onSubmit={handleSubmit}>
        <Title>Agregar Capacitación</Title>

        <Input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Título" required maxLength="100" />
        <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descripción" required maxLength="500" />
        <Input type="text" name="section" value={formData.section} onChange={handleChange} placeholder="Sección" required maxLength="50" />
        <Input type="text" name="module" value={formData.module} onChange={handleChange} placeholder="Módulo" maxLength="50" />
        <Input type="text" name="submodule" value={formData.submodule} onChange={handleChange} placeholder="Submódulo (opcional)" maxLength="50" />

        <FileInput><label onClick={handleDocumentUpload}><FontAwesomeIcon icon={faUpload} /> Seleccionar Documento</label></FileInput>
        <FileInput><label onClick={handleVideoUpload}><FontAwesomeIcon icon={faUpload} /> Seleccionar Video</label></FileInput>

        {previewDocument && <PreviewContainer><embed src={previewDocument} type="application/pdf" width="100%" height="300px" /></PreviewContainer>}
        {previewVideo && <PreviewContainer><video src={previewVideo} controls width="100%" /></PreviewContainer>}

        <SectionTitle>Asignar Roles</SectionTitle>
        <CheckboxContainer>
          <label>
            <input type="checkbox" checked={formData.roles.length === allRoles.length} onChange={() => setFormData((prev) => ({
              ...prev,
              roles: prev.roles.length === allRoles.length ? [] : allRoles,
            }))} /> Seleccionar todos
          </label>
          {allRoles.map((role) => (
            <label key={role}><input type="checkbox" checked={formData.roles.includes(role)} onChange={() => setFormData((prev) => ({
              ...prev,
              roles: prev.roles.includes(role) ? prev.roles.filter((r) => r !== role) : [...prev.roles, role],
            }))} /> {role}</label>
          ))}
        </CheckboxContainer>

        <ButtonContainer>
          <AddButton type="submit"><FontAwesomeIcon icon={faFileCirclePlus} /> Agregar Capacitación</AddButton>
          <BackButton type="button" onClick={() => router.push('/table')}><FontAwesomeIcon icon={faArrowLeft} /> Regresar</BackButton>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default AddTraining;