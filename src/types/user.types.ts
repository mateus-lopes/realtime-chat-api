export interface IUser {
  _id?: string;
  email: string;
  fullName: string;
  password: string;
  profilePicture?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
