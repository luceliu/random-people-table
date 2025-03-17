export interface Person {
  id: string;
  name: string;
  dob: string;
  email: string;
  verified: boolean;
  salary: number;
  address?: {
    street: string;
    town: string;
    postode: string;
  };
  telephone?: string;
  pets?: string[];
  score?: number;
  url?: string;
  description?: string;
}

export interface PeopleData {
  ctRoot: Person[];
}
