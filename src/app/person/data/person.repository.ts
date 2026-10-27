import { NewPersonModel, PersonModel } from "../model/person.model";

export abstract class PersonRepository {
   abstract list(): Promise<PersonModel[]>;
   abstract get(id: string): Promise<PersonModel | null>;
   abstract create(input: NewPersonModel): Promise<PersonModel>;
   abstract update(id: string, changes: Partial<NewPersonModel>): Promise<PersonModel>;
   abstract remove(id: string): Promise<void>;
}