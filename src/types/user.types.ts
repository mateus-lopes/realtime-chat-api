export interface IUser {
  _id?: string;
  email: string;
  fullName: string;
  password: string;
  profilePicture?: string;
  online?: boolean;
  about?: string;
  lastSeen?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
