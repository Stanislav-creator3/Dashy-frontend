"use client";

import { Button } from "@/shared/ui";
import Card from "../../../shared/ui/card/Card";
import { cn, formatDate, getDatesFromCurrentWeek } from "@/shared/utils/utils";
import style from "./styles.module.css";
import { useState } from "react";
import { CalendarEvent } from "../model/calendar.interface";
import { FaArrowRight } from "react-icons/fa";
import CardTimeEvent from "@/shared/ui/cardTimeEvent/CardTimeEvent";
import { getIcon } from "@/shared/utils/getIcon";

const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const timeSlots = [
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Weekly Team Sync",
    description: "Discuss progress on projects",
    day: 3,
    time: "8:00",
    isDone: true,
    type: "TeamMeeting",
    attendees: [
      { id: "13", name: "John", avatar: "/defaultAvatar.png" },
      { id: "12", name: "Sarah", avatar: "/defaultAvatar.png" },
      { id: "14", name: "Mike", avatar: "/defaultAvatar.png" },
    ],
  },
  {
    id: 2,
    title: "Onboarding Session",
    description: "Introduction for new hires",
    day: 4,
    time: "10:00",
    isDone: false,
    type: "TeamMeeting",
    attendees: [
      { id: "15", name: "Emma", avatar: "/defaultAvatar.png" },
      { id: "16", name: "David", avatar: "/defaultAvatar.png" },
    ],
  },
  {
    id: 3,
    title: "Product Review",
    description: "Review new features",
    day: 2,
    time: "14:00",
    isDone: false,
    type: "TeamMeeting",
    attendees: [
      { id: "14", name: "Alex", avatar: "/defaultAvatar.png" },
      { id: "15", name: "Maria", avatar: "/defaultAvatar.png" },
    ],
  },
  {
    id: 4,
    title: "Client Meeting",
    description: "Discuss project requirements",
    day: 5,
    time: "16:00",
    isDone: false,
    type: "TeamMeeting",
    attendees: [
      { id: "17", name: "Tom", avatar: "/defaultAvatar.png" },
      { id: "16", name: "Lisa", avatar: "/defaultAvatar.png" },
      { id: "15", name: "Chris", avatar: "/defaultAvatar.png" },
    ],
  },
];

export default function Calendar({ className }: { className?: string }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Вычисляем дату для текущей недели с учетом смещения
  const weekDate = new Date(currentDate);
  weekDate.setDate(currentDate.getDate() + currentWeekOffset * 7);
  const currentMonth = months[weekDate.getMonth()];
  const currentYear = weekDate.getFullYear();

  const prevMonth = months[(weekDate.getMonth() - 1 + 12) % 12];
  const nextMonth = months[(weekDate.getMonth() + 1) % 12];

  const weekDays = getDatesFromCurrentWeek(weekDate);
  const formattedDays = formatDate(weekDays);

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    setCurrentWeekOffset(0); // Сбрасываем смещение недели при смене месяца
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setCurrentWeekOffset(0); // Сбрасываем смещение недели при смене месяца
  };

  const handlePrevWeek = () => {
    setCurrentWeekOffset(currentWeekOffset - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeekOffset(currentWeekOffset + 1);
  };

  const handleCurrentWeek = () => {
    setCurrentDate(new Date());
    setCurrentWeekOffset(0);
  };

  const getEventsForDayAndTime = (dayIndex: number, timeSlot: string) => {
    return mockEvents.filter((event) => {
      const eventTime = event.time;
      // События для разных дней недели
      const eventDayMap = { 2: 1, 3: 2, 4: 3, 5: 4 }; // день недели -> индекс
      const eventDay = eventDayMap[event.day as keyof typeof eventDayMap];
      return eventDay === dayIndex && eventTime === timeSlot;
    });
  };

  // Форматируем диапазон дат для отображения
  const getWeekRange = () => {
    const startDate = formattedDays[0];
    const endDate = formattedDays[6];

    if (startDate.fullDate.getMonth() === endDate.fullDate.getMonth()) {
      return `${startDate.day} - ${endDate.day} ${
        months[startDate.fullDate.getMonth()]
      }`;
    } else {
      return `${startDate.day} ${months[startDate.fullDate.getMonth()]} - ${
        endDate.day
      } ${months[endDate.fullDate.getMonth()]}`;
    }
  };

  return (
    <Card className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <Button
          className="min-w-25"
          variant="rounded"
          onClick={handlePrevMonth}
        >
          {prevMonth}
        </Button>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            {currentMonth} {currentYear}
          </h2>
          <div className="flex items-center gap-3 justify-between">
            <Button variant="rounded" onClick={handlePrevWeek}>
              <FaArrowRight className="rotate-180" />
            </Button>
            <Button
              onClick={handleCurrentWeek}
              className={cn("text-sm mt-1 max-w-38", style.weekRange)}
            >
              {getWeekRange()}
            </Button>
            <Button variant="rounded" onClick={handleNextWeek}>
              <FaArrowRight />
            </Button>
          </div>
        </div>

        <Button
          className="max-w-30"
          variant="rounded"
          onClick={handleNextMonth}
        >
          {nextMonth}
        </Button>
      </div>

      <div className="grid grid-cols-8 gap-0 mb-2">
        <div className="min-w-20"></div>
        {formattedDays.map((day, index) => (
          <div
            key={index}
            className={cn(
              "text-center",
              day.fullDate.toISOString().slice(0, 10) ===
                currentDate.toISOString().slice(0, 10)
                ? "text-black font-bold"
                : "opacity-50"
            )}
          >
            <div className="text-lg">{day.dayName}</div>
            <div className="text-sm">{day.day}</div>
          </div>
        ))}
      </div>
      {/* Calendar Grid */}
      <div className="relative h-[15vh] overflow-scroll ">
        {/* Day Headers */}

        {/* Time Slots and Events */}
        <div className="grid grid-cols-8 gap-0 ">
          {/* Time Column */}
          <div className={cn("space-y-2 min-w-20")}>
            {timeSlots.map((time, timeIndex) => (
              <div
                key={timeIndex}
                className="h-12.5 flex items-center text-lg text-gray-500"
              >
                {time}
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {formattedDays.map((day) => (
            <div key={day.dayIndex} className={cn("relative z-1")}>
              {/* Vertical dotted lines */}
              <div
                className={
                  "absolute top-0 left-1/2 translate-x-1/2 w-.5 h-full border-l-1 border-black opacity-35 border-dashed -z-1"
                }
              ></div>

              {/* Time slots */}
              <div className="space-y-2">
                {timeSlots.map((timeSlot, timeIndex) => {
                  const events = getEventsForDayAndTime(day.dayIndex, timeSlot);
                  return (
                    <div
                      key={timeIndex}
                      className={cn(
                        "h-12.5 relative flex items-center justify-center"
                      )}
                    >
                      {events.map((event) => (
                        <div key={event.id} className="absolute">
                          <CardTimeEvent
                            id={event.id}
                            title={event.title}
                            isDone={event.isDone}
                            description={event.description}
                            attendees={event.attendees}
                            Icon={getIcon(event.type)}
                          />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
