'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface BMICalculatorProps {
  onBMICalculated: (bmi: number) => void
  initialBMI?: number
}

export default function BMICalculator({ onBMICalculated, initialBMI = 0 }: BMICalculatorProps) {
  const [height, setHeight] = useState<number>(170) // cm
  const [weight, setWeight] = useState<number>(70) // kg
  const [heightFt, setHeightFt] = useState<number>(5)
  const [heightIn, setHeightIn] = useState<number>(7)
  const [weightLbs, setWeightLbs] = useState<number>(154)
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [bmi, setBMI] = useState<number>(initialBMI)
  const [category, setCategory] = useState<string>('')
  const [categoryColor, setCategoryColor] = useState<string>('')

  useEffect(() => {
    calculateBMI()
  }, [height, weight, unit, heightFt, heightIn, weightLbs])

  const calculateBMI = () => {
    let calculatedBMI: number

    if (unit === 'metric') {
      const heightInMeters = height / 100
      calculatedBMI = weight / (heightInMeters * heightInMeters)
    } else {
      const totalInches = heightFt * 12 + heightIn
      calculatedBMI = (weightLbs / (totalInches * totalInches)) * 703
    }

    const roundedBMI = Math.round(calculatedBMI * 10) / 10
    setBMI(roundedBMI)
    onBMICalculated(roundedBMI)

    // Determine category
    if (roundedBMI < 18.5) {
      setCategory('Underweight')
      setCategoryColor('text-blue-400')
    } else if (roundedBMI < 25) {
      setCategory('Normal')
      setCategoryColor('text-green-400')
    } else if (roundedBMI < 30) {
      setCategory('Overweight')
      setCategoryColor('text-yellow-400')
    } else if (roundedBMI < 35) {
      setCategory('Obese Class I')
      setCategoryColor('text-orange-400')
    } else if (roundedBMI < 40) {
      setCategory('Obese Class II')
      setCategoryColor('text-red-400')
    } else {
      setCategory('Obese Class III')
      setCategoryColor('text-red-600')
    }
  }

  const handleMetricChange = (type: 'height' | 'weight', value: number) => {
    if (type === 'height') {
      setHeight(value)
      const totalInches = value / 2.54
      setHeightFt(Math.floor(totalInches / 12))
      setHeightIn(Math.round(totalInches % 12))
    } else {
      setWeight(value)
      setWeightLbs(Math.round(value * 2.20462))
    }
  }

  const handleImperialChange = (type: 'height-ft' | 'height-in' | 'weight', value: number) => {
    if (type === 'height-ft') {
      setHeightFt(value)
      setHeight(Math.round(((value * 12 + heightIn) * 2.54)))
    } else if (type === 'height-in') {
      setHeightIn(value)
      setHeight(Math.round(((heightFt * 12 + value) * 2.54)))
    } else {
      setWeightLbs(value)
      setWeight(Math.round(value / 2.20462 * 10) / 10)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
          Real-time BMI Calculator
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setUnit('metric')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              unit === 'metric'
                ? 'bg-primary-600 text-white'
                : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
            }`}
          >
            Metric
          </button>
          <button
            onClick={() => setUnit('imperial')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              unit === 'imperial'
                ? 'bg-primary-600 text-white'
                : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
            }`}
          >
            Imperial
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {unit === 'metric' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Height (cm): {height}
              </label>
              <input
                type="range"
                min="100"
                max="250"
                value={height}
                onChange={(e) => handleMetricChange('height', Number(e.target.value))}
                className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Weight (kg): {weight}
              </label>
              <input
                type="range"
                min="30"
                max="200"
                value={weight}
                onChange={(e) => handleMetricChange('weight', Number(e.target.value))}
                className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Height: {heightFt}' {heightIn}"
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="range"
                    min="3"
                    max="8"
                    value={heightFt}
                    onChange={(e) => handleImperialChange('height-ft', Number(e.target.value))}
                    className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <span className="text-xs text-gray-500">Feet</span>
                </div>
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="11"
                    value={heightIn}
                    onChange={(e) => handleImperialChange('height-in', Number(e.target.value))}
                    className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <span className="text-xs text-gray-500">Inches</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Weight (lbs): {weightLbs}
              </label>
              <input
                type="range"
                min="66"
                max="440"
                value={weightLbs}
                onChange={(e) => handleImperialChange('weight', Number(e.target.value))}
                className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>
          </>
        )}
      </div>

      <div className="bg-dark-900/50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Your BMI</span>
          <span className={`text-2xl font-bold ${categoryColor}`}>{bmi.toFixed(1)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Category</span>
          <span className={`text-sm font-semibold ${categoryColor}`}>{category}</span>
        </div>

        {/* BMI Scale Visualization */}
        <div className="mt-4 relative">
          <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-yellow-400" />
          <div className="h-3 rounded-full bg-gradient-to-r from-transparent from-50% via-orange-500 to-red-600 absolute inset-0" />
          <div
            className="absolute top-0 w-1 h-3 bg-white shadow-lg rounded-full"
            style={{
              left: `${Math.min(Math.max(((bmi - 10) / 40) * 100, 0), 100)}%`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10</span>
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
            <span>35</span>
            <span>50</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
