'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

interface HealthComparisonProps {
  userMetrics: {
    BMI: number
    HighBP: number
    HighChol: number
    PhysActivity: number
    GenHlth: number
    Age: number
  }
  riskPercentage?: number
}

export default function HealthComparison({ userMetrics, riskPercentage }: HealthComparisonProps) {
  const healthyAverages = {
    BMI: 22.5,
    bloodPressure: 'Normal',
    cholesterol: 'Normal',
    physicalActivity: 'Active',
    generalHealth: 'Good',
    diabetesRisk: 15
  }

  const comparisons = [
    {
      metric: 'BMI',
      userValue: userMetrics.BMI.toFixed(1),
      healthyValue: healthyAverages.BMI.toFixed(1),
      unit: '',
      status: userMetrics.BMI <= 25 ? 'good' : userMetrics.BMI <= 30 ? 'warning' : 'critical',
      difference: ((userMetrics.BMI - healthyAverages.BMI) / healthyAverages.BMI * 100).toFixed(0)
    },
    {
      metric: 'Blood Pressure',
      userValue: userMetrics.HighBP === 1 ? 'High' : 'Normal',
      healthyValue: healthyAverages.bloodPressure,
      unit: '',
      status: userMetrics.HighBP === 0 ? 'good' : 'critical',
      difference: userMetrics.HighBP === 1 ? '100' : '0'
    },
    {
      metric: 'Cholesterol',
      userValue: userMetrics.HighChol === 1 ? 'High' : 'Normal',
      healthyValue: healthyAverages.cholesterol,
      unit: '',
      status: userMetrics.HighChol === 0 ? 'good' : 'critical',
      difference: userMetrics.HighChol === 1 ? '100' : '0'
    },
    {
      metric: 'Physical Activity',
      userValue: userMetrics.PhysActivity === 1 ? 'Active' : 'Inactive',
      healthyValue: healthyAverages.physicalActivity,
      unit: '',
      status: userMetrics.PhysActivity === 1 ? 'good' : 'warning',
      difference: userMetrics.PhysActivity === 0 ? '-100' : '0'
    },
    {
      metric: 'General Health',
      userValue: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'][Math.min(userMetrics.GenHlth - 1, 4)] || 'Good',
      healthyValue: healthyAverages.generalHealth,
      unit: '',
      status: userMetrics.GenHlth <= 2 ? 'good' : userMetrics.GenHlth <= 3 ? 'warning' : 'critical',
      difference: ((userMetrics.GenHlth - 2) * 33).toFixed(0)
    },
    {
      metric: 'Diabetes Risk',
      userValue: riskPercentage?.toFixed(1) || '0',
      healthyValue: healthyAverages.diabetesRisk.toString(),
      unit: '%',
      status: (riskPercentage || 0) < 30 ? 'good' : (riskPercentage || 0) < 60 ? 'warning' : 'critical',
      difference: (((riskPercentage || 0) - healthyAverages.diabetesRisk) / healthyAverages.diabetesRisk * 100).toFixed(0)
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'from-green-500 to-emerald-500'
      case 'warning':
        return 'from-yellow-500 to-orange-500'
      case 'critical':
        return 'from-red-500 to-rose-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500/10'
      case 'warning':
        return 'bg-yellow-500/10'
      case 'critical':
        return 'bg-red-500/10'
      default:
        return 'bg-gray-500/10'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-6 h-6 text-primary-400" />
        <h3 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
          Health Metrics Comparison
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparisons.map((comparison, index) => (
          <motion.div
            key={comparison.metric}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`${getStatusBg(comparison.status)} p-4 rounded-lg border border-dark-700`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-400">{comparison.metric}</span>
              <div className="flex items-center gap-1">
                {Number(comparison.difference) > 0 ? (
                  <TrendingUp className="w-4 h-4 text-red-400" />
                ) : Number(comparison.difference) < 0 ? (
                  <TrendingDown className="w-4 h-4 text-green-400" />
                ) : (
                  <div className="w-4 h-0.5 bg-gray-400" />
                )}
                <span className={`text-xs font-semibold ${
                  Number(comparison.difference) > 0 ? 'text-red-400' : 
                  Number(comparison.difference) < 0 ? 'text-green-400' : 
                  'text-gray-400'
                }`}>
                  {comparison.difference !== '0' && (Number(comparison.difference) > 0 ? '+' : '')}{comparison.difference}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Your Value</span>
                <span className="text-lg font-bold text-white">
                  {comparison.userValue}{comparison.unit}
                </span>
              </div>

              <div className="relative h-2 bg-dark-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.abs(Number(comparison.difference)) + 50)}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`h-full bg-gradient-to-r ${getStatusColor(comparison.status)}`}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Healthy Average</span>
                <span className="text-sm font-medium text-green-400">
                  {comparison.healthyValue}{comparison.unit}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-dark-900/50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
            <span className="text-xs text-gray-400">Healthy Range</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" />
            <span className="text-xs text-gray-400">Monitor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-rose-600 rounded-full" />
            <span className="text-xs text-gray-400">Critical</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
