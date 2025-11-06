'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { AgeRange } from '@/types/puzzle';

const categories = [
  {
    id: 'patterns',
    name: 'Patterns',
    emoji: '🔄',
    description: 'Complete the pattern!',
    color: 'from-purple-400 to-pink-400'
  },
  {
    id: 'shapes_match',
    name: 'Shape Match',
    emoji: '⭐',
    description: 'Find the right shape!',
    color: 'from-blue-400 to-cyan-400'
  },
  {
    id: 'logical',
    name: 'Logical Thinking',
    emoji: '🧠',
    description: 'Use your brain!',
    color: 'from-green-400 to-emerald-400'
  }
];

const ageRanges: { value: AgeRange; label: string }[] = [
  { value: '3-4', label: '3-4 years' },
  { value: '4-5', label: '4-5 years' },
  { value: '5-6', label: '5-6 years' }
];

export default function Home() {
  const [selectedAge, setSelectedAge] = useState<AgeRange>('3-4');

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-5xl xl:max-w-6xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-purple-600 mb-3 sm:mb-4">
            🎮 SkillSprout
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 mb-6 sm:mb-8 px-4">
            Fun Puzzles for Smart Kids!
          </p>

          {/* Age Selection */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-lg mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold text-gray-700 mb-3 sm:mb-4 md:mb-5">
              Select Your Age 🎂
            </h2>
            <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
              {ageRanges.map((age) => (
                <button
                  key={age.value}
                  onClick={() => setSelectedAge(age.value)}
                  className={`px-5 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 lg:px-10 lg:py-5 rounded-xl sm:rounded-2xl text-base sm:text-lg md:text-xl lg:text-2xl font-bold transition-all transform active:scale-95 sm:hover:scale-110 ${
                    selectedAge === age.value
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105 sm:scale-110'
                      : 'bg-gray-200 text-gray-700 sm:hover:bg-gray-300'
                  }`}
                >
                  {age.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/puzzle/${category.id}?age=${selectedAge}`}
              className="group"
            >
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 lg:p-8 shadow-lg hover:shadow-2xl transition-all transform active:scale-95 sm:hover:scale-105 cursor-pointer h-full flex flex-col">
                <div className={`bg-gradient-to-br ${category.color} rounded-xl sm:rounded-2xl p-6 sm:p-7 md:p-8 mb-4 flex-grow flex items-center justify-center`}>
                  <div className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl text-center">
                    {category.emoji}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-gray-800 text-center mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-center text-sm sm:text-base md:text-lg lg:text-lg">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 md:mt-10 text-gray-600 px-4">
          <p className="text-sm sm:text-base md:text-lg">
            Choose a puzzle category to start learning! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
