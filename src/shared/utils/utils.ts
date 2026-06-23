import { FlattenedItem } from "@/widgets/sidebar/model/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UniqueIdentifier } from "@dnd-kit/abstract";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHoursMinutes(totalMinutes: number) {
  const hours = (totalMinutes / 60).toFixed(0);
  const minutes = totalMinutes % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}

export function getDatesFromCurrentWeek(today: Date) {
  const currentDay = today.getDay();
  const startOfWeek = new Date(today);
  const dayOfWeek = currentDay === 0 ? 6 : currentDay - 1;
  startOfWeek.setDate(today.getDate() - dayOfWeek);

  const dates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date);
  }

  return dates;
}

export function formatDate(arrayDate: Date[]) {
  const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  const formattedDays = arrayDate.map((date, index) => ({
    day: date.getDate().toString(),
    dayName: days[date.getDay()],
    fullDate: date,
    dayIndex: index,
  }));

  return formattedDays;
}

const countUp = (val: string, max: string) => {
  const numberArray = [];
  const start = parseInt(val, 10);
  const end = parseInt(max, 10);

  for (let i = start; i <= end; i++) {
    numberArray.push(i.toString());
  }

  return numberArray;
};

const countDown = (val: string, max: string) => {
  const numberArray = [];
  const start = parseInt(val, 10);
  const end = parseInt(max, 10);

  for (let i = start; i >= end; i--) {
    numberArray.push(i.toString());
  }

  return numberArray;
};

export const difference = (start: string[], end: string[]) => {
  let longerArray;
  let shorterArray;
  let isDecreasingInLength = false;

  const startReversed = [...start].reverse();
  const endReversed = [...end].reverse();

  if (startReversed.length > endReversed.length) {
    longerArray = startReversed;
    shorterArray = endReversed;
    isDecreasingInLength = true;
  } else {
    longerArray = endReversed;
    shorterArray = startReversed;
  }

  const numberColumns = longerArray.reduce((acc, item, i) => {
    let arr: string[] = [];
    const comparison = shorterArray[i];

    if (item === comparison) {
      arr = [item];
    } else if (item <= comparison) {
      arr = countDown(comparison, item);
    } else if (item >= comparison) {
      arr = countUp(comparison, item);
    } else if (typeof comparison === "undefined" && !isDecreasingInLength) {
      arr = [item];
    }

    (acc as string[][]).push(arr);

    return acc;
  }, [] as string[][]);

  const numberDiff = numberColumns.reverse();

  if (isDecreasingInLength) {
    return numberDiff.map((col) => col.reverse());
  }

  return numberDiff;
};

export const determineDirection = (
  first: number,
  last: number,
): "inc" | "dec" | "none" => {
  if (first < last) {
    return "inc";
  } else if (first > last) {
    return "dec";
  }
  return "none";
};

export const percentages = (number: number, base: number) =>
  Math.round((number / base) * 100);

export function getVisible(
  items: FlattenedItem[],
  isOpenItem: Record<string, boolean>,
  alwaysIncludeId?: UniqueIdentifier | null,
): FlattenedItem[] {
  return items.filter((item) => {
    if (alwaysIncludeId && item.id === alwaysIncludeId) return true;
    if (!item.parentId) return true;
    let parentId: string | null = item.parentId;
    while (parentId) {
      if (!isOpenItem[parentId]) return false;
      const parent = items.find((fi) => fi.id === parentId);
      parentId = parent?.parentId ?? null;
    }
    return true;
  });
}

export function getCollapsedIds(
  items: FlattenedItem[],
  isOpenItem: Record<string, boolean>,
): Set<UniqueIdentifier> {
  return new Set(
    items
      .filter(
        (item) =>
          !isOpenItem[item.id] &&
          items.some((child) => child.parentId === item.id),
      )
      .map((item) => item.id),
  );
}
