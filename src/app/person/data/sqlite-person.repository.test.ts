import { openDatabasesWith } from '@ng-native/expo/database';
import { Crypto } from '@ng-native/expo/crypto';
import { injectService, memoryDatabase } from '@ng-native/testing';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { bloodDatabase } from '../../core/data/app.database.ts';
import type { NewPersonModel } from '../model/person.model.ts';
import { PersonRepository } from './person.repository.ts';
import { SqlitePersonRepository } from './sqlite-person.repository.ts';

const ana: NewPersonModel = {
  name: 'Ana',
  lastName: 'Pérez',
  dni: '0105566046',
  bloodTypeCode: 'A+',
  email: 'ana@example.com',
  phone: '0991234567',
};

let restore: () => void;
let ids = 0;

// Every test gets a fresh in-memory SQLite: the real migration and SQL run, with no rows left over.
beforeEach(() => (restore = openDatabasesWith(() => memoryDatabase())));
afterEach(async () => {
  // The database is a value of the module, so its connection outlives the test unless closed.
  await bloodDatabase.close();
  restore();
});

function repository(): PersonRepository {
  return injectService(PersonRepository, {
    providers: [
      { provide: PersonRepository, useClass: SqlitePersonRepository },
      { provide: Crypto.SOURCE, useValue: { randomUUID: () => `person-${++ids}` } },
    ],
  });
}

test('creates a person with a generated id and creation date', async () => {
  const person = await repository().create(ana);

  expect(person).toMatchObject(ana);
  expect(person.id).toMatch(/^person-\d+$/);
  expect(person.createdAt).toBeTruthy();
  expect(person.updatedAt).toBeUndefined();
});

test('creates a person without email or phone', async () => {
  const person = await repository().create({ name: 'Beto', lastName: 'Gómez', dni: '0105566038', bloodTypeCode: 'O-' });

  expect(person.email).toBeUndefined();
  expect(person.phone).toBeUndefined();
});

test('gets a person by id, or null when there is none', async () => {
  const persons = repository();
  const person = await persons.create(ana);

  expect(await persons.get(person.id)).toEqual(person);
  expect(await persons.get('missing')).toBeNull();
});

test('lists every person ordered by name', async () => {
  const persons = repository();
  await persons.create({ ...ana, name: 'Carla', dni: '1' });
  await persons.create({ ...ana, name: 'Ana', dni: '2' });
  await persons.create({ ...ana, name: 'Beto', dni: '3' });

  expect((await persons.list()).map((person) => person.name)).toEqual(['Ana', 'Beto', 'Carla']);
});

test('updates only the columns it is given and stamps the update date', async () => {
  const persons = repository();
  const person = await persons.create(ana);

  const updated = await persons.update(person.id, { name: 'Ana María' });

  expect(updated).toMatchObject({ ...ana, name: 'Ana María' });
  expect(updated.createdAt).toBe(person.createdAt);
  expect(updated.updatedAt).toBeTruthy();
});

test('clears an optional field when it is passed as undefined', async () => {
  const persons = repository();
  const person = await persons.create(ana);

  const updated = await persons.update(person.id, { email: undefined });

  expect(updated.email).toBeUndefined();
  expect(updated.phone).toBe(ana.phone);
});

test('updates only the person with that id', async () => {
  const persons = repository();
  const first = await persons.create(ana);
  const second = await persons.create({ ...ana, name: 'Beto', dni: '0105566038' });

  await persons.update(first.id, { lastName: 'Ortiz' });

  expect((await persons.get(second.id))?.lastName).toBe('Pérez');
});

test('fails to update a person that does not exist', async () => {
  await expect(repository().update('missing', { name: 'Nadie' })).rejects.toThrow('No se encontró esa persona');
});

test('removes a person', async () => {
  const persons = repository();
  const person = await persons.create(ana);

  await persons.remove(person.id);

  expect(await persons.get(person.id)).toBeNull();
  expect(await persons.list()).toEqual([]);
});

test('rejects a blood type outside the catalog', async () => {
  await expect(repository().create({ ...ana, bloodTypeCode: 'X+' })).rejects.toThrow(/FOREIGN KEY/);
});

test('rejects a repeated dni', async () => {
  const persons = repository();
  await persons.create(ana);

  await expect(persons.create({ ...ana, name: 'Otra' })).rejects.toThrow(/UNIQUE/);
});
