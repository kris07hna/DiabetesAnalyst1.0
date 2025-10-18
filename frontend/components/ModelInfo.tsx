'use client'

import { motion } from 'framer-motion'
import { Brain, Target, Zap, Award } from 'lucide-react'

interface ModelInfoProps {
  data: any
}

export default function ModelInfo({ data }: ModelInfoProps) {
  const topFeatures = data.feature_importance 
    ? Object.entries(data.feature_importance).slice(0, 5) as [string, number][]
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-8"
    >
      <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
        <Brain className="w-6 h-6 text-primary-400" />
        <span>Model Information</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-900/50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-gray-400">Model</span>
          </div>
          <p className="text-lg font-bold text-white">{data.model_name}</p>
        </div>

        <div className="bg-dark-900/50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400">Accuracy</span>
          </div>
          <p className="text-lg font-bold text-green-400">
            {(data.metrics.accuracy * 100).toFixed(2)}%
          </p>
        </div>

        <div className="bg-dark-900/50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">F1-Score</span>
          </div>
          <p className="text-lg font-bold text-blue-400">
            {(data.metrics.f1_score * 100).toFixed(2)}%
          </p>
        </div>

        <div className="bg-dark-900/50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">Features</span>
          </div>
          <p className="text-lg font-bold text-purple-400">{data.feature_count}</p>
        </div>
      </div>

      {topFeatures.length > 0 && (
        <div className="bg-dark-900/50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">Top 5 Most Important Features</h4>
          <div className="space-y-2">
            {topFeatures.map(([feature, importance], index) => (
              <div key={feature} className="flex items-center space-x-3">
                <span className="text-xs font-semibold text-gray-500 w-6">{index + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">{feature}</span>
                    <span className="text-xs text-gray-400">{(importance * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${importance * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
