import { makeEnvironmentProviders, type EnvironmentProviders } from "@angular/core";
import { PersonRepository } from "../../person/data/person.repository";
import { SqlitePersonRepository } from "../../person/data/sqlite-person.repository";

export type DataSource = 'sqlite';

export function provideDataSource ( source: DataSource = 'sqlite'): EnvironmentProviders {
   switch (source) {
      case 'sqlite':
         return makeEnvironmentProviders([
            {
               provide: PersonRepository,
               useClass: SqlitePersonRepository,
            }
         ]);
   }
}