import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useState } from 'react';
import type { HealthFeatures } from '../lib/types';
import { FEATURE_DEFAULTS } from '../lib/types';

interface PredictionFormProps {
  onSubmit: (features: HealthFeatures) => void;
  isLoading: boolean;
}

export default function PredictionForm({ onSubmit, isLoading }: PredictionFormProps) {
  const [form, setForm] = useState({
    HighBP: false,
    HighChol: false,
    CholCheck: true,
    BMI: '',
    Smoker: false,
    Stroke: false,
    HeartDiseaseorAttack: false,
    PhysActivity: true,
    Fruits: true,
    Veggies: true,
    HvyAlcoholConsump: false,
    AnyHealthcare: true,
    GenHlth: '3',
    MentHlth: '0',
    PhysHlth: '0',
    DiffWalk: false,
    Sex: 'male',
    Age: '',
  });

  const handleSubmit = () => {
    if (!form.BMI || !form.Age) {
      alert('Please fill in BMI and Age');
      return;
    }

    const features: HealthFeatures = {
      HighBP: form.HighBP ? 1 : 0,
      HighChol: form.HighChol ? 1 : 0,
      CholCheck: form.CholCheck ? 1 : 0,
      BMI: parseFloat(form.BMI),
      Smoker: form.Smoker ? 1 : 0,
      Stroke: form.Stroke ? 1 : 0,
      HeartDiseaseorAttack: form.HeartDiseaseorAttack ? 1 : 0,
      PhysActivity: form.PhysActivity ? 1 : 0,
      Fruits: form.Fruits ? 1 : 0,
      Veggies: form.Veggies ? 1 : 0,
      HvyAlcoholConsump: form.HvyAlcoholConsump ? 1 : 0,
      AnyHealthcare: form.AnyHealthcare ? 1 : 0,
      NoDocbcCost: FEATURE_DEFAULTS.NoDocbcCost,
      GenHlth: parseInt(form.GenHlth),
      MentHlth: parseFloat(form.MentHlth),
      PhysHlth: parseFloat(form.PhysHlth),
      DiffWalk: form.DiffWalk ? 1 : 0,
      Sex: form.Sex === 'male' ? 1 : 0,
      Age: parseInt(form.Age),
      Education: FEATURE_DEFAULTS.Education,
      Income: FEATURE_DEFAULTS.Income,
    };

    onSubmit(features);
  };

  return (
    <ScrollView className="gap-4">
      {/* BMI Input */}
      <View className="bg-slate-800 rounded-xl p-4">
        <Text className="text-white font-semibold mb-2">Body Mass Index (BMI) *</Text>
        <TextInput
          className="bg-slate-700 text-white p-3 rounded-lg"
          placeholder="Enter BMI (e.g., 25.5)"
          placeholderTextColor="#64748b"
          keyboardType="decimal-pad"
          value={form.BMI}
          onChangeText={(val) => setForm({ ...form, BMI: val })}
        />
      </View>

      {/* Age Input */}
      <View className="bg-slate-800 rounded-xl p-4">
        <Text className="text-white font-semibold mb-2">Age Category *</Text>
        <TextInput
          className="bg-slate-700 text-white p-3 rounded-lg"
          placeholder="Age (1-13 scale)"
          placeholderTextColor="#64748b"
          keyboardType="number-pad"
          value={form.Age}
          onChangeText={(val) => setForm({ ...form, Age: val })}
        />
        <Text className="text-slate-400 text-xs mt-1">
          1=18-24, 2=25-29, 3=30-34, 4=35-39, 5=40-44, 6=45-49, 7=50-54, 8=55-59, 9=60-64, 10=65-69, 11=70-74, 12=75-79, 13=80+
        </Text>
      </View>

      {/* Sex */}
      <View className="bg-slate-800 rounded-xl p-4">
        <Text className="text-white font-semibold mb-2">Sex</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setForm({ ...form, Sex: 'male' })}
            className={`flex-1 p-3 rounded-lg ${form.Sex === 'male' ? 'bg-blue-500' : 'bg-slate-700'}`}
          >
            <Text className="text-white text-center font-semibold">Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setForm({ ...form, Sex: 'female' })}
            className={`flex-1 p-3 rounded-lg ${form.Sex === 'female' ? 'bg-blue-500' : 'bg-slate-700'}`}
          >
            <Text className="text-white text-center font-semibold">Female</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* General Health */}
      <View className="bg-slate-800 rounded-xl p-4">
        <Text className="text-white font-semibold mb-2">General Health</Text>
        <View className="flex-row gap-2 flex-wrap">
          {['1', '2', '3', '4', '5'].map((val) => (
            <TouchableOpacity
              key={val}
              onPress={() => setForm({ ...form, GenHlth: val })}
              className={`px-4 py-2 rounded-lg ${form.GenHlth === val ? 'bg-blue-500' : 'bg-slate-700'}`}
            >
              <Text className="text-white font-semibold">{val}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="text-slate-400 text-xs mt-1">1=Excellent, 5=Poor</Text>
      </View>

      {/* Health Conditions */}
      <View className="bg-slate-800 rounded-xl p-4 gap-3">
        <Text className="text-white font-semibold mb-1">Health Conditions</Text>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-300">High Blood Pressure</Text>
          <Switch value={form.HighBP} onValueChange={(val) => setForm({ ...form, HighBP: val })} />
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-300">High Cholesterol</Text>
          <Switch value={form.HighChol} onValueChange={(val) => setForm({ ...form, HighChol: val })} />
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-300">Stroke History</Text>
          <Switch value={form.Stroke} onValueChange={(val) => setForm({ ...form, Stroke: val })} />
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-300">Heart Disease/Attack</Text>
          <Switch value={form.HeartDiseaseorAttack} onValueChange={(val) => setForm({ ...form, HeartDiseaseorAttack: val })} />
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-300">Difficulty Walking</Text>
          <Switch value={form.DiffWalk} onValueChange={(val) => setForm({ ...form, DiffWalk: val })} />
        </View>
      </View>

      {/* Lifestyle */}
      <View className="bg-slate-800 rounded-xl p-4 gap-3">
        <Text className="text-white font-semibold mb-1">Lifestyle</Text>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-300">Currently Smoking</Text>
          <Switch value={form.Smoker} onValueChange={(val) => setForm({ ...form, Smoker: val })} />
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-300">Physical Activity (30 days)</Text>
          <Switch value={form.PhysActivity} onValueChange={(val) => setForm({ ...form, PhysActivity: val })} />
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-300">Daily Fruits</Text>
          <Switch value={form.Fruits} onValueChange={(val) => setForm({ ...form, Fruits: val })} />
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-300">Daily Vegetables</Text>
          <Switch value={form.Veggies} onValueChange={(val) => setForm({ ...form, Veggies: val })} />
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-300">Heavy Alcohol Consumption</Text>
          <Switch value={form.HvyAlcoholConsump} onValueChange={(val) => setForm({ ...form, HvyAlcoholConsump: val })} />
        </View>
      </View>

      {/* Healthcare */}
      <View className="bg-slate-800 rounded-xl p-4 gap-3">
        <Text className="text-white font-semibold mb-1">Healthcare</Text>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-300">Have Healthcare Coverage</Text>
          <Switch value={form.AnyHealthcare} onValueChange={(val) => setForm({ ...form, AnyHealthcare: val })} />
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-300">Cholesterol Check (5 years)</Text>
          <Switch value={form.CholCheck} onValueChange={(val) => setForm({ ...form, CholCheck: val })} />
        </View>
      </View>

      {/* Mental/Physical Health Days */}
      <View className="bg-slate-800 rounded-xl p-4 gap-3">
        <Text className="text-white font-semibold mb-2">Health Days (past 30 days)</Text>
        
        <View>
          <Text className="text-slate-300 mb-2">Mental Health Days</Text>
          <TextInput
            className="bg-slate-700 text-white p-3 rounded-lg"
            placeholder="0-30 days"
            placeholderTextColor="#64748b"
            keyboardType="number-pad"
            value={form.MentHlth}
            onChangeText={(val) => setForm({ ...form, MentHlth: val })}
          />
        </View>
        
        <View>
          <Text className="text-slate-300 mb-2">Physical Health Days</Text>
          <TextInput
            className="bg-slate-700 text-white p-3 rounded-lg"
            placeholder="0-30 days"
            placeholderTextColor="#64748b"
            keyboardType="number-pad"
            value={form.PhysHlth}
            onChangeText={(val) => setForm({ ...form, PhysHlth: val })}
          />
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isLoading}
        className={`rounded-xl p-4 items-center ${isLoading ? 'bg-slate-600' : 'bg-blue-500'}`}
      >
        <Text className="text-white font-bold text-lg">
          {isLoading ? 'Analyzing...' : 'Get Prediction'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
