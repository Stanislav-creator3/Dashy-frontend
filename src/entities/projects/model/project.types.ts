export interface IProject {
  id: string;
  name: string;
  icon?: string;
  previewImage: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ICreateProject {
  name: string;
  image: File;
}
