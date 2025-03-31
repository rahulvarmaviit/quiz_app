import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< HEAD
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // Timer for each question (10 seconds)
  const [feedback, setFeedback] = useState(''); // Feedback message
  const [score, setScore] = useState(0); // Real-time score

  // Function to fetch quiz data from the API
  const fetchQuizData = async () => {
    try {
      const response = await axios.get('/mockQuizData.json'); // Fetch from local mock data
      console.log('API Response:', response.data);

      // Extract questions from the new structure
      const quizQuestions = response.data.categories[0]?.questions || [];
      setQuizData(quizQuestions);
      setLoading(false);
    } catch (err) {
      console.error('Error Details:', err);
      setError('Error fetching quiz data');
      setLoading(false);
    }
  };
=======
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { category: { qIndex: answer } }
  const [completedCategories, setCompletedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
>>>>>>> d2dedf7861ab874ace4edcc69f5f085ac80eac38

  // Fetch quiz data from the CORRECT API endpoint
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get('/mockQuizData.json');
        setQuizData(response.data.categories); // Ensure data is parsed correctly
        setLoading(false);
      } catch (err) {
        setError('Error loading quiz data');
        setLoading(false);
      }
    };
    fetchQuizData();
  }, []);

  // Calculate score and percentage for a category
const calculateCategoryStats = (categoryName) => {
  const category = quizData.find(cat => cat.categoryName === categoryName);
  if (!category) return { score: 0, percentage: 0 };
  let correct = 0;
  category.questions.forEach((q, index) => {
    // Access the 'answer' property from selectedAnswers
    if (selectedAnswers[categoryName]?.[index]?.answer === q.correctAnswer) {
      correct++;
    }
  });
  const percentage = ((correct / category.questions.length) * 100).toFixed(2);
  return { score: correct, percentage };
};

  // Check if all questions in the category are submitted
  const isCategoryReadyToSubmit = () => {
    const currentCategory = quizData.find(cat => cat.categoryName === selectedCategory);
    return currentCategory?.questions.every((_, qIndex) => 
      selectedAnswers[selectedCategory]?.[qIndex]?.submitted
    );
  };

  // Handle answer selection
<<<<<<< HEAD
  const handleAnswerSelect = (selectedOption) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: selectedOption, // Track by question index
    }));

    // Provide feedback
    const currentQuestion = quizData[currentQuestionIndex];
    if (selectedOption === currentQuestion.correctAnswer) {
      setFeedback('Correct!');
      setScore(score + 4); // Assuming 4 points per correct answer
    } else {
      setFeedback('Wrong!');
    }

    // Move to the next question after a short delay
    setTimeout(() => {
      setFeedback('');
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
    quizData.forEach((question, index) => {
      const selectedOption = selectedAnswers[index];
      if (selectedOption === question.correctAnswer) {
        totalScore += 4; // Assuming 4 points per correct answer
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
              href="https://github.com/your-username"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link github"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link linkedin"
            >
              LinkedIn
            </a>
            <a
              href="mailto:your-email@example.com"
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
=======
  const handleAnswerSelect = (categoryName, qIndex, option) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [categoryName]: {
        ...prev[categoryName],
        [qIndex]: { answer: option, submitted: false },
      },
    }));
  };

  // Submit a single question
  const handleQuestionSubmit = (categoryName, qIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [categoryName]: {
        ...prev[categoryName],
        [qIndex]: { ...prev[categoryName][qIndex], submitted: true },
      },
    }));
  };

  // Handle category submission
  const handleCategorySubmit = () => {
    setCompletedCategories([...completedCategories, selectedCategory]);
    setSelectedCategory(''); // Reset category selection
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Render final results page
  if (completedCategories.length === quizData.length) {
    const totalCorrect = quizData.reduce((total, category) => {
      return total + calculateCategoryStats(category.categoryName).score;
    }, 0);
    const totalQuestions = quizData.reduce((total, category) => {
      return total + category.questions.length;
    }, 0);
    const overallPercentage = ((totalCorrect / totalQuestions) * 100).toFixed(2);

    return (
      <div className="container results">
        <h1>Final Results</h1>
        <div className="result-cards">
          {quizData.map((category) => {
            const { score, percentage } = calculateCategoryStats(category.categoryName);
            return (
              <div key={category.categoryName} className="result-card">
                <h3>{category.categoryName}</h3>
                <p>Score: {score}/{category.questions.length}</p>
                <p>Correct Score: {percentage}%</p>
              </div>
            );
          })}
        </div>
        <p className="overall-result">Overall Score: {overallPercentage}%</p>
        <button onClick={() => window.location.reload()}>Restart Quiz</button>
      </div>
    );
>>>>>>> d2dedf7861ab874ace4edcc69f5f085ac80eac38
  }

  // Render category selection
  if (!selectedCategory) {
    return (
      <div className="container">
        <h1>Select a Category</h1>
        <ul className="categories">
          {quizData.map((cat) => (
            <li key={cat.categoryName}>
              <button
                className={`category-btn ${completedCategories.includes(cat.categoryName) ? 'completed' : ''}`}
                onClick={() => setSelectedCategory(cat.categoryName)}
                disabled={completedCategories.includes(cat.categoryName)}
              >
                {cat.categoryName} {completedCategories.includes(cat.categoryName) && '✓'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Render quiz questions for the selected category
  const currentCategory = quizData.find(cat => cat.categoryName === selectedCategory);
  const currentQuestions = currentCategory?.questions || [];

  return (
    <div className="container">
      <h2>{selectedCategory}</h2>
      <button className="switch-btn" onClick={() => setSelectedCategory('')}>
        Switch Category
      </button>
      <div className="quiz-container">
        {currentQuestions.map((question, qIndex) => {
          const isSubmitted = selectedAnswers[selectedCategory]?.[qIndex]?.submitted || false;
          const selectedOption = selectedAnswers[selectedCategory]?.[qIndex]?.answer || '';

          return (
            <div key={qIndex} className="question-block">
              <h3>{question.question}</h3>
              <ul className="options">
                {question.options.map((option, index) => (
                  <li key={index}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={option}
                        checked={selectedOption === option}
                        onChange={() => handleAnswerSelect(selectedCategory, qIndex, option)}
                        disabled={isSubmitted}
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
              <button
                className="submit-btn"
                onClick={() => handleQuestionSubmit(selectedCategory, qIndex)}
                disabled={!selectedOption || isSubmitted}
              >
                {isSubmitted ? 'Submitted' : 'Submit Answer'}
              </button>
              {isSubmitted && (
                <p className="selected-answer">
                  Selected: <strong>{selectedOption}</strong>
                </p>
              )}
            </div>
          );
        })}
      </div>
<<<<<<< HEAD

      {/* Timer */}
      <p className="timer">Time Left: {timeLeft} seconds</p>

      {/* Current Question */}
      <h3 className="question">{currentQuestion.question}</h3>
      <ul className="options">
        {currentQuestion.options.map((option, optionIndex) => (
          <li key={optionIndex}>
            <label>
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={option}
                checked={selectedAnswers[currentQuestionIndex] === option}
                onChange={() => handleAnswerSelect(option)}
              />
              {option}
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
            href="https://github.com/your-username"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link github"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link linkedin"
          >
            LinkedIn
          </a>
          <a
            href="mailto:your-email@example.com"
            className="social-link gmail"
          >
            Gmail
          </a>
        </div>
      </footer>
=======
      <button
        className="final-submit-btn"
        onClick={handleCategorySubmit}
        disabled={!isCategoryReadyToSubmit()}
      >
        Submit This Category
      </button>
>>>>>>> d2dedf7861ab874ace4edcc69f5f085ac80eac38
    </div>
  );
}

export default App;