"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { timerTrackerApi } from "../api/timeTracker.api";
import { setStartTimer, setStopTimer } from "../model/timeTracker.store";
import toast from "react-hot-toast";

export function useTimer() {
  const queryClient = useQueryClient();

  const startTimerMutation = useMutation({
    mutationFn: timerTrackerApi.startTimer,
  });

  const stopTimerMutation = useMutation({
    mutationFn: timerTrackerApi.stopTimer,
  });

  const handleStartTimer = (dateStart: Date) => {
    startTimerMutation.mutate(
      { dateStart },
      {
        onSuccess(data) {
          setStartTimer(data.id, data.dateStart);
        },
        onError(error) {
          toast.error(error.message);
        },
        async onSettled() {
          await queryClient.invalidateQueries(
            timerTrackerApi.getTimerTrackerQueryOptions()
          );
        },
      }
    );
  };

  const handleStopTimer = (id: string, pause: Date) => {
    setStopTimer(id, pause.getTime());
    stopTimerMutation.mutate(
      { id: id, datePause: pause },
      {
        onSuccess() {
          setStopTimer(id, pause.getTime());
        },
        onError(error) {
          toast.error(error.message);
        },
        async onSettled() {
          await queryClient.invalidateQueries(
            timerTrackerApi.getTimerTrackerQueryOptions()
          );
        },
      }
    );
  };

  return {
    handleStopTimer,
    handleStartTimer,
    isPending: startTimerMutation.isPending,
  };
}
