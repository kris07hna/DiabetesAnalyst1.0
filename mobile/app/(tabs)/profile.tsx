import { View, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { getStorageStats, clearAllData, getModelMetadata } from '../../lib/storage';
import { modelRunner } from '../../lib/onnxModel';
import { Trash2, Database, Cpu, Zap } from 'lucide-react-native';

export default function ProfileScreen() {
  const [stats, setStats] = useState({ predictionCount: 0, hasProfile: false, hasMetadata: false });
  const [modelInfo, setModelInfo] = useState<any>(null);

  useEffect(() => {
    loadStats();
    loadModelInfo();
  }, []);

  const loadStats = async () => {
    const storageStats = await getStorageStats();
    setStats(storageStats);
  };

  const loadModelInfo = async () => {
    const info = modelRunner.getModelInfo();
    const metadata = await getModelMetadata();
    setModelInfo({ ...info, metadata });
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all predictions, settings, and cached data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Everything',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            await loadStats();
            Alert.alert('Success', 'All data cleared successfully');
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-slate-900">
      <View className="p-4">
        {/* App Info */}
        <View className="bg-slate-800 rounded-xl p-4 mb-4">
          <Text className="text-white text-2xl font-bold mb-2">DiabetesAnalyst</Text>
          <Text className="text-slate-400 mb-4">
            Offline diabetes risk assessment powered by XGBoost ML
          </Text>
          <View className="flex-row gap-2 flex-wrap">
            <View className="bg-green-500/20 px-3 py-1 rounded-full border border-green-500">
              <Text className="text-green-400 text-xs font-semibold">100% Offline</Text>
            </View>
            <View className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500">
              <Text className="text-blue-400 text-xs font-semibold">Privacy-First</Text>
            </View>
            <View className="bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500">
              <Text className="text-purple-400 text-xs font-semibold">85.2% Accurate</Text>
            </View>
          </View>
        </View>

        {/* Model Info */}
        <View className="bg-slate-800 rounded-xl p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <Cpu size={20} color="#3b82f6" />
            <Text className="text-white text-lg font-semibold ml-2">Model Info</Text>
          </View>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-slate-400">Status</Text>
              <Text className="text-white font-semibold">
                {modelInfo?.loaded ? '✓ Loaded' : '○ Not Loaded'}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-slate-400">Type</Text>
              <Text className="text-white font-semibold">XGBoost + ONNX</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-slate-400">Features</Text>
              <Text className="text-white font-semibold">21 health indicators</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-slate-400">Accuracy</Text>
              <Text className="text-white font-semibold">85.23%</Text>
            </View>
          </View>
        </View>

        {/* Storage Info */}
        <View className="bg-slate-800 rounded-xl p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <Database size={20} color="#3b82f6" />
            <Text className="text-white text-lg font-semibold ml-2">Storage</Text>
          </View>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-slate-400">Predictions Saved</Text>
              <Text className="text-white font-semibold">{stats.predictionCount}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-slate-400">Data Location</Text>
              <Text className="text-white font-semibold">Local Device</Text>
            </View>
          </View>
        </View>

        {/* Performance */}
        <View className="bg-slate-800 rounded-xl p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <Zap size={20} color="#3b82f6" />
            <Text className="text-white text-lg font-semibold ml-2">Performance</Text>
          </View>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-slate-400">Inference Speed</Text>
              <Text className="text-white font-semibold">&lt;100ms</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-slate-400">Runtime</Text>
              <Text className="text-white font-semibold">ONNX Runtime</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-slate-400">Internet Required</Text>
              <Text className="text-white font-semibold">No</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity
          onPress={handleClearAllData}
          className="bg-red-500 rounded-xl p-4 flex-row items-center justify-center"
        >
          <Trash2 size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Clear All Data</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View className="mt-6 items-center">
          <Text className="text-slate-500 text-xs">Version 1.0.0</Text>
          <Text className="text-slate-500 text-xs mt-1">
            Built with Expo • React Native • ONNX Runtime
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
