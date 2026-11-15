import { IRole } from "@/entities/roles/model/role.types";

export interface IProjectMember {
  id: string;
  userId: string;
  projectId: string;
  roleId: string;
  user: {
    id: string;
    email: string;
    username: string | null;
    avatar?: string;
  };
  role: IRole;
}

export interface IAddMember {
  email: string;
  roleId: string;
}

export interface IProject {
  id: string;
  name: string;
  icon?: string;
  previewImage: string | null;
  members: IProjectMember[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ICreateProject {
  name: string;
  image: File;
}
