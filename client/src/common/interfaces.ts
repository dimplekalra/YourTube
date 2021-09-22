export interface IAcceptAll {
  [x: string]: any;
}
// //
export interface IApiCallStatus {
  InProgress: boolean;
  Failed: boolean;
  FailMessage: string;
}

export interface ICredentials {
  t: string;
}

export interface IUser {
  createdAt: string;
  email: string;
  name: string;
  updatedAt: string;
  _id: string;
}

export interface IJWT {
  token: string;
  user: IUser;
}

export interface IMedia {
  createdAt: string;
  description: string;
  genre: string;
  postedBy: {
    _id: string;
    name: string;
  };
  title: string;
  updatedAt: string;
  views: number;
  _id: string;
}

export type TParams = { userId: string; mediaId: string };

export type API = "user" | "media";
