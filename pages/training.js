import React, { useState, useEffect, useRef } from 'react';
import API from '../utils/api';
import { useRouter } from 'next/router';
import Spinner from '@/frontend/components/spinner';
import ProgressBar from '../frontend/components/progressBar';
import { SectionTitle, ModuleContainer, ModuleTitle, MaterialContainer, MaterialTitle, MaterialDescription, Title, MaterialRoles, SubmoduleTitle,
  SectionDivider, ContentContainer, ErrorBadge, WarningBadge, InputSearch, IconWrapper, NoSubmoduleText, ModalOverlay, ModalContainer, ModalTitle,
  ModalContent, DocumentButton, VideoButton, ModalCloseButton, ButtonTest, ButtonTestRetry, NotificationContainer, NotificationMessage,
  CloseButton } from '../frontend/styles/training.styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faExclamationTriangle, faSearch, faVideo, faTimes, faFileLines, faLayerGroup, faListUl, faListOl, faClipboard, faRotateRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

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
  const documentTrackingIntervalRef = useRef(null);
  const currentTrackingIdRef = useRef(null);
  const lastProgress = {};
  const [retryDisabled, setRetryDisabled] = useState(false);

  const showCustomNotification = (message, type) => {
    setCustomNotification({ message, type });
    setTimeout(() => setCustomNotification({ message: '', type: '' }), 3000);
  };

  const minLength = 3;
  const maxLength = 50;

  useEffect(() => {
    const fetchMaterialsAndProgress = async () => {
      setLoading(true);
      setError('');
      setNoMaterialsError(false);
  
      try {
        const role = localStorage.getItem('role');
        setRole(role);
        const response = await API.get('/trainings');
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
  
        const progressResponse = await API.get(`/progress/view/${userId}`);
        if (!progressResponse.data || progressResponse.data.length === 0) {
          setProgressData({});
        } else {
          const progressMap = {};
          progressResponse.data.forEach(progress => {
            progressMap[progress.trainingId] = progress.totalProgress;
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
            const progressResponse = await API.get(`/progress/completed/${userId}`);
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
        const evaluationResponse = await API.get("/evaluations/status");
        setEvaluationPassed(evaluationResponse.data.status === "aprobado");
        setEvalationFailed(evaluationResponse.data.status === "fallado");
      } catch (error) {
        if (error.response && error.response.status === 404) {
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
  
  const openModal = async (training, type) => {
    if (!training || !training._id || !type) return;
    setError('');
    setLoading(true);
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('No se encuentra el ID del usuario.');
          setLoading(false);
          return;
        }

        if (role !== "admin") {
          await startTraining(training._id, type);
        }

        const progressResponse = await API.get(`/progress/view/${userId}`);
        const userProgress = progressResponse.data.find(p => String(p.trainingId) === String(training._id));

        if (userProgress) {
            setModalData({
                trainingId: training._id,
                type,
                fileUrl: training[type]?.fileUrl,
                originalFileName: training[type]?.originalFileName || 'Material',
                progress: userProgress ? (type === "document" ? userProgress.documentProgress : userProgress.videoProgress) : 0,
            });
            setIsModalOpen(true);

            if (type === "document") {
              const savedProgress = Number(localStorage.getItem(`progress_${training._id}`)) || 0;
              if (savedProgress < 100) {
                  startDocumentProgressTracking(training._id);
              }
          }
            setLoading(false);
            return;
        }
        await startTraining(training._id, type);
        setModalData({
            trainingId: training._id,
            type,
            fileUrl: training[type]?.fileUrl,
            originalFileName: training[type]?.originalFileName || 'Material',
            progress: type === "document" ? 0 : 0,
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
    currentTrackingIdRef.current = null;

    if (documentTrackingIntervalRef.current) {
        clearInterval(documentTrackingIntervalRef.current);
        documentTrackingIntervalRef.current = null;
    }
  };

  const startTraining = async (trainingId, type) => {
    if (role === "admin") return;
    try {
      await API.post('/progress/start', { trainingId, type });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return;
      }
      if (role !== "admin") {
        setError('Error al iniciar capacitación');
      }
    }
  };

  const updateProgress = async (trainingId, type, newProgress) => {
    if (role === "admin") return;
  
    if (lastProgress[trainingId] === newProgress) return;
    lastProgress[trainingId] = newProgress;

    const userId = localStorage.getItem("userId"); 
    if (!userId) {
        showCustomNotification("Usuario no encontrado.", "error");
        return;
    }
    try {
      const response = await API.post('/progress/progress', {
        trainingId,
        type,
        progress: newProgress,
      });  

      if (response.data.message === 'Progreso guardado correctamente') {
        setProgressData(prev => ({
          ...prev,
          [trainingId]: response.data.totalProgress,
        }));
      }
    } catch (error) {
      if (error.response && error.response.status === 400) return;
      
      if (role !== "admin") {
        showCustomNotification("Error al guardar el progreso.", "error");
      }
      return;
    }
    try {
      const progressResponse = await API.get(`/progress/completed/${userId}`);
      setAllCompleted(progressResponse.data.allCompleted);

      if (progressResponse.data.allCompleted) {
        setCustomNotification({ 
          message: "Capacitaciones Completas. Evaluación asignada.", 
          type: "success" 
        });
        setTimeout(() => setCustomNotification({ message: '', type: '' }), 10000);
      }
    } catch (error) {
      console.error("Error verificando progreso del usuario:", error);
    }
  };

  const startDocumentProgressTracking = (trainingId) => {
    if (documentTrackingIntervalRef.current) {
        clearInterval(documentTrackingIntervalRef.current);
        documentTrackingIntervalRef.current = null;
    }

    currentTrackingIdRef.current = trainingId;
    let elapsedTime = Number(localStorage.getItem(`progress_${trainingId}`)) || 0;

    documentTrackingIntervalRef.current = setInterval(() => {
        if (currentTrackingIdRef.current !== trainingId) {
            clearInterval(documentTrackingIntervalRef.current);
            documentTrackingIntervalRef.current = null;
            return;
        }
        elapsedTime += 10;
        const progress = Math.min((elapsedTime / 300) * 100, 100);

        localStorage.setItem(`progress_${trainingId}`, elapsedTime);
        updateProgress(trainingId, "document", progress);

        if (elapsedTime >= 300) {
            updateProgress(trainingId, "document", 100);
            clearInterval(documentTrackingIntervalRef.current);
            documentTrackingIntervalRef.current = null;
            localStorage.removeItem(`progress_${trainingId}`);
        }
    }, 10000);
  };
  
  const handleVideoProgress = (event, trainingId) => {
  const video = event.target;
  const newProgress = (video.currentTime / video.duration) * 100;
    updateProgress(trainingId, "video", Math.min(newProgress, 100));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };  

  const handleRetryEvaluation = async () => {
    try {
        const retryTimeResponse = await API.get("/evaluations/retry-time");

        if (retryTimeResponse.data.retryTimestamp) {
            showCustomNotification(
                "Debes esperar antes de intentar la evaluación nuevamente.",
                "error"
            );
            setRetryDisabled(true);
            return;
        }

        const response = await API.post("/evaluations/retry");

        if (response.data.message) {
            showCustomNotification(response.data.message, "success");
            router.push("/evaluation");
        }
    } catch (error) {
        if (error.response?.data?.error) {
            showCustomNotification(error.response.data.error, "error");

            if (error.response.data.error.includes("Ya has aprobado")) {
                setRetryDisabled(true);
            }

            if (error.response.data.remainingTime) {
                const remainingSeconds = Math.ceil(error.response.data.remainingTime / 1000);
                setRetryCountDown(remainingSeconds);
                setRetryDisabled(true);
                const remainingMinutes = Math.ceil(remainingSeconds / 60);
                const timeText = remainingMinutes === 1 ? "1 minuto" : `${remainingMinutes} minutos`;
                showCustomNotification(
                  `Podrás intentarlo nuevamente en ${timeText}.`,
                  "warning"
              );
            }
        } else {
        showCustomNotification("Error al intentar reintentar la evaluación.", "error");
      }
    }
  };

  useEffect(() => {
    const checkRetryTime = async () => {
        try {
            const response = await API.get("/evaluations/retry-time");

            if (response.data.retryTimestamp) {
                const retryEndTime = new Date(response.data.retryTimestamp).getTime();
                const timeLeft = Math.max(0, Math.ceil((retryEndTime - Date.now()) / 1000));

                if (timeLeft > 0) {
                    setRetryCountDown(timeLeft);
                    setRetryDisabled(true);
                }
            } else {
                setRetryDisabled(false);
            }
        } catch (error) {
            console.error("Error obteniendo el tiempo de reintento:", error);
        }
    };
    checkRetryTime();
  }, []);

  useEffect(() => {
    if (retryCountDown !== null && retryCountDown > 0) {
      const interval = setInterval(() => {
          setRetryCountDown((prev) => {
              if (prev <= 1) {
                  clearInterval(interval);
                  setRetryDisabled(false);
                  return null;
              }
              return prev - 1;
          });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [retryCountDown]);

  const goToEvaluation = () => {
    router.push("/evaluation");
  };

  const getFileExtension = (url) => {
    return url.split('.').pop();
  };

  useEffect(() => {
    return () => {
        if (documentTrackingIntervalRef.current) {
            clearInterval(documentTrackingIntervalRef.current);
        }
    };
  }, []);

  return (
    <>
      {customNotification.message && (
       <NotificationContainer type={customNotification.type}>
        {customNotification.type === "success" ? (
          <FontAwesomeIcon icon={faCheckCircle} style={{ marginBottom: '2px' }} />
        ) : (
          <FontAwesomeIcon icon={faExclamationCircle} style={{ marginBottom: '2px' }} />
        )}
          <NotificationMessage>{customNotification.message}</NotificationMessage>
          <CloseButton onClick={() => setCustomNotification({ message: '', type: '' })} style={{ marginTop: '2px' }}>
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
        </NotificationContainer>     
      )}
      {retryCountDown !== null && retryCountDown > 0 && (
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
                              <DocumentButton onClick={() => openModal(material, "document")}>
                                <FontAwesomeIcon icon={faFileLines} style={{ marginRight: '8px' }} /> Documento
                              </DocumentButton>
                            )}
                            {material.video?.fileUrl && material.document?.fileUrl && (
                              <span style={{ margin: '0 6px 0 6px', fontSize: '29px' }}>|</span>
                            )}
                            {material.video?.fileUrl && (
                              <VideoButton onClick={() => openModal(material, "video")}>
                                <FontAwesomeIcon icon={faVideo} style={{ marginRight: '8px' }} /> Video
                              </VideoButton>
                            )}
                          </div>
                          {role !== "admin" && (
                            <ProgressBar progress={progressData[material._id] ?? 0} />
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

          {allCompleted && evaluationFailed && !evaluationPassed && (
            <ButtonTestRetry 
                onClick={handleRetryEvaluation} 
                disabled={retryDisabled} 
                style={{ 
                    background: retryDisabled ? "#d3d3d3" : "#f0a500", 
                    cursor: retryDisabled ? "not-allowed" : "pointer" 
                }}
            >
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
                modalData.type === "document" ? (
                  <iframe
                    ref={documentRef}
                    title="Material"
                    src={modalData.fileUrl}
                    style={{ width: "100%", height: "70vh", border: "none" }}
                    onLoad={() => {
                      startDocumentProgressTracking(modalData.trainingId);
                    }}
                  />
                ) : modalData.type === "video" ? (
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