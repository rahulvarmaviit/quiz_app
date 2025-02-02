import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Import the CSS file

function App() {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // Timer for each question (10 seconds)
  const [feedback, setFeedback] = useState(''); // Feedback message
  const [score, setScore] = useState(0); // Real-time score

  // Function to fetch quiz data from the API
  const fetchQuizData = async () => {
  try {
    const response = await axios.get(
      'https://cors-anywhere.herokuapp.com/https://api.jsonserve.com/Uw5CrX'
    );
    console.log('API Response:', response.data);
    const quizQuestions = response.data.questions || [];
    setQuizData(quizQuestions);
    setLoading(false);
  } catch (err) {
    console.error('Error Details:', err.message);
    setError('Error fetching quiz data');
    setLoading(false);
  }
};

  useEffect(() => {
    fetchQuizData();
  }, []);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      // Automatically move to the next question when time runs out
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(10); // Reset timer for the next question
      } else {
        setShowResults(true); // Show results after the last question
      }
    }
  }, [timeLeft, showResults, currentQuestionIndex, quizData]);

  // Handle answer selection
  const handleAnswerSelect = (questionId, selectedOption) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));

    // Provide feedback
    if (selectedOption.is_correct) {
      setFeedback('Correct!');
      setScore(score + 4); // Update score for correct answer
    } else {
      setFeedback('Wrong!');
    }

    // Move to the next question after a short delay
    setTimeout(() => {
      setFeedback(''); // Clear feedback
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(10); // Reset timer for the next question
      } else {
        setShowResults(true); // Show results after the last question
      }
    }, 1000); // Wait 1 second before moving to the next question
  };

  // Calculate the final score
  const calculateScore = () => {
    let totalScore = 0;
    quizData.forEach((question) => {
      const selectedOption = selectedAnswers[question.id];
      if (selectedOption && selectedOption.is_correct) {
        totalScore += 4; // Assuming 4 points for each correct answer
      }
    });
    return totalScore;
  };

  if (loading) {
  return <div className="container">Loading...</div>;
}

if (error) {
  return <div className="container">{error}</div>;
}

if (!quizData || quizData.length === 0) {
  return <div className="container">No questions available.</div>;
}

if (showResults) {
  const totalScore = calculateScore();
  const maxScore = quizData.length * 4; // Maximum possible score
  const perfectScore = totalScore === maxScore;

  return (
    <div className="container results">
      <h1>Quiz Results</h1>
      <p>Total Score: {totalScore}</p>
      {perfectScore && <p className="perfect-score">🎉 Perfect Score! 🎉</p>}
      {!perfectScore && <p>Keep practicing to improve your score!</p>}
      {/* Footer */}
      <footer className="footer">
        <p>Connect with me:</p>
        <div className="social-links">
          <a
            href="https://github.com/rahulvarmaviit"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link github"
          >
            GitHub
          </a>
          <a
            href="http://www.linkedin.com/in/rahul-varma-vatsavai-62a051290"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link linkedin"
          >
            LinkedIn
          </a>
          <a
            href="mailto:rahulvarmaviit@gmail.com"
            className="social-link gmail"
          >
            Gmail
          </a>
        </div>
      </footer>
    </div>
  );
}
  const currentQuestion = quizData[currentQuestionIndex];

  if (!currentQuestion) {
    return <div className="container">No questions available.</div>;
  }

  return (
    <div className="container">
      <h1>Quiz App</h1>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{
            width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%`,
          }}
        ></div>
      </div>

      {/* Timer */}
      <p className="timer">Time Left: {timeLeft} seconds</p>

      {/* Current Question */}
      <h3 className="question">{currentQuestion.description}</h3>
      <ul className="options">
        {currentQuestion.options.map((option, optionIndex) => (
          <li key={optionIndex}>
            <label>
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option.id}
                checked={selectedAnswers[currentQuestion.id]?.id === option.id}
                onChange={() => handleAnswerSelect(currentQuestion.id, option)}
              />
              {option.description}
            </label>
          </li>
        ))}
      </ul>

      {/* Feedback Message */}
      {feedback && (
        <p className={`feedback ${feedback === 'Correct!' ? 'correct' : 'wrong'}`}>
          {feedback}
        </p>
      )}

      {/* Real-Time Score */}
      <p className="score">Current Score: {score}</p>

      {/* Footer */}
      <footer className="footer">
        <p>Connect with me:</p>
        <div className="social-links">
          <a
            href="https://github.com/rahulvarmaviit"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link github"
          >
            GitHub
          </a>
          <a
            href="http://www.linkedin.com/in/rahul-varma-vatsavai-62a051290"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link linkedin"
          >
            LinkedIn
          </a>
          <a
            href="mailto:rahulvarmaviit@gmail.com"
            className="social-link gmail"
          >
            Gmail
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
