export interface IUser {
  _id?: string;
  email: string;
  fullName: string;
  password: string;
  profilePicture?: string;
  about?: string;
  online?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
