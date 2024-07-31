export interface Event {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  status: "NATIONAL" | "CHAPTER" | "NON-CHAPTER";
  chapter: string;
  region: string;
  about: string;
  eventPoster: { name: string; ref: string; downloadURL: string };
  attendees: number;
  volunteers: number;
  participantsServed: number;
  contactHours: number;
  volunteerHours: number;
  otherDetails: string;
  archived: boolean;
}
