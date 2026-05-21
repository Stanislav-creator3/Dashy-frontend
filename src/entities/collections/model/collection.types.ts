export interface ICollection {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  iconColor?: string;
  documents: {
    id: string;
    title: string;
    description?: string;
    icon?: string;
    position: number;
    blocks: any[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCollection {
  projectId: string;
  title: string;
  description?: string;
  icon?: string;
  iconColor?: string;
}


export interface IUpdateCollection {
  title?: string;
  description?: string;
  icon?: string;
  iconColor?: string;
}