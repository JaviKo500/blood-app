import { NewPersonModel, PersonModel } from "../model/person.model";

export interface PersonRow{
   id: string;
   name: string;
   last_name: string;
   dni: string;
   blood_type_code: string;
   created_at: string;
   phone: string | null;
   email: string | null;
   updated_at: string | null;
}

export class PersonMapper {
   static toModel( person: PersonRow ): PersonModel {
      return {
         id: person.id,
         bloodTypeCode: person.blood_type_code,
         name: person.name,
         lastName: person.last_name,
         dni: person.dni,
         createdAt: person.created_at,
         email: person.email ?? undefined,
         phone: person.phone ?? undefined,
         updatedAt: person.updated_at ?? undefined,
      }
   }

   static toRow(person: Partial<NewPersonModel>): Partial<PersonRow> {
      const row: Partial<PersonRow> = {};
      if ( person.name !== undefined ) row.name = person.name;
      if ( person.lastName !== undefined ) row.last_name = person.lastName;
      if ( person.dni !== undefined ) row.dni = person.dni;
      if ( person.bloodTypeCode !== undefined ) row.blood_type_code = person.bloodTypeCode;
      if ( 'phone' in person ) row.phone = person.phone ?? null;
      if ( 'email' in person ) row.email = person.email ?? null;
      return row;
   }
}