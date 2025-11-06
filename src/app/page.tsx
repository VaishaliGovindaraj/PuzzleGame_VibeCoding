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
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-purple-600 mb-4">
            🎮 Skill Sprout 
          </h1>
          <p className="text-2xl text-gray-700 mb-8">
            Fun Puzzles for Smart Kids!
          </p>

          {/* Age Selection */}
          <div className="bg-white rounded-3xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Select Your Age 🎂
            </h2>
            <div className="flex gap-4 justify-center flex-wrap">
              {ageRanges.map((age) => (
                <button
                  key={age.value}
                  onClick={() => setSelectedAge(age.value)}
                  className={`px-8 py-4 rounded-2xl text-xl font-bold transition-all transform hover:scale-110 ${
                    selectedAge === age.value
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-110'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {age.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/puzzle/${category.id}?age=${selectedAge}`}
              className="group"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer">
                <div className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 mb-4`}>
                  <div className="text-7xl text-center mb-2">
                    {category.emoji}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-center text-lg">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p className="text-lg">
            Choose a puzzle category to start learning! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
