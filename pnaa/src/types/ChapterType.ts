export interface Chapter {
  name: string;
  region: string;
  totalActive: number;
  totalLapsed: number;
  members?: {
    activeStatus: "LAPSED" | "ACTIVE";
    chapterName: string;
    email: string;
    highestEducation: string;
    memberId: number;
    membershipLevel: string;
    name: string;
    renewalDueDate: string;
  }[];
}
