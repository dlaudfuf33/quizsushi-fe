"use client";

import { useState, useCallback } from "react";

export function useOptimisticUpdate<T>(initialData: T[]) {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const optimisticUpdate = useCallback(
    async (
      updateFn: (currentData: T[]) => T[],
      apiCall: () => Promise<any>,
      onSuccess?: (result: any) => void,
      onError?: (error: any) => void
    ) => {
      // 낙관적 업데이트
      const previousData = data;
      const optimisticData = updateFn(data);
      setData(optimisticData);
      setIsLoading(true);

      try {
        const result = await apiCall();
        if (onSuccess) {
          onSuccess(result);
        }
      } catch (error) {
        // 에러 발생 시 이전 상태로 롤백
        setData(previousData);
        if (onError) {
          onError(error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [data]
  );

  return {
    data,
    setData,
    isLoading,
    optimisticUpdate,
  };
}
