import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGenerate } from '../useGenerate';
import { generationApi } from '../../services/api';

vi.mock('../../services/api');

describe('useGenerate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate successfully', async () => {
    const mockResult = {
      id: 1,
      imageUrl: '/test.jpg',
      prompt: 'test',
      style: 'Realistic',
      createdAt: new Date().toISOString(),
      status: 'completed',
    };

    vi.mocked(generationApi.create).mockResolvedValue(mockResult);

    const { result } = renderHook(() => useGenerate());

    await result.current.generate('test prompt', 'Realistic');

    await waitFor(() => {
      expect(result.current.result).toEqual(mockResult);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle model overload with retry', async () => {
    const mockResult = {
      id: 1,
      imageUrl: '/test.jpg',
      prompt: 'test',
      style: 'Realistic',
      createdAt: new Date().toISOString(),
      status: 'completed',
    };

    // First call fails, second succeeds
    vi.mocked(generationApi.create)
      .mockRejectedValueOnce({
        response: { status: 503 },
      })
      .mockResolvedValueOnce(mockResult);

    const { result } = renderHook(() => useGenerate());

    await result.current.generate('test prompt', 'Realistic');

    await waitFor(() => {
      expect(result.current.result).toEqual(mockResult);
      expect(generationApi.create).toHaveBeenCalledTimes(2);
    });
  });
});

