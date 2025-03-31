import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { category: { qIndex: answer } }
  const [completedCategories, setCompletedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

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
      <button
        className="final-submit-btn"
        onClick={handleCategorySubmit}
        disabled={!isCategoryReadyToSubmit()}
      >
        Submit This Category
      </button>
    </div>
  );
}

export default App;