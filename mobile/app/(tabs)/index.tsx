import { View, ScrollView, Text, Alert } from 'react-native';
import { useState } from 'react';
import { usePrediction } from '../../hooks/usePrediction';
import PredictionForm from '../../components/PredictionForm';
import ResultsDisplay from '../../components/ResultsDisplay';
import type { HealthFeatures } from '../../lib/types';

export default function HomeScreen() {
  const { isModelLoaded, isLoading, error, result, predict, clearResult } = usePrediction();
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (features: HealthFeatures) => {
    try {
      await predict(features);
      setShowResults(true);
    } catch (err) {
      Alert.alert(
        'Prediction Failed',
        err instanceof Error ? err.message : 'Unable to generate prediction. Please try again.'
      );
    }
  };

  const handleNewPrediction = () => {
    clearResult();
    setShowResults(false);
  };

  if (!isModelLoaded) {
    return (
      <View className="flex-1 bg-slate-900 items-center justify-center p-4">
        <Text className="text-white text-xl font-bold mb-2">Loading Model...</Text>
        <Text className="text-slate-400 text-center">
          Preparing offline diabetes prediction model
        </Text>
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
    <ScrollView className="flex-1 bg-slate-900">
      <View className="p-4">
        {showResults && result ? (
          <ResultsDisplay result={result} onNewPrediction={handleNewPrediction} />
        ) : (
          <>
            <View className="mb-6">
              <Text className="text-white text-2xl font-bold mb-2">
                Health Assessment
              </Text>
              <Text className="text-slate-400">
                Answer the questions below to assess your diabetes risk. All data stays on your device.
              </Text>
              <View className="mt-2 bg-green-500/20 p-3 rounded-lg border border-green-500">
                <Text className="text-green-400 text-sm font-semibold">
                  ✓ 100% Offline • Privacy-First • Instant Results
                </Text>
              </View>
            </View>

            <PredictionForm onSubmit={handleSubmit} isLoading={isLoading} />
          </>
        )}
      </View>
    </ScrollView>
  );
}
