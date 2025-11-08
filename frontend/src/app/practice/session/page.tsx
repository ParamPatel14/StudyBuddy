'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getQuestions, submitAnswer, generateQuestions } from '@/lib/api';
import { Question, AnswerEvaluation } from '@/lib/types';
import { Clock, ChevronRight, Check, X, Brain, Loader2 } from 'lucide-react';

export default function PracticeSession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = searchParams.get('topicId');
  const difficulty = searchParams.get('difficulty') || 'medium';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(3);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [writtenAnswer, setWrittenAnswer] = useState('');

  useEffect(() => {
    if (topicId) {
      loadQuestions();
    }
  }, [topicId, difficulty]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      
      // First, generate questions if needed
      await generateQuestions(parseInt(topicId!), difficulty, 10);
      
      // Then fetch them
      const data = await getQuestions(parseInt(topicId!), difficulty, 'mcq', 10);
      setQuestions(data.questions);
      setStartTime(Date.now());
    } catch (error) {
      console.error('Failed to load questions:', error);
      alert('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer && !writtenAnswer) return;

    setSubmitting(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    try {
      const result = await submitAnswer(
        currentQuestion.id,
        currentQuestion.type === 'mcq' ? selectedAnswer : writtenAnswer,
        timeTaken,
        confidence
      );

      setEvaluation(result);
      setShowExplanation(true);
    } catch (error) {
      console.error('Failed to submit answer:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer('');
      setWrittenAnswer('');
      setConfidence(3);
      setStartTime(Date.now());
      setEvaluation(null);
      setShowExplanation(false);
    } else {
      // Session complete
      router.push(`/practice?planId=${searchParams.get('planId')}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading practice questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No questions available</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Question Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}
                </span>
                <span className="flex items-center text-gray-600 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {Math.floor(currentQuestion.time_limit / 60)} min
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentQuestion.question_text}
              </h2>
            </div>
          </div>

          {/* MCQ Options */}
          {currentQuestion.type === 'mcq' && !showExplanation && (
            <div className="space-y-3 mb-6">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSelectedAnswer(option.label)}
                  disabled={submitting}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    selectedAnswer === option.label
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center">
                    <span className="shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold mr-3
                      ${selectedAnswer === option.label ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-500'}">
                      {option.label}
                    </span>
                    <span className="text-gray-900">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Written Answer Input */}
          {currentQuestion.type === 'written' && !showExplanation && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Answer ({currentQuestion.expected_length})
              </label>
              <textarea
                value={writtenAnswer}
                onChange={(e) => setWrittenAnswer(e.target.value)}
                disabled={submitting}
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type your answer here..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Word count: {writtenAnswer.split(/\s+/).filter(w => w).length}
              </p>
            </div>
          )}

          {/* Confidence Selector */}
          {!showExplanation && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How confident are you?
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setConfidence(level)}
                    className={`flex-1 py-2 rounded-lg border-2 transition ${
                      confidence === level
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 text-gray-600 hover:border-blue-300'
                    }`}
                  >
                    {['😟', '😐', '😊', '😁', '🤩'][level - 1]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Evaluation/Explanation */}
          {showExplanation && evaluation && (
            <div className={`mb-6 p-6 rounded-lg ${
              evaluation.correct || (evaluation.percentage && evaluation.percentage >= 60)
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-red-50 border-2 border-red-200'
            }`}>
              <div className="flex items-center mb-4">
                {evaluation.correct || (evaluation.percentage && evaluation.percentage >= 60) ? (
                  <>
                    <Check className="w-6 h-6 text-green-600 mr-2" />
                    <h3 className="text-lg font-bold text-green-900">
                      {evaluation.correct ? 'Correct!' : `Good Answer! ${evaluation.percentage}%`}
                    </h3>
                  </>
                ) : (
                  <>
                    <X className="w-6 h-6 text-red-600 mr-2" />
                    <h3 className="text-lg font-bold text-red-900">
                      {currentQuestion.type === 'mcq' ? 'Incorrect' : `Needs Improvement (${evaluation.percentage}%)`}
                    </h3>
                  </>
                )}
              </div>

              {/* MCQ Explanation */}
              {currentQuestion.type === 'mcq' && (
                <>
                  <p className="text-gray-700 mb-2">
                    <strong>Correct Answer:</strong> {evaluation.correct_answer}
                  </p>
                  <p className="text-gray-700">
                    <strong>Explanation:</strong> {evaluation.explanation}
                  </p>
                </>
              )}

              {/* Written Answer Feedback */}
              {currentQuestion.type === 'written' && (
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Score: {evaluation.score}/{evaluation.max_score}</p>
                    <p className="text-gray-700">{evaluation.feedback}</p>
                  </div>

                  {evaluation.strengths && evaluation.strengths.length > 0 && (
                    <div>
                      <p className="font-semibold text-green-900 mb-2">✓ Strengths:</p>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {evaluation.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {evaluation.improvements && evaluation.improvements.length > 0 && (
                    <div>
                      <p className="font-semibold text-red-900 mb-2">⚠ Areas for Improvement:</p>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {evaluation.improvements.map((i, idx) => (
                          <li key={idx}>{i}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {evaluation.keyword_coverage !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600">
                        Keyword Coverage: {evaluation.keyword_coverage}/{evaluation.keyword_total}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-white rounded border">
                    <p className="font-semibold text-gray-900 mb-2">Model Answer:</p>
                    <p className="text-gray-700 whitespace-pre-wrap">{evaluation.model_answer}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {!showExplanation ? (
              <button
                onClick={handleSubmit}
                disabled={(!selectedAnswer && !writtenAnswer) || submitting}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  'Submit Answer'
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
              >
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  'Finish Session'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
