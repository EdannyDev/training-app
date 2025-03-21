import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Spinner from '@/frontend/components/spinner';
import ProgressBar from '../frontend/components/progressBar';
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
  ModalOverlay,
  ModalContainer,
  ModalTitle,
  ModalContent,
  DocumentButton,
  VideoButton,
  ModalCloseButton,
  ButtonTest,
  ButtonTestRetry,
  NotificationContainer,
  NotificationMessage,
  CloseButton
} from '../frontend/styles/training.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faExclamationTriangle, faSearch, faVideo, faTimes, faFileLines, faLayerGroup, faListUl, faListOl, faClipboard, faRotateRight } from '@fortawesome/free-solid-svg-icons';

const CapacitationPage = () => {
  const [materials, setMaterials] = useState({});
  const [filteredMaterials, setFilteredMaterials] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [noMaterialsError, setNoMaterialsError] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progressData, setProgressData] = useState({});
  const [role, setRole] = useState(null);
  const [allCompleted, setAllCompleted] = useState(false);
  const [evaluationPassed, setEvaluationPassed] = useState(false);
  const [evaluationFailed, setEvalationFailed] = useState(true);
  const router = useRouter();
  const [customNotification, setCustomNotification] = useState({ message: '', type: '' });
  const [retryCountDown, setRetryCountDown] = useState(null);
  const documentRef = useRef(null);

  const showCustomNotification = (message, type) => {
    setCustomNotification({ message, type });
    setTimeout(() => setCustomNotification({ message: '', type: '' }), 2000);
  };

  const minLength = 3;
  const maxLength = 50;

  useEffect(() => {
    const fetchMaterialsAndProgress = async () => {
      setLoading(true);
      setError('');
      setNoMaterialsError(false);
  
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        setRole(role);
        if (!token) {
          setError('No se encuentra el token de autenticación.');
          setLoading(false);
          return;
        }
  
        const response = await axios.get('https://backend-training-nni3.onrender.com/api/trainings', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.data || Object.keys(response.data).length === 0) {
          setNoMaterialsError(true);
          setFilteredMaterials({});
        } else {
          setMaterials(response.data);
          setFilteredMaterials(response.data);
        }

        if (role === "admin") {
          setLoading(false);
          return;
        }

        const userId = localStorage.getItem('userId');
        if (!userId) return;
  
        const progressResponse = await axios.get(`https://backend-training-nni3.onrender.com/api/progress/view/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!progressResponse.data || progressResponse.data.length === 0) {
          setProgressData({});
        } else {
          const progressMap = {};
          progressResponse.data.forEach(progress => {
            progressMap[progress.trainingId] = progress.progress;
          });
  
          setProgressData(progressMap);
        }
      } catch (err) {
        if (err.response) {
          if (err.response.status === 401) {
            setWarning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          } else if (err.response.status === 403) {
            setError('No tienes permisos para acceder a estos materiales.');
          } else if (err.response.status === 500) {
            setError('Error interno del servidor. Inténtalo más tarde.');
          } else {
            setError('Error al cargar los materiales o el progreso.');
          }
        } else if (err.request) {
          setError('No se pudo conectar con el servidor. Verifica tu conexión.');
        } else {
          setError('Ocurrió un error inesperado.');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchMaterialsAndProgress();
  }, []);

  useEffect(() => {
    const checkUserProgress = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("role");

            if (!userId || !token) {
                console.warn("Falta el userId o el token");
                return;
            }
            if (role === "admin") {
                return;
            }
            const progressResponse = await axios.get(
                `https://backend-training-nni3.onrender.com/api/progress/completed/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setAllCompleted(progressResponse.data.allCompleted);
        } catch (error) {
            if (error.response?.status === 403) {
                return;
            }
          console.error("Error verificando el progreso del usuario:", error);
        }
    };
    checkUserProgress();
  }, []);

  useEffect(() => {
    const checkEvaluationStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const evaluationResponse = await axios.get("https://backend-training-nni3.onrender.com/api/evaluations/status", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvaluationPassed(evaluationResponse.data.status === "aprobado");
        setEvalationFailed(evaluationResponse.data.status === "fallado");

      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("El usuario aún no tiene una evaluación asignada.");
          setEvaluationPassed(false);
          setEvalationFailed(true);
        } else {
          console.error("Error verificando el estado de la evaluación:", error);
        }
      }
    };

    if (allCompleted) {
      checkEvaluationStatus();
    }
  }, [allCompleted]);

  const handleSearch = (e) => {
    let query = e.target.value.trim().slice(0, maxLength);
    setSearchQuery(query);

    if (!query) {
      setError('');
      return setFilteredMaterials(materials);
    }

    if (query.length < minLength) {
      setError(`La búsqueda debe tener al menos ${minLength} caracteres.`);
      return setFilteredMaterials({});
    }

    setError('');
    const filtered = Object.keys(materials).reduce((acc, section) => {
      const filteredModules = Object.keys(materials[section]).reduce((modAcc, module) => {
        const filteredMaterialsForModule = materials[section][module].filter((material) =>
          [material.title, material.description, material.roles?.join(', '), material.submodule, material.section, material.module]
            .some(val => val?.toLowerCase().includes(query.toLowerCase()))
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

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isModalOpen]);  
  
  const openModal = async (training) => {
    if (!training || !training._id) return;
  
    const type = training.video?.fileUrl ? "video" : training.document?.fileUrl ? "document" : null;
    if (!type) return;
  
    setError('');
    setLoading(true);
  
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        setError('No se encuentra el token de autenticación.');
        setLoading(false);
        return;
      }
      
      if (role !== "admin") {
        await startTraining(training._id, type);
      }
  
      const progressResponse = await axios.get(`https://backend-training-nni3.onrender.com/api/progress/view/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const userProgress = progressResponse.data.find(p => p.trainingId === training._id);
  
      if (userProgress) {
        setModalData({
          trainingId: training._id,
          type,
          fileUrl: training[type]?.fileUrl,
          originalFileName: training[type]?.originalFileName || 'Material',
          progress: userProgress.progress,
        });
  
        setIsModalOpen(true);
        setLoading(false);
        return;
      }
  
      await startTraining(training._id, type);
      
      setModalData({
        trainingId: training._id,
        type,
        fileUrl: training[type]?.fileUrl,
        originalFileName: training[type]?.originalFileName || 'Material',
        progress: userProgress ? userProgress.progress : 0,
      });      
  
      setIsModalOpen(true);
    } catch (err) {
      setError('Error al abrir la capacitación.');
    } finally {
      setLoading(false);
    }
  };  

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const startTraining = async (trainingId, type) => {
    if (role === "admin") return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return setError('No se encuentra el token de autenticación');

      await axios.post('https://backend-training-nni3.onrender.com/api/progress/start', { trainingId, type }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return;
      }
      if (role !== "admin") {
        setError('Error al iniciar capacitación');
      }
    }
  };

  const updateProgress = async (trainingId, newProgress) => {
    if (role === "admin") return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return setError('No se encuentra el token de autenticación.');
  
      const response = await axios.post('https://backend-training-nni3.onrender.com/api/progress/progress', {
        trainingId,
        progress: newProgress,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data.message === 'Progreso guardado correctamente') {
        setProgressData(prev => ({ ...prev, [trainingId]: newProgress }));
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return;
      }
      if (role !== "admin") {
        setError('Error al guardar el progreso.');
      }
    }
  };

  const startDocumentProgressTracking = (trainingId) => {
    let elapsedTime = 0;
    const interval = setInterval(() => {
      elapsedTime += 10;
      const progress = (elapsedTime / 300) * 100;
      updateProgress(trainingId, Math.min(progress, 100));
  
      if (elapsedTime >= 300) {
        updateProgress(trainingId, 100);
        clearInterval(interval);
      }
    }, 10000);
  };  
  
  const handleVideoProgress = (event, trainingId) => {
  const video = event.target;
  const newProgress = (video.currentTime / video.duration) * 100;
    updateProgress(trainingId, Math.min(newProgress, 100));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };  

  const handleRetryEvaluation = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showCustomNotification("No se encontró el token de autenticación.", "error");
        return;
      }
  
      const response = await axios.post(
        "https://backend-training-nni3.onrender.com/api/evaluations/retry",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.message) {
        showCustomNotification(response.data.message, "success");
        router.push("/evaluation");
      }
    } catch (error) {
      if (error.response?.data?.error) {
        showCustomNotification(error.response.data.error, "error");
  
        if (error.response.data.error.includes("Ya has aprobado")) {
          setRetryDisabled(true);
          return;
        }
  
        if (error.response.data.error.includes("límite de intentos")) {
          showCustomNotification("Has alcanzado el máximo de intentos hoy. Inténtalo mañana.", "error");
          return;
        }
  
        if (error.response.data.remainingTime) {
          const timeLeft = Math.ceil(error.response.data.remainingTime / 1000);
          setRetryCountDown(timeLeft);
  
          const interval = setInterval(() => {
            setRetryCountDown((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                showCustomNotification("¡Ya puedes volver a intentar la evaluación!", "info");
                return null;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } else {
        showCustomNotification("Error al intentar reintentar la evaluación.", "error");
      }
    }
  };  

  const goToEvaluation = () => {
    router.push("/evaluation");
  };

  const getFileExtension = (url) => {
    return url.split('.').pop();
  };

  return (
    <>
      {customNotification.message && (
        <NotificationContainer type={customNotification.type}>
          <FontAwesomeIcon icon={faExclamationCircle} style={{ marginBottom: '2px' }} />
          <NotificationMessage>{customNotification.message}</NotificationMessage>
          <CloseButton onClick={() => setCustomNotification({ message: '', type: '' })} style={{ marginTop: '2px' }} >
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
        </NotificationContainer>
      )}
      {retryCountDown !== null && (
        <div style={{
          position: "fixed",
          top: "70px",
          left: "11%",
          transform: "translateX(-50%)",
          background: "#ffcc00",
          color: "#333",
          padding: "12px 20px",
          borderRadius: "6px",
          fontSize: "18px",
          fontWeight: "bold",
          zIndex: 1000,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
        }}>
          Tiempo restante: {formatTime(retryCountDown)}
        </div>
      )}
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
          {noMaterialsError && (
            <ErrorBadge>
              <FontAwesomeIcon icon={faExclamationCircle} style={{ fontSize: '15px' }} /> No hay materiales de capacitación disponibles.
            </ErrorBadge>
          )}
  
          {!noMaterialsError && !loading && Object.keys(filteredMaterials).length > 0 ? (
          Object.keys(filteredMaterials).map((section) => (
            <div key={section}>
              <SectionTitle><FontAwesomeIcon icon={faLayerGroup} /> Sección: {section}</SectionTitle>
              {Object.keys(filteredMaterials[section]).map((module) => (
                <div key={module}>
                  <ModuleContainer>
                    <ModuleTitle><FontAwesomeIcon icon={faListUl} /> Módulo: {module || 'Sin módulo'}</ModuleTitle>
                    {filteredMaterials[section][module].length > 0 &&
                      filteredMaterials[section][module].map((material) => (
                        <MaterialContainer key={material._id}>
                          <MaterialTitle>Título: {material.title}</MaterialTitle>
                          <MaterialDescription>Descripción: {material.description}</MaterialDescription>
                          <MaterialRoles>Roles asignados: {material.roles?.join(', ') || 'No asignados'}</MaterialRoles>
                          {material.submodule ? (
                            <SubmoduleTitle><FontAwesomeIcon icon={faListOl} /> Submódulo: {material.submodule}</SubmoduleTitle>
                          ) : (
                            <NoSubmoduleText>Sin submódulo</NoSubmoduleText>
                          )}
                          <div>
                            {material.document?.fileUrl && (
                              <DocumentButton onClick={() => openModal(material)}>
                                <FontAwesomeIcon icon={faFileLines} style={{ marginRight: '8px' }} /> Documento
                              </DocumentButton>
                            )}
                            {material.video?.fileUrl && material.document?.fileUrl && (
                              <span style={{ margin: '0 6px 0 6px', fontSize: '29px' }}>|</span>
                            )}
                            {material.video?.fileUrl && (
                              <VideoButton onClick={() => openModal(material)}>
                                <FontAwesomeIcon icon={faVideo} style={{ marginRight: '8px' }} /> Video
                              </VideoButton>
                            )}
                          </div>
                          {role !== "admin" && (
                            <ProgressBar progress={progressData[material._id] || 0} />
                          )}
                        </MaterialContainer>
                      ))
                    }
                  </ModuleContainer>
                  <SectionDivider />
                </div>
              ))}
            </div>
          ))
        ) : null}
          {allCompleted && !evaluationPassed && !evaluationFailed && (
            <ButtonTest onClick={goToEvaluation}>
              <FontAwesomeIcon icon={faClipboard} /> 
              Presentar Evaluación
            </ButtonTest>
          )}

          {allCompleted && evaluationFailed && (
            <ButtonTestRetry onClick={handleRetryEvaluation} disabled={retryCountDown !== null}  style={{ background: retryCountDown !== null ? "#d3d3d3" : "#f0a500", cursor: retryCountDown !== null ? "not-allowed" : "pointer" }}>
              <FontAwesomeIcon icon={faRotateRight} /> 
                Reintentar Evaluación
            </ButtonTestRetry>
          )}
        </ContentContainer>
      )}
  
      {isModalOpen && modalData && (
        <ModalOverlay>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalTitle>
            {modalData?.originalFileName ? `${modalData.originalFileName}.${getFileExtension(modalData.fileUrl)}` : 'Material'}
          </ModalTitle>
            {role !== "admin" && (
            <ProgressBar progress={progressData[modalData.trainingId] || 0} />
            )}
            <div style={{ marginBottom: '5px' }}/>
            <ModalContent>
            {modalData?.fileUrl ? (
              modalData.fileUrl.endsWith('.pdf') ? (
                <iframe
                  ref={documentRef}
                  title="Material"
                  src={modalData.fileUrl}
                  style={{ width: "100%", height: "70vh", border: "none" }}
                  onLoad={() => {
                    startDocumentProgressTracking(modalData.trainingId);
                  }}
                />
              ) : modalData.fileUrl.endsWith('.mp4') ? (
                <video
                  width="100%"
                  height="auto"
                  controls
                  autoPlay
                  onLoadedMetadata={(event) => {
                    if (modalData.progress > 0) {
                      event.target.currentTime = (modalData.progress / 100) * event.target.duration;
                    }
                  }}
                  onTimeUpdate={(event) => handleVideoProgress(event, modalData.trainingId)}
                >
                  <source src={modalData.fileUrl} type="video/mp4" />
                  Tu navegador no soporta la etiqueta de video.
                </video>
              ) : null
            ) : (
              <p>Este material no está disponible.</p>
            )}
            </ModalContent>
            <ModalCloseButton onClick={closeModal}>
              <FontAwesomeIcon icon={faTimes} />
            </ModalCloseButton>
          </ModalContainer>
        </ModalOverlay>
      )}
    </>
  );  
};

export default CapacitationPage;