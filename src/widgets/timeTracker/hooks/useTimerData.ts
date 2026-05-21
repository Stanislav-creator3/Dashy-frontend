"use client";

import { useQuery } from "@tanstack/react-query";
import { timerTrackerApi } from "../api/timeTracker.api";
import { useTimeTrackerStore, setTimerData } from "../model/timeTracker.store";
import { useEffect, useState } from "react";

export function useTimerData() {
  const today = new Date();
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const { isTimerActive, timerId, timeDate, reset } = useTimeTrackerStore();

  const [enabled, setEnabled] = useState(true);

  const {
    data: timerData,
    isLoading,
    error,
  } = useQuery({
    ...timerTrackerApi.getTimerTrackerQueryOptions(),
    enabled: enabled,
  });

  if (timeDate !== null && timeDate > endOfDay.getTime()) {
    reset();
  }

  useEffect(() => {
    if (error || timerData) {
      setEnabled(false);
    }
    if (timerData) {
      const { id, dateStart, isActive } = timerData;
      const startTime = new Date(dateStart).getTime();

      // Update local store whenever any of the important fields differ
      if (
        timerId !== id &&
        timeDate !== startTime &&
        isTimerActive !== isActive
      ) {
        setTimerData(id, startTime, isActive);
      }
    }
  }, [timerData, timerId, timeDate, isTimerActive, error]);

  return {
    timerData,
    isLoading,
    error,
    isTimerActive,
  };
}
