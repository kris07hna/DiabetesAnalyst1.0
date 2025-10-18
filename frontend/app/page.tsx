'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, Heart, Brain, TrendingUp, AlertCircle, 
  CheckCircle, BarChart3, Sparkles, Shield, Zap
} from 'lucide-react'
import PredictionForm from '@/components/PredictionForm'
import ResultsDisplay from '@/components/ResultsDisplay'
import DataVisualization from '@/components/DataVisualization'
import ModelInfo from '@/components/ModelInfo'
import BMICalculator from '@/components/BMICalculator'
import HealthComparison from '@/components/HealthComparison'
import { InteractiveNebulaShader } from '@/components/liquid-shader'

export default function Home() {
  const [predictionResult, setPredictionResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [modelInfo, setModelInfo] = useState<any>(null)
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [calculatedBMI, setCalculatedBMI] = useState<number>(0)
  const [currentMetrics, setCurrentMetrics] = useState<any>(null)

  useEffect(() => {
    checkAPIStatus()
    fetchModelInfo()
  }, [])

  const checkAPIStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
      if (response.ok) {
        setApiStatus('online')
      } else {
        setApiStatus('offline')
      }
    } catch (error) {
      setApiStatus('offline')
    }
  }

  const fetchModelInfo = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/model-info`)
      if (response.ok) {
        const data = await response.json()
        setModelInfo(data)
      }
    } catch (error) {
      console.error('Failed to fetch model info:', error)
    }
  }

  const handlePrediction = (result: any) => {
    setPredictionResult(result)
  }

  const resetPrediction = () => {
    setPredictionResult(null)
    setCurrentMetrics(null)
  }

  const handleBMICalculated = (bmi: number) => {
    setCalculatedBMI(bmi)
  }

  const handleMetricsUpdate = (metrics: any) => {
    setCurrentMetrics(metrics)
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-dark-950">
      {/* Interactive Nebula Shader Background */}
      <div className="fixed inset-0 z-0">
        <InteractiveNebulaShader />
      </div>

      {/* Overlay to ensure readability */}
      <div className="fixed inset-0 z-0 bg-dark-950/40 backdrop-blur-[2px]" />

      {/* Header */}
      <header className="relative z-10 border-b border-dark-800/50 backdrop-blur-lg">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="bg-gradient-to-br from-primary-600 to-purple-600 p-2 rounded-xl">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                  DiabetesAnalyst Pro
                </h1>
                <p className="text-xs text-gray-400">AI-Powered Health Assessment</p>
              </div>
            </motion.div>

            {/* API Status */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                apiStatus === 'online' ? 'bg-green-500/10 text-green-400' :
                apiStatus === 'offline' ? 'bg-red-500/10 text-red-400' :
                'bg-yellow-500/10 text-yellow-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  apiStatus === 'online' ? 'bg-green-400' :
                  apiStatus === 'offline' ? 'bg-red-400' :
                  'bg-yellow-400'
                } ${apiStatus !== 'offline' && 'animate-pulse'}`} />
                <span className="text-sm font-medium">
                  {apiStatus === 'online' ? 'API Online' :
                   apiStatus === 'offline' ? 'API Offline' :
                   'Checking...'}
                </span>
              </div>
            </motion.div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        {!predictionResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Advanced Diabetes Risk Assessment
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Advanced XGBoost machine learning model trained on real health data 
              to provide accurate diabetes risk predictions with evidence-based recommendations
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
              {[
                { icon: Brain, title: 'XGBoost ML', desc: 'Advanced Algorithm', color: 'from-primary-600 to-purple-600' },
                { icon: Shield, title: 'Accurate', desc: '85.2% Accuracy', color: 'from-purple-600 to-pink-600' },
                { icon: Zap, title: 'Instant', desc: 'Real-time Results', color: 'from-pink-600 to-red-600' },
                { icon: Heart, title: 'Evidence-Based', desc: 'Clinical Guidelines', color: 'from-red-600 to-orange-600' },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 card-hover"
                >
                  <div className={`bg-gradient-to-br ${feature.color} p-3 rounded-xl w-fit mx-auto mb-3`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Model Info Card */}
        {modelInfo && !predictionResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ModelInfo data={modelInfo} />
          </motion.div>
        )}

        {/* Prediction Form or Results */}
        {!predictionResult ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* BMI Calculator */}
            <BMICalculator 
              onBMICalculated={handleBMICalculated}
              initialBMI={calculatedBMI}
            />

            <PredictionForm 
              onResult={handlePrediction} 
              loading={loading} 
              setLoading={setLoading}
              apiStatus={apiStatus}
              calculatedBMI={calculatedBMI}
              onMetricsUpdate={handleMetricsUpdate}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {currentMetrics && (
              <HealthComparison 
                userMetrics={currentMetrics}
                riskPercentage={predictionResult.risk_percentage}
              />
            )}
            <ResultsDisplay result={predictionResult} onReset={resetPrediction} />
            <DataVisualization result={predictionResult} />
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-dark-800/50 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400 text-sm">
            <p className="mb-2">
              © 2025 DiabetesAnalyst Pro. Powered by XGBoost Machine Learning
            </p>
            <p className="text-xs text-gray-500">
              This tool is for educational and informational purposes only. 
              Always consult with healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
