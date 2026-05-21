"use client";

import { useTimerData } from "../hooks/useTimerData";

interface TimerProviderProps {
  children: React.ReactNode;
}

export default function TimerProvider({ children }: TimerProviderProps) {
  useTimerData();
  return <>{children}</>;
}
