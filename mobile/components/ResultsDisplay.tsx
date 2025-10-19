import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import type { PredictionResult } from '../lib/types';
import { AlertCircle, CheckCircle, AlertTriangle, Zap, Clock } from 'lucide-react-native';

interface ResultsDisplayProps {
  result: PredictionResult;
  onNewPrediction: () => void;
}

export default function ResultsDisplay({ result, onNewPrediction }: ResultsDisplayProps) {
  const getRiskColor = () => {
    if (result.prediction === 'diabetes') return { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', icon: 'red' };
    if (result.prediction === 'prediabetes') return { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400', icon: 'yellow' };
    return { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400', icon: 'green' };
  };

  const getRiskLabel = () => {
    if (result.prediction === 'diabetes') return 'High Risk';
    if (result.prediction === 'prediabetes') return 'Moderate Risk';
    return 'Low Risk';
  };

  const getRiskIcon = () => {
    const colors = getRiskColor();
    const iconColor = colors.icon === 'red' ? '#ef4444' : colors.icon === 'yellow' ? '#eab308' : '#10b981';
    
    if (result.prediction === 'diabetes') return <AlertCircle size={48} color={iconColor} />;
    if (result.prediction === 'prediabetes') return <AlertTriangle size={48} color={iconColor} />;
    return <CheckCircle size={48} color={iconColor} />;
  };

  const colors = getRiskColor();

  return (
    <ScrollView className="gap-4">
      {/* Result Card */}
      <View className={`${colors.bg} rounded-xl p-6 border ${colors.border}`}>
        <View className="items-center mb-4">
          {getRiskIcon()}
          <Text className={`${colors.text} text-2xl font-bold mt-3`}>
            {getRiskLabel()}
          </Text>
          <Text className="text-slate-400 text-center mt-2">
            Based on your health assessment
          </Text>
        </View>

        <View className="bg-slate-900/50 rounded-lg p-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-slate-300">Risk Score</Text>
            <Text className={`${colors.text} text-2xl font-bold`}>
              {result.risk_score}%
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-slate-300">Confidence</Text>
            <Text className="text-white font-semibold">
              {(result.confidence * 100).toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Performance Badge */}
      <View className="bg-slate-800 rounded-xl p-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Zap size={20} color="#10b981" />
          <Text className="text-white font-semibold">Inference Time</Text>
        </View>
        <Text className="text-green-400 font-bold">{result.inferenceTime}ms</Text>
      </View>

      {/* Source Badge */}
      <View className="bg-slate-800 rounded-xl p-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Clock size={20} color="#3b82f6" />
          <Text className="text-white font-semibold">Source</Text>
        </View>
        <View className="bg-green-500/20 px-3 py-1 rounded-full border border-green-500">
          <Text className="text-green-400 text-xs font-semibold">
            {result.source === 'onnx' ? '✓ Offline ONNX' : 'Server API'}
          </Text>
        </View>
      </View>

      {/* Recommendations */}
      <View className="bg-slate-800 rounded-xl p-4">
        <Text className="text-white text-lg font-bold mb-3">Recommendations</Text>
        <View className="gap-3">
          {result.recommendations.map((rec, index) => (
            <View key={index} className="flex-row gap-2">
              <Text className={`${colors.text} font-bold`}>•</Text>
              <Text className="text-slate-300 flex-1">{rec}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Disclaimer */}
      <View className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <Text className="text-slate-400 text-xs text-center">
          ⚠️ This is a screening tool, not a diagnosis. Consult with a healthcare professional for medical advice.
        </Text>
      </View>

      {/* New Prediction Button */}
      <TouchableOpacity
        onPress={onNewPrediction}
        className="bg-blue-500 rounded-xl p-4 items-center"
      >
        <Text className="text-white font-bold text-lg">New Assessment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
