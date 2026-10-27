import { inject, Injectable } from '@angular/core';
import { Crypto } from '@ng-native/expo/crypto';

import { bloodDatabase } from "../../core/data/app.database";
import { PersonModel, NewPersonModel } from "../model/person.model";
import { PersonMapper, PersonRow } from "./person.mapper";
import { PersonRepository } from "./person.repository";

@Injectable()
export class SqlitePersonRepository extends PersonRepository {
    private readonly crypto = inject(Crypto);

   async list(): Promise<PersonModel[]> {
      const db = await bloodDatabase.ready();
      const data = await db.getAllAsync<PersonRow>(
         'SELECT * FROM person ORDER BY name'
      );
      return data.map( d => PersonMapper.toModel(d) );
   }

   async get(id: string): Promise<PersonModel | null> {
      const db = await bloodDatabase.ready();
      const data = await db.getFirstAsync<PersonRow>(
         'SELECT * FROM person WHERE id = ?', id
      );
      return data ? PersonMapper.toModel(data) : null;
   }

   async create(input: NewPersonModel): Promise<PersonModel> {
      const db = await bloodDatabase.ready();
      const person = PersonMapper.toRow(input);
      person.id = this.crypto.randomUUID();
      await db.runAsync(
         `INSERT INTO person (
            id,
            name,
            last_name,
            dni,
            phone,
            email,
            blood_type_code
         ) VALUES (?,?,?,?,?,?,?)`,
         person.id!,
         person.name!,
         person.last_name!,
         person.dni!,
         person.phone ?? null,
         person.email ?? null,
         person.blood_type_code!,
      );
      const newPerson = await this.get( person.id );
      if ( !newPerson ) {
         throw new Error('No se creo esa persona');
      }
      return newPerson;
   }

   async update(id: string, changes: Partial<NewPersonModel>): Promise<PersonModel> {
      const db = await bloodDatabase.ready();
      const row = { ...PersonMapper.toRow(changes), updated_at: new Date().toISOString() };
      const columns = Object.keys(row);

      await db.runAsync(
         `UPDATE person SET 
            ${ columns.map( c => c + ' =?').join(',') }
         WHERE id = ?
         `,
          ...Object.values(row), id,
      )
      
      const updated = await this.get(id);
      if (!updated) throw new Error('No se encontró esa persona');
      return updated;
   }

   async remove(id: string): Promise<void> {
      const db = await bloodDatabase.ready();
      await db.runAsync( `DELETE FROM person WHERE id = ?`, id );
   }
}