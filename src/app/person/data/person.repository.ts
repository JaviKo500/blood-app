import { PersonModel } from "../model/person.model";

export abstract class PersonRepository {
   abstract list(): Promise<PersonModel[]>;
   abstract get(id: string): Promise<PersonModel>;
   abstract create(input: PersonModel): Promise<PersonModel>;
   abstract update(id: string, change: Partial<PersonModel>): Promise<PersonModel>;
   abstract remove(id: string): Promise<void>;
}