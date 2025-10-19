import { View, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { usePredictionHistory } from '../../hooks/usePrediction';
import HistoryItem from '../../components/HistoryItem';
import { Trash2, RefreshCw } from 'lucide-react-native';
import { clearPredictions } from '../../lib/storage';

export default function HistoryScreen() {
  const { history, isLoading, error, refresh } = usePredictionHistory();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all prediction history? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearPredictions();
            await refresh();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-900 items-center justify-center">
        <Text className="text-white text-lg">Loading history...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-900 items-center justify-center p-4">
        <Text className="text-red-500 text-xl font-bold mb-2">Error</Text>
        <Text className="text-slate-400 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-900">
      <View className="p-4 border-b border-slate-800 flex-row justify-between items-center">
        <Text className="text-white text-lg font-semibold">
          {history.length} Prediction{history.length !== 1 ? 's' : ''}
        </Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={handleRefresh}
            disabled={refreshing}
            className="bg-blue-500 p-2 rounded-lg"
          >
            <RefreshCw size={20} color="white" />
          </TouchableOpacity>
          {history.length > 0 && (
            <TouchableOpacity
              onPress={handleClearHistory}
              className="bg-red-500 p-2 rounded-lg"
            >
              <Trash2 size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {history.length === 0 ? (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-slate-400 text-xl mb-2">No predictions yet</Text>
          <Text className="text-slate-500 text-center">
            Complete a health assessment to see your prediction history here
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1">
          <View className="p-4 gap-3">
            {history.map((item) => (
              <HistoryItem key={item.id} prediction={item} />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
