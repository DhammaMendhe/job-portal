export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "jobseeker" | "employer";
}

export interface IJob {
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  type: "full-time" | "part-time" | "remot" | "contract";
  postedBy: string;
}
