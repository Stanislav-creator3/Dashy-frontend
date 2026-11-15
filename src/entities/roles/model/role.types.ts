export enum PROJECT_ROLE_TYPE {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  VIEWER = "VIEWER",
  CUSTOM = "CUSTOM",
}

export interface IRole {
  id: string;
  name: string;
  type: PROJECT_ROLE_TYPE;
}

export interface IRoleBody {
  name: string;
}
