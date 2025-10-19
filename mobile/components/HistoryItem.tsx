import { View, Text, TouchableOpacity } from 'react-native';
import type { PredictionHistory } from '../lib/types';
import { Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

interface HistoryItemProps {
  prediction: PredictionHistory;
}

export default function HistoryItem({ prediction }: HistoryItemProps) {
  const { result, createdAt } = prediction;
  
  const getRiskColor = () => {
    if (result.prediction === 'diabetes') return { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400' };
    if (result.prediction === 'prediabetes') return { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400' };
    return { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400' };
  };

  const getRiskLabel = () => {
    if (result.prediction === 'diabetes') return 'High Risk';
    if (result.prediction === 'prediabetes') return 'Moderate Risk';
    return 'Low Risk';
  };

  const getRiskIcon = () => {
    if (result.prediction === 'diabetes') return <TrendingUp size={20} color="#ef4444" />;
    if (result.prediction === 'prediabetes') return <Minus size={20} color="#eab308" />;
    return <TrendingDown size={20} color="#10b981" />;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const colors = getRiskColor();

  return (
    <TouchableOpacity className={`${colors.bg} rounded-xl p-4 border ${colors.border}`}>
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center gap-2">
          {getRiskIcon()}
          <View>
            <Text className={`${colors.text} font-bold text-lg`}>{getRiskLabel()}</Text>
            <Text className="text-slate-400 text-sm">Risk Score: {result.risk_score}%</Text>
          </View>
        </View>
        <View className="bg-slate-900/50 px-3 py-1 rounded-full">
          <Text className="text-slate-400 text-xs">{result.inferenceTime}ms</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-1 mb-2">
        <Clock size={14} color="#64748b" />
        <Text className="text-slate-400 text-xs">{formatDate(createdAt)}</Text>
      </View>

      {result.source === 'onnx' && (
        <View className="bg-green-500/20 px-2 py-1 rounded-full self-start border border-green-500">
          <Text className="text-green-400 text-xs font-semibold">✓ Offline</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
