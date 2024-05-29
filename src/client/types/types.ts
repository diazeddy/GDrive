export interface IUser {
    _id: string;
    username: string;
}
  
export interface IFile {
    _id: string;
    name: string;
    owner: IUser;
    path: string;
    size: number;
    type: string;
    sharedWith: IUser[];
}
  