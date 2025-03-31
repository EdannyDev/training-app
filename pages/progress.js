import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import API from '../utils/api';
import { 
  ProgressContainer, 
  Title, 
  UserCard, 
  UserHeader, 
  UserInfo, 
  ToggleButton, 
  TrainingsList, 
  TrainingItem, 
  TrainingBadge, 
  ProgressBadge, 
  CompletedBadge, 
  Divider, 
  BackButton 
} from '../frontend/styles/progress.styles';
import Spinner from '@/frontend/components/spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChevronDown, faChevronUp, faListCheck } from '@fortawesome/free-solid-svg-icons';

const Progress = () => {
  const [usersProgress, setUsersProgress] = useState([]);
  const [completedUsers, setCompletedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openUserId, setOpenUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressResponse = await API.get('/progress/all-progress');
        const completedResponse = await API.get('/progress/all-completed');
        setUsersProgress(progressResponse.data);
        setCompletedUsers(completedResponse.data.map(user => user.userId));
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const toggleUserProgress = (userId) => {
    setOpenUserId(openUserId === userId ? null : userId);
  };

  const handleBack = () => {
    router.push('/users');
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <ProgressContainer>
          <Title>Progresos de Usuarios</Title>
          {usersProgress.map(({ _id, name, role, trainings }) => (
            <UserCard key={_id}>
              <UserHeader>
                <UserInfo>
                  <p><strong>Nombre:</strong> {name}</p>
                  <p><strong>Rol asignado:</strong> {role}</p>
                </UserInfo>
                {completedUsers.includes(_id) && (
                  <CompletedBadge>Capacitaciones Completas</CompletedBadge>
                )}
                <ToggleButton onClick={() => toggleUserProgress(_id)}>
                  <FontAwesomeIcon icon={openUserId === _id ? faChevronUp : faChevronDown} />
                </ToggleButton>
              </UserHeader>
              {openUserId === _id && (
                <TrainingsList>
                  {trainings.length > 0 ? (
                    trainings.map((training, index) => (
                      <TrainingItem key={`${_id}-${index}`}>
                        <span>
                          <FontAwesomeIcon icon={faListCheck} /> {training.trainingTitle}
                        </span>
                        <div>
                          <ProgressBadge progress={training.progress}>
                            {Math.round(training.progress)}%
                          </ProgressBadge>
                          <TrainingBadge status={training.status}>
                            {training.status}
                          </TrainingBadge>
                        </div>
                      </TrainingItem>
                    ))
                  ) : (
                    <p>No hay capacitaciones registradas.</p>
                  )}
                </TrainingsList>
              )}
            </UserCard>
          ))}
          <Divider />
          <BackButton onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} /> Regresar
          </BackButton>
        </ProgressContainer>
      )}
    </>
  );
};

export default Progress;