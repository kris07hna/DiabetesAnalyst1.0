// React hook for predictions with offline support

import { useState, useEffect, useCallback } from 'react';
import { modelRunner } from '../lib/onnxModel';
import { savePrediction, getPredictions } from '../lib/storage';
import type { HealthFeatures, PredictionResult, PredictionHistory } from '../lib/types';

export function usePrediction() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);

  // Load model on mount
  useEffect(() => {
    let mounted = true;

    async function loadModel() {
      try {
        console.log('[usePrediction] Loading ONNX model...');
        await modelRunner.loadModel();
        
        if (mounted) {
          setIsModelLoaded(true);
          console.log('[usePrediction] Model loaded successfully');
        }
      } catch (err) {
        console.error('[usePrediction] Model load failed:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load model');
        }
      }
    }

    loadModel();

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Run prediction on health features
   */
  const predict = useCallback(async (features: HealthFeatures): Promise<PredictionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Run ONNX inference
      const prediction = await modelRunner.predict(features);
      setResult(prediction);

      // Save to local storage
      const historyEntry: PredictionHistory = {
        id: Date.now().toString(),
        features,
        result: prediction,
        createdAt: Date.now(),
        syncedToCloud: false,
      };

      await savePrediction(historyEntry);
      console.log('[usePrediction] Prediction saved to local storage');

      return prediction;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Prediction failed';
      setError(errorMessage);
      console.error('[usePrediction] Prediction error:', err);
      throw err;

    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear current result
   */
  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    isModelLoaded,
    isLoading,
    error,
    result,
    predict,
    clearResult,
  };
}

/**
 * Hook for prediction history
 */
export function usePredictionHistory() {
  const [history, setHistory] = useState<PredictionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load history from storage
   */
  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const predictions = await getPredictions();
      setHistory(predictions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load history';
      setError(errorMessage);
      console.error('[usePredictionHistory] Load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  /**
   * Refresh history
   */
  const refresh = useCallback(() => {
    return loadHistory();
  }, [loadHistory]);

  return {
    history,
    isLoading,
    error,
    refresh,
  };
}
