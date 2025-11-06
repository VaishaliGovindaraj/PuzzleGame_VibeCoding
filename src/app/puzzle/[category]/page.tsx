'use client';

import { useState, useEffect, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Puzzle, AgeRange } from '@/types/puzzle';

import patternsData from '@/data/patterns.json';
import shapesData from '@/data/shapes_match.json';
import logicalData from '@/data/logical.json';

const categoryData: Record<string, Puzzle[]> = {
  patterns: patternsData as Puzzle[],
  shapes_match: shapesData as Puzzle[],
  logical: logicalData as Puzzle[],
};

const categoryInfo: Record<string, { name: string; emoji: string; color: string }> = {
  patterns: { name: 'Patterns', emoji: '🔄', color: 'from-purple-400 to-pink-400' },
  shapes_match: { name: 'Shape Match', emoji: '⭐', color: 'from-blue-400 to-cyan-400' },
  logical: { name: 'Logical Thinking', emoji: '🧠', color: 'from-green-400 to-emerald-400' },
};

export default function PuzzlePage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = resolvedParams.category;
  const ageParam = searchParams.get('age') as AgeRange | null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [filteredPuzzles, setFilteredPuzzles] = useState<Puzzle[]>([]);

  useEffect(() => {
    const puzzles = categoryData[category] || [];
    const filtered = ageParam
      ? puzzles.filter((p) => {
          const puzzleAges = p.ageRange.split('-').map(Number);
          const selectedAges = ageParam.split('-').map(Number);
          return (
            puzzleAges[0] <= selectedAges[1] && puzzleAges[1] >= selectedAges[0]
          );
        })
      : puzzles;
    setFilteredPuzzles(filtered);
  }, [category, ageParam]);

  const currentPuzzle = filteredPuzzles[currentIndex];
  const info = categoryInfo[category];

  if (!currentPuzzle || !info) {
    return (
      <div className="min-h-screen bg-linear-to-br from-yellow-100 via-pink-100 to-purple-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-2xl sm:text-3xl mb-4 px-4">No puzzles found!</p>
          <Link
            href="/"
            className="px-6 py-3 sm:px-8 sm:py-4 bg-blue-500 text-white rounded-2xl text-lg sm:text-xl font-bold hover:bg-blue-600 inline-block"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === currentPuzzle.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredPuzzles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setShowHint(false);
  };

  const isLastPuzzle = currentIndex === filteredPuzzles.length - 1;
  const isCorrect = selectedAnswer === currentPuzzle.correctAnswer;

  return (
    <div className="min-h-screen bg-linear-to-br from-yellow-100 via-pink-100 to-purple-100 flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-4xl xl:max-w-5xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 gap-2">
          <Link
            href="/"
            className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-white rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-bold hover:shadow-lg transition-all"
          >
            🏠 <span className="hidden sm:inline">Home</span>
          </Link>
          <div className="bg-white rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 shadow-lg">
            <span className="text-base sm:text-xl md:text-2xl font-bold text-purple-600">
              Score: {score}/{filteredPuzzles.length}
            </span>
          </div>
        </div>

        {/* Category Title */}
        <div className={`bg-linear-to-r ${info.color} rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 mb-4 sm:mb-5 md:mb-6 text-center shadow-lg`}>
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl mb-2">{info.emoji}</div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">{info.name}</h1>
          <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl mt-2">
            Puzzle {currentIndex + 1} of {filteredPuzzles.length}
          </p>
        </div>

        {/* Puzzle Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 lg:p-8 shadow-2xl mb-4 sm:mb-5">
          {/* Question */}
          <div className="mb-5 sm:mb-6 md:mb-7">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
              {currentPuzzle.title}
            </h2>
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center py-5 sm:py-6 md:py-7 lg:py-8 bg-gray-50 rounded-xl sm:rounded-2xl wrap-break-word px-3">
              {currentPuzzle.question}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
            {currentPuzzle.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={`p-5 sm:p-6 md:p-7 lg:p-8 rounded-xl sm:rounded-2xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold transition-all transform active:scale-95 sm:hover:scale-105 min-h-[100px] sm:min-h-[120px] md:min-h-[130px] lg:min-h-[140px] flex items-center justify-center ${
                  showResult
                    ? index === currentPuzzle.correctAnswer
                      ? 'bg-green-400 text-white shadow-lg scale-105'
                      : index === selectedAnswer
                      ? 'bg-red-400 text-white'
                      : 'bg-gray-200 text-gray-600'
                    : 'bg-linear-to-br from-blue-100 to-purple-100 sm:hover:from-blue-200 sm:hover:to-purple-200 cursor-pointer'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Hint Button */}
          {currentPuzzle.hint && !showResult && (
            <div className="mb-5 sm:mb-6 text-center">
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-3 bg-yellow-400 text-gray-800 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-bold hover:bg-yellow-500 transition-all"
              >
                💡 {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              {showHint && (
                <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-700 bg-yellow-50 p-3 sm:p-4 rounded-xl mx-2">
                  {currentPuzzle.hint}
                </p>
              )}
            </div>
          )}

          {/* Result */}
          {showResult && (
            <div className="text-center px-2">
              <div
                className={`text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce ${
                  isCorrect ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {isCorrect ? '🎉' : '💪'}
              </div>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-5">
                {isCorrect ? 'Awesome! You got it!' : 'Nice try! Keep going!'}
              </p>
              {!isLastPuzzle ? (
                <button
                  onClick={handleNext}
                  className="px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-xl sm:rounded-2xl text-base sm:text-lg md:text-xl font-bold hover:shadow-lg transform active:scale-95 sm:hover:scale-105 transition-all"
                >
                  Next Puzzle ➡️
                </button>
              ) : (
                <div>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-5">
                    You completed all puzzles! 🎊
                  </p>
                  <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap">
                    <button
                      onClick={handleRestart}
                      className="px-4 py-3 sm:px-5 sm:py-3 md:px-7 md:py-4 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-bold hover:shadow-lg transform active:scale-95 sm:hover:scale-105 transition-all"
                    >
                      🔄 Play Again
                    </button>
                    <Link
                      href="/"
                      className="px-4 py-3 sm:px-5 sm:py-3 md:px-7 md:py-4 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-bold hover:shadow-lg transform active:scale-95 sm:hover:scale-105 transition-all inline-block"
                    >
                      🏠 New Category
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg">
          <div className="bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
            <div
              className="bg-linear-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
              style={{
                width: `${((currentIndex + 1) / filteredPuzzles.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
