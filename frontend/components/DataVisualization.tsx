'use client'

import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface DataVisualizationProps {
  result: any
}

export default function DataVisualization({ result }: DataVisualizationProps) {
  const probabilityData = [
    { name: 'No Diabetes', value: (result.probabilities?.no_diabetes || 0) * 100 },
    { name: 'Diabetes Risk', value: (result.probabilities?.diabetes || 0) * 100 },
  ]

  const COLORS = ['#10b981', '#ef4444']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h4 className="text-xl font-bold mb-6 flex items-center space-x-2">
        <BarChart3 className="w-6 h-6 text-primary-400" />
        <span>Risk Analysis Visualization</span>
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-900/50 p-4 rounded-lg">
          <h5 className="text-sm font-semibold text-gray-400 mb-4">Probability Distribution</h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={probabilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-dark-900/50 p-4 rounded-lg flex items-center justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={probabilityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {probabilityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}
