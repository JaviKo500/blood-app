import { computed, inject, Injectable, signal } from "@angular/core";

import { PersonRepository } from "./person.repository";
import { NewPersonModel, PersonModel } from "../model/person.model";

@Injectable( { providedIn: 'root' } )
export class PersonStore {
   private readonly repository = inject( PersonRepository );

   private readonly _persons = signal<PersonModel[]>([]);
   private readonly _loading = signal<boolean>(false);
   private readonly _error = signal<string | null>(null);

   readonly persons = this._persons.asReadonly();
   readonly loading = this._loading.asReadonly();
   readonly error = this._error.asReadonly();
   readonly empty = computed( () => !this._loading() && this._persons().length === 0 );

   async load(): Promise<void> {
      this._loading.set(true);
      this._error.set(null);

      try {
         this._persons.set( sortByName( await this.repository.list() ) );
      } catch (error) {
         this._error.set('No se pudieron cargar las personas');
         console.error('PersonStore.load', error)
      } finally {
         this._loading.set(false);
      }
   }

   async get( id: string ): Promise<PersonModel | null> {
      return this._persons().find( p => p.id === id ) ?? await this.repository.get(id);
   }

   async create ( input: NewPersonModel ): Promise<PersonModel> {
      const person = await this.repository.create( input );
      this._persons.update( persons => sortByName( [ ...persons, person ] ) );
      return person;
   }

   async update ( id: string, changes: Partial<NewPersonModel> ): Promise<PersonModel>  {
      const updated = await this.repository.update( id, changes );
      this._persons.update( persons => 
         sortByName( persons.map( p => p.id === id ? updated : p ) )
      );
      return updated;
   }

   async remove ( id: string ): Promise<void>  {
      await this.repository.remove( id );
      this._persons.update( persons => persons.filter( p => p.id !== id ) );
   }
}

export const sortByName = (persons: PersonModel[]) => {
    return [ ...persons ].sort( ( a, b ) => a.name.localeCompare( b.name ) );
}