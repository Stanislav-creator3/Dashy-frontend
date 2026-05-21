export interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  day: number;
  time: string;
  isDone: boolean;
  type: string;
  attendees: Attendee[];
}

export interface Attendee {
  id: string;
  name: string;
  avatar: string;
}

export interface FormattedDay {
  dayName: string;
  day: string;
  fullDate: Date;
  dayIndex: number;
}
