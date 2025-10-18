'use client'

import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, TrendingUp, Heart, RefreshCw, Sparkles } from 'lucide-react'

interface ResultsDisplayProps {
  result: any
  onReset: () => void
}

export default function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  const isHighRisk = result.prediction === 1
  const riskPercentage = result.risk_percentage || 0

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`glass-card p-8 border-2 ${
          isHighRisk ? 'border-red-500/50' : 'border-green-500/50'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {isHighRisk ? (
              <div className="bg-red-500/20 p-4 rounded-full">
                <AlertCircle className="w-12 h-12 text-red-400" />
              </div>
            ) : (
              <div className="bg-green-500/20 p-4 rounded-full">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
            )}
            <div>
              <h3 className="text-3xl font-bold">
                {result.prediction_label}
              </h3>
              <p className="text-gray-400">Diabetes Risk Assessment</p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>New Assessment</span>
          </button>
        </div>

        {/* Risk Percentage */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-gray-300">Risk Level</span>
            <span className="text-sm font-bold text-white">{riskPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${riskPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                riskPercentage < 30 ? 'bg-green-500' :
                riskPercentage < 70 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
            />
          </div>
        </div>

        {/* Probabilities */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4">
            <p className="text-sm text-gray-400 mb-1">No Diabetes</p>
            <p className="text-2xl font-bold text-green-400">
              {((result.probabilities?.no_diabetes || 0) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-gray-400 mb-1">Diabetes Risk</p>
            <p className="text-2xl font-bold text-red-400">
              {((result.probabilities?.diabetes || 0) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </motion.div>

      {/* Risk Factors */}
      {result.risk_factors && result.risk_factors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h4 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Heart className="w-6 h-6 text-red-400" />
            <span>Identified Risk Factors</span>
          </h4>
          <div className="space-y-3">
            {result.risk_factors.map((factor: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  factor.severity === 'critical' ? 'bg-red-500/10 border-red-500/50' :
                  factor.severity === 'high' ? 'bg-orange-500/10 border-orange-500/50' :
                  'bg-yellow-500/10 border-yellow-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">{factor.factor}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    factor.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                    factor.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {factor.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{factor.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Recommendations */}
      {result.recommendations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h4 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span>Evidence-Based Health Recommendations</span>
          </h4>

          {result.recommendations.emergency_note && (
            <div className={`p-4 rounded-lg mb-4 ${
              isHighRisk ? 'bg-red-500/10 border border-red-500/50' : 'bg-green-500/10 border border-green-500/50'
            }`}>
              <p className="font-semibold">{result.recommendations.emergency_note}</p>
            </div>
          )}

          {result.recommendations.ai_generated && result.recommendations.advice ? (
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                {result.recommendations.advice}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {result.recommendations.lifestyle && result.recommendations.lifestyle.length > 0 && (
                <div>
                  <h5 className="font-semibold text-primary-400 mb-2">Lifestyle Changes</h5>
                  <ul className="space-y-2">
                    {result.recommendations.lifestyle.map((rec: string, index: number) => (
                      <li key={index} className="text-gray-300">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.recommendations.nutrition && result.recommendations.nutrition.length > 0 && (
                <div>
                  <h5 className="font-semibold text-green-400 mb-2">Nutrition Guidelines</h5>
                  <ul className="space-y-2">
                    {result.recommendations.nutrition.map((rec: string, index: number) => (
                      <li key={index} className="text-gray-300">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.recommendations.exercise && result.recommendations.exercise.length > 0 && (
                <div>
                  <h5 className="font-semibold text-blue-400 mb-2">Exercise Recommendations</h5>
                  <ul className="space-y-2">
                    {result.recommendations.exercise.map((rec: string, index: number) => (
                      <li key={index} className="text-gray-300">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.recommendations.medical && result.recommendations.medical.length > 0 && (
                <div>
                  <h5 className="font-semibold text-purple-400 mb-2">Medical Monitoring</h5>
                  <ul className="space-y-2">
                    {result.recommendations.medical.map((rec: string, index: number) => (
                      <li key={index} className="text-gray-300">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Model Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-sm text-gray-500"
      >
        <p>Prediction generated by {result.model_name} model</p>
        <p>Confidence: {((result.confidence || 0) * 100).toFixed(1)}%</p>
        <p className="mt-2 text-xs">
          This assessment is for informational purposes only and should not replace professional medical advice.
        </p>
      </motion.div>
    </div>
  )
}
