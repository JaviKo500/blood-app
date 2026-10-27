export interface PersonModel {
   id: string;
   bloodTypeCode: string;
   name: string;
   lastName: string;
   dni: string;
   email?: string;
   phone?: string;
   createdAt?: string;
   updatedAt?: string;
}

export type NewPersonModel = Omit<PersonModel, 'id' | 'createdAt' | 'updatedAt'>;

export interface BloodType {
   code: string;
   createdAt?: string;
}