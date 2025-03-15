export interface Person {
  id: string;
  name: string;
  dob: string;
  email: string;
  verified: boolean;
  salary: number;
}

export interface PeopleData {
  ctRoot: Person[];
}
