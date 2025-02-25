import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '@/frontend/components/spinner';
import {
  SectionTitle,
  ModuleContainer,
  ModuleTitle,
  MaterialContainer,
  MaterialTitle,
  MaterialDescription,
  Title,
  MaterialRoles,
  SubmoduleTitle,
  SectionDivider,
  ContentContainer,
  ErrorBadge,
  WarningBadge,
  InputSearch,
  IconWrapper,
  NoSubmoduleText,
  ButtonLink
} from '../frontend/styles/training.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faExclamationTriangle, faSearch } from '@fortawesome/free-solid-svg-icons';

const CapacitationPage = () => {
  const [materials, setMaterials] = useState({});
  const [filteredMaterials, setFilteredMaterials] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [noMaterialsError, setNoMaterialsError] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(true);

  const minLength = 3;
  const maxLength = 50;

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No se encuentra el token de autenticación');
          return;
        }

        const response = await axios.get('https://backend-training-u5az.onrender.com/api/training', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Object.keys(response.data).length === 0) {
          setNoMaterialsError(true);
        } else {
          setMaterials(response.data);
          setFilteredMaterials(response.data);
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setWarning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        } else {
          setError('Error al cargar los materiales');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const handleSearch = (e) => {
    let query = e.target.value;
    query = query.replace(/\s+/g, ' ');

    if (query.length > maxLength) {
      query = query.slice(0, maxLength);
    }
    setSearchQuery(query);

    if (query === '') {
      setError('');
      setFilteredMaterials(materials);
      return;
    }

    if (query.length < minLength) {
      setError(`La búsqueda debe tener al menos ${minLength} caracteres.`);
      setFilteredMaterials({});
      return;
    } else {
      setError('');
    }

    const filtered = Object.keys(materials).reduce((acc, section) => {
      const filteredModules = Object.keys(materials[section]).reduce((modAcc, module) => {
        const filteredMaterialsForModule = materials[section][module].filter((material) =>
          [
            material.title,
            material.description,
            material.roles?.join(', '),
            material.submodule,
            material.section,
            material.module,
          ].some(val => val?.toLowerCase().includes(query.toLowerCase()))
        );

        if (filteredMaterialsForModule.length > 0) {
          modAcc[module] = filteredMaterialsForModule;
        }

        return modAcc;
      }, {});

      if (Object.keys(filteredModules).length > 0) {
        acc[section] = filteredModules;
      }

      return acc;
    }, {});
    setFilteredMaterials(filtered);
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <ContentContainer>
          <Title>Material de Capacitación</Title>

          <InputSearch>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Búsqueda de Materiales..."
              maxLength={maxLength}
            />
            <IconWrapper>
              <FontAwesomeIcon icon={faSearch} />
            </IconWrapper>
          </InputSearch>

          <SectionDivider />

          {warning && (
            <WarningBadge>
              <FontAwesomeIcon icon={faExclamationTriangle} style={{ fontSize: '15px' }} /> {warning}
            </WarningBadge>
          )}

          {error && (
            <ErrorBadge>
              <FontAwesomeIcon icon={faExclamationCircle} style={{ fontSize: '15px' }} /> {error}
            </ErrorBadge>
          )}

          {noMaterialsError ? (
            <ErrorBadge>
              <FontAwesomeIcon icon={faExclamationCircle} style={{ fontSize: '15px' }} /> No hay materiales de capacitación disponibles.
            </ErrorBadge>
          ) : (
            Object.keys(filteredMaterials).map((section) => (
              <div key={section}>
                <SectionTitle>Sección: {section}</SectionTitle>
                {Object.keys(filteredMaterials[section]).map((module) => (
                  <div key={module}>
                    <ModuleContainer>
                      <ModuleTitle>Módulo: {module || 'Sin módulo'}</ModuleTitle>
                      {filteredMaterials[section][module].length > 0 ? (
                        filteredMaterials[section][module].map((material) => (
                          <MaterialContainer key={material._id}>
                            <MaterialTitle>Título: {material.title}</MaterialTitle>
                            <MaterialDescription>Descripción: {material.description}</MaterialDescription>
                            <MaterialRoles>Roles asignados: {material.roles?.join(', ') || 'No asignados'}</MaterialRoles>
                            {material.submodule ? (
                              <SubmoduleTitle>Submódulo: {material.submodule}</SubmoduleTitle>
                            ) : (
                              <NoSubmoduleText>Sin submódulo</NoSubmoduleText>
                            )}
                            <div>
                              {material.document?.fileUrl && (
                                <ButtonLink href={material.document.fileUrl} target="_blank" rel="noopener noreferrer">
                                  {material.document?.originalFileName}
                                </ButtonLink>
                              )}
                              {material.document?.fileUrl && material.video?.fileUrl && (
                                <span style={{ margin: '0 6px 0 -1px', fontSize: '18px' }}>|</span>
                              )}
                              {material.video?.fileUrl && (
                                <ButtonLink href={material.video.fileUrl} target="_blank" rel="noopener noreferrer">
                                  {material.video?.originalFileName}
                                </ButtonLink>
                              )}
                            </div>
                          </MaterialContainer>
                        ))
                      ) : (
                        <p>Este módulo no contiene materiales disponibles.</p>
                      )}
                    </ModuleContainer>
                    <SectionDivider />
                  </div>
                ))}
              </div>
            ))
          )}
        </ContentContainer>
      )}
    </>
  );
};

export default CapacitationPage;