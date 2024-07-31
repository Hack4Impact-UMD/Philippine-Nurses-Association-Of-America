export interface User {
  auth_id: string;
  name: string;
  type: "ADMIN" | "USER";
  email: string;
  chapterName: string;
}
