import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faFileLines, faPaperPlane, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import {
  Container,
  Title,
  QuestionContainer,
  QuestionText,
  OptionsContainer,
  OptionButton,
  SubmitButton,
  MessageBox,
} from "../frontend/styles/evaluation.styles";
import Spinner from "@/frontend/components/spinner";

const EvaluationPage = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEvaluation = async () => {
      setLoading(true);
      setMessage(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("Error de autenticación. Inicia sesión nuevamente.");
          setMessageType("error");
          setLoading(false);
          return;
        }

        const response = await axios.get("https://backend-training-cs9o.onrender.com/api/evaluations/assigned", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.questions) {
          setQuestions(response.data.questions);
        } else {
          setMessage("No hay evaluación disponible.");
          setMessageType("error");
        }
      } catch {
        setMessage("Error al cargar la evaluación.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, []);

  useEffect(() => {
    if (messageType === "success" || messageType === "error") {
      setTimeout(() => {
        router.push("/training");
      }, 3000);
    }
  }, [messageType, router]);

  const handleSelectAnswer = (questionId, selectedOption) => {
    setAnswers({ ...answers, [questionId]: selectedOption });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      setMessage("Debes responder todas las preguntas antes de enviar.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const formattedAnswers = Object.keys(answers).map((questionId) => ({
        questionId,
        selectedOption: answers[questionId],
      }));

      const response = await axios.post(
        "https://backend-training-cs9o.onrender.com/api/evaluations/submit",
        { userId, answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "aprobado") {
        setMessage("¡Felicidades! Has aprobado la evaluación.");
        setMessageType("success");
      } else {
        setMessage("No aprobaste la evaluación. Inténtalo más tarde.");
        setMessageType("error");
      }
    } catch {
      setMessage("Error al enviar las respuestas.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>
        <FontAwesomeIcon icon={faFileLines} /> Evaluación
      </Title>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {message && (
            <MessageBox type={messageType}>
              <FontAwesomeIcon icon={messageType === "success" ? faCheckCircle : faTimesCircle} />
              <span>{message}</span>
            </MessageBox>
          )}

          {questions.map((question, index) => (
            <QuestionContainer key={question.questionId}>
              <QuestionText>
                <strong>{index + 1}.</strong> {question.text}
              </QuestionText>
              <OptionsContainer>
                {question.options.map((option) => (
                  <OptionButton
                    key={option._id}
                    onClick={() => handleSelectAnswer(question.questionId, option.text)}
                    selected={answers[question.questionId] === option.text}
                  >
                    {option.text}
                  </OptionButton>
                ))}
              </OptionsContainer>
            </QuestionContainer>
          ))}

          <SubmitButton onClick={handleSubmit}>
            <FontAwesomeIcon icon={faPaperPlane} /> Enviar Respuestas
          </SubmitButton>
        </>
      )}
    </Container>
  );
};

export default EvaluationPage;