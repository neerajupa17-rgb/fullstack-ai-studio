import { useState, useRef } from 'react';
import { generationApi } from '../services/api';

interface GenerationResult {
  id: number;
  imageUrl: string;
  prompt: string;
  style: string;
  createdAt: string;
  status: string;
}

export function useGenerate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const generate = async (
    prompt: string,
    style: string,
    imageFile?: File
  ): Promise<GenerationResult | null> => {
    // Cancel previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const response = await generationApi.create(
        prompt,
        style,
        imageFile,
        abortControllerRef.current.signal
      );
      setResult(response);
      retryCountRef.current = 0;
      return response;
    } catch (err: any) {
      // Handle abort
      if (err.name === 'AbortError' || err.message === 'canceled' || err.code === 'ERR_CANCELED') {
        return null;
      }

      // Handle model overload (503)
      if (err.response?.status === 503) {
        const currentRetries = retryCountRef.current;
        if (currentRetries < maxRetries) {
          retryCountRef.current = currentRetries + 1;
          setError(
            `Model overloaded. Retrying... (${currentRetries + 1}/${maxRetries})`
          );
          // Exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, currentRetries) * 1000)
          );
          return generate(prompt, style, imageFile);
        } else {
          setError('Model overloaded. Maximum retries reached. Please try again later.');
          return null;
        }
      }

      setError(err.response?.data?.error || 'Generation failed');
      retryCountRef.current = 0;
      return null;
    } finally {
      setLoading(false);
    }
  };

  const abort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      setError(null);
    }
  };

  const reset = () => {
    retryCountRef.current = 0;
    setError(null);
    setResult(null);
  };

  return { generate, abort, reset, loading, error, result };
}

