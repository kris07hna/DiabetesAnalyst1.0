'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, AlertCircle } from 'lucide-react'
import axios from 'axios'

const FEATURE_CONFIG = {
  HighBP: { label: 'High Blood Pressure', type: 'binary', description: 'Do you have high blood pressure?' },
  HighChol: { label: 'High Cholesterol', type: 'binary', description: 'Do you have high cholesterol?' },
  CholCheck: { label: 'Cholesterol Check', type: 'binary', description: 'Cholesterol checked in past 5 years?' },
  BMI: { label: 'BMI', type: 'number', min: 10, max: 60, step: 0.1, description: 'Body Mass Index' },
  Smoker: { label: 'Smoker', type: 'binary', description: 'Have you smoked 100+ cigarettes in your life?' },
  Stroke: { label: 'Stroke History', type: 'binary', description: 'Ever had a stroke?' },
  HeartDiseaseorAttack: { label: 'Heart Disease', type: 'binary', description: 'History of heart disease or attack?' },
  PhysActivity: { label: 'Physical Activity', type: 'binary', description: 'Physical activity in past 30 days?' },
  Fruits: { label: 'Fruit Consumption', type: 'binary', description: 'Consume fruit 1+ times per day?' },
  Veggies: { label: 'Vegetable Consumption', type: 'binary', description: 'Consume vegetables 1+ times per day?' },
  HvyAlcoholConsump: { label: 'Heavy Alcohol', type: 'binary', description: 'Heavy alcohol consumption?' },
  AnyHealthcare: { label: 'Healthcare Coverage', type: 'binary', description: 'Have healthcare coverage?' },
  GenHlth: { label: 'General Health', type: 'scale', min: 1, max: 5, description: '1=Excellent, 5=Poor' },
  MentHlth: { label: 'Mental Health Days', type: 'number', min: 0, max: 30, description: 'Poor mental health days (past 30)' },
  PhysHlth: { label: 'Physical Health Days', type: 'number', min: 0, max: 30, description: 'Poor physical health days (past 30)' },
  DiffWalk: { label: 'Difficulty Walking', type: 'binary', description: 'Serious difficulty walking?' },
  Sex: { label: 'Sex', type: 'binary', description: '0=Female, 1=Male' },
  Age: { label: 'Age Category', type: 'scale', min: 1, max: 13, description: '1=18-24, 13=80+' },
}

// Hidden fields with average values (not shown in UI)
const HIDDEN_DEFAULTS = {
  Education: 4,  // Average: Some college
  Income: 5,     // Average: $35k-$50k
  NoDocbcCost: 0 // Average: Can afford doctor
}

interface PredictionFormProps {
  onResult: (result: any) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  apiStatus: string
  calculatedBMI?: number
  onMetricsUpdate?: (metrics: any) => void
}

export default function PredictionForm({ onResult, loading, setLoading, apiStatus, calculatedBMI = 0, onMetricsUpdate }: PredictionFormProps) {
  const [formData, setFormData] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    Object.keys(FEATURE_CONFIG).forEach(key => {
      const config = FEATURE_CONFIG[key as keyof typeof FEATURE_CONFIG]
      if (config.type === 'binary') initial[key] = 0
      else if (config.type === 'number' && 'min' in config) initial[key] = key === 'BMI' ? calculatedBMI || config.min : config.min
      else if (config.type === 'scale' && 'min' in config && 'max' in config) initial[key] = Math.floor((config.min + config.max) / 2)
    })
    return initial
  })
  const [error, setError] = useState('')

  // Update BMI when calculatedBMI changes
  useEffect(() => {
    if (calculatedBMI > 0) {
      setFormData(prev => ({ ...prev, BMI: calculatedBMI }))
      updateMetrics({ ...formData, BMI: calculatedBMI })
    }
  }, [calculatedBMI])

  const updateMetrics = (data: Record<string, number>) => {
    if (onMetricsUpdate) {
      onMetricsUpdate(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Merge visible form data with hidden defaults
      const completeData = {
        ...formData,
        ...HIDDEN_DEFAULTS
      }
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
        features: completeData
      })
      onResult(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get prediction. Please try again.')
      console.error('Prediction error:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: number) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    updateMetrics(newData)
  }

  const renderField = (key: string) => {
    const config = FEATURE_CONFIG[key as keyof typeof FEATURE_CONFIG]
    
    if (config.type === 'binary') {
      return (
        <div className="glass-card p-6 card-hover">
          <label className="block mb-3">
            <span className="text-sm font-semibold text-gray-300">{config.label}</span>
            <span className="block text-xs text-gray-500 mt-1">{config.description}</span>
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => updateField(key, 0)}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                formData[key] === 0
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/50'
                  : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
              }`}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => updateField(key, 1)}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                formData[key] === 1
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/50'
                  : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
              }`}
            >
              Yes
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="glass-card p-6 card-hover">
        <label className="block mb-3">
          <span className="text-sm font-semibold text-gray-300">{config.label}</span>
          <span className="block text-xs text-gray-500 mt-1">{config.description}</span>
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min={'min' in config ? config.min : 0}
            max={'max' in config ? config.max : 100}
            step={'step' in config ? config.step : 1}
            value={formData[key]}
            onChange={(e) => updateField(key, parseFloat(e.target.value))}
            className="flex-1 h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <input
            type="number"
            min={'min' in config ? config.min : 0}
            max={'max' in config ? config.max : 100}
            step={'step' in config ? config.step : 1}
            value={formData[key]}
            onChange={(e) => updateField(key, parseFloat(e.target.value))}
            className="w-20 px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-center font-semibold"
          />
        </div>
      </div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="glass-card p-8 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
        Patient Health Assessment
      </h3>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center space-x-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{error}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Object.keys(FEATURE_CONFIG).map((key) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.02 * Object.keys(FEATURE_CONFIG).indexOf(key) }}
          >
            {renderField(key)}
          </motion.div>
        ))}
      </div>

      <motion.button
        type="submit"
        disabled={loading || apiStatus !== 'online'}
        className="w-full btn-primary flex items-center justify-center space-x-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Analyzing Health Data...</span>
          </>
        ) : (
          <>
            <span>Get ML-Powered Health Assessment</span>
          </>
        )}
      </motion.button>

      {apiStatus !== 'online' && (
        <p className="text-center text-red-400 mt-4">
          ⚠️ API is currently offline. Please ensure the backend server is running.
        </p>
      )}
    </motion.form>
  )
}
