import { injectService } from '@ng-native/testing';
import { expect, test, vi } from 'vitest';
import type { NewPersonModel, PersonModel } from '../model/person.model.ts';
import { PersonRepository } from './person.repository.ts';
import { PersonStore } from './person.store.ts';

/** A repository that keeps its rows in memory, so the store is tested without SQLite. */
class FakePersonRepository extends PersonRepository {
  private readonly rows = new Map<string, PersonModel>();
  private ids = 0;

  constructor(persons: PersonModel[] = []) {
    super();
    persons.forEach((person) => this.rows.set(person.id, person));
  }

  async list(): Promise<PersonModel[]> {
    return [...this.rows.values()];
  }

  async get(id: string): Promise<PersonModel | null> {
    return this.rows.get(id) ?? null;
  }

  async create(input: NewPersonModel): Promise<PersonModel> {
    const person = { ...input, id: `person-${++this.ids}` };
    this.rows.set(person.id, person);
    return person;
  }

  async update(id: string, changes: Partial<NewPersonModel>): Promise<PersonModel> {
    const person = this.rows.get(id);
    if (!person) throw new Error('No se encontró esa persona');
    const updated = { ...person, ...changes };
    this.rows.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    this.rows.delete(id);
  }
}

const person = (id: string, name: string): PersonModel => ({
  id,
  name,
  lastName: 'Pérez',
  dni: id,
  bloodTypeCode: 'A+',
});

const newPerson = (name: string): NewPersonModel => ({
  name,
  lastName: 'Gómez',
  dni: name,
  bloodTypeCode: 'O-',
});

function storeWith(repository: PersonRepository): PersonStore {
  return injectService(PersonStore, {
    providers: [{ provide: PersonRepository, useValue: repository }],
  });
}

const names = (store: PersonStore) => store.persons().map((p) => p.name);

test('loads the persons sorted by name, the Spanish way', async () => {
  const store = storeWith(
    new FakePersonRepository([person('1', 'Zoe'), person('2', 'ana'), person('3', 'Álvaro'), person('4', 'Beto')]),
  );

  await store.load();

  expect(names(store)).toEqual(['Álvaro', 'ana', 'Beto', 'Zoe']);
  expect(store.error()).toBeNull();
  expect(store.empty()).toBe(false);
});

test('is loading while the repository answers', async () => {
  let answer!: (persons: PersonModel[]) => void;
  const repository = new FakePersonRepository();
  vi.spyOn(repository, 'list').mockReturnValue(new Promise((resolve) => (answer = resolve)));
  const store = storeWith(repository);

  const loading = store.load();
  expect(store.loading()).toBe(true);
  expect(store.empty()).toBe(false);

  answer([person('1', 'Ana')]);
  await loading;
  expect(store.loading()).toBe(false);
  expect(names(store)).toEqual(['Ana']);
});

test('is empty once loaded with no persons', async () => {
  const store = storeWith(new FakePersonRepository());

  await store.load();

  expect(store.empty()).toBe(true);
});

test('shows an error when the persons cannot be loaded', async () => {
  // The store logs the cause; keep it out of the test output.
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  const repository = new FakePersonRepository();
  vi.spyOn(repository, 'list').mockRejectedValue(new Error('disk I/O error'));
  const store = storeWith(repository);

  await store.load();

  expect(store.error()).toBe('No se pudieron cargar las personas');
  expect(store.persons()).toEqual([]);
  expect(store.loading()).toBe(false);
});

test('clears a previous error when it loads again', async () => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  const repository = new FakePersonRepository([person('1', 'Ana')]);
  vi.spyOn(repository, 'list').mockRejectedValueOnce(new Error('disk I/O error'));
  const store = storeWith(repository);

  await store.load();
  await store.load();

  expect(store.error()).toBeNull();
  expect(names(store)).toEqual(['Ana']);
});

test('adds a created person in its alphabetical place', async () => {
  const store = storeWith(new FakePersonRepository([person('1', 'Ana'), person('2', 'Carla')]));
  await store.load();

  const created = await store.create(newPerson('Beto'));

  expect(created.id).toBe('person-1');
  expect(names(store)).toEqual(['Ana', 'Beto', 'Carla']);
});

test('leaves the list as it was when the repository rejects a create', async () => {
  const repository = new FakePersonRepository([person('1', 'Ana')]);
  vi.spyOn(repository, 'create').mockRejectedValue(new Error('UNIQUE constraint failed: person.dni'));
  const store = storeWith(repository);
  await store.load();

  await expect(store.create(newPerson('Beto'))).rejects.toThrow(/UNIQUE/);
  expect(names(store)).toEqual(['Ana']);
});

test('replaces an updated person and sorts again when the name changes', async () => {
  const store = storeWith(new FakePersonRepository([person('1', 'Ana'), person('2', 'Beto')]));
  await store.load();

  const updated = await store.update('1', { name: 'Carla', phone: '0991234567' });

  expect(updated).toMatchObject({ id: '1', name: 'Carla', phone: '0991234567' });
  expect(names(store)).toEqual(['Beto', 'Carla']);
  expect(store.persons()[1]).toEqual(updated);
});

test('leaves the list as it was when the repository rejects an update', async () => {
  const store = storeWith(new FakePersonRepository([person('1', 'Ana')]));
  await store.load();

  await expect(store.update('missing', { name: 'Nadie' })).rejects.toThrow('No se encontró esa persona');
  expect(names(store)).toEqual(['Ana']);
});

test('takes a removed person out of the list', async () => {
  const store = storeWith(new FakePersonRepository([person('1', 'Ana'), person('2', 'Beto')]));
  await store.load();

  await store.remove('1');

  expect(names(store)).toEqual(['Beto']);
});

test('gets a loaded person from memory, without asking the repository', async () => {
  const repository = new FakePersonRepository([person('1', 'Ana')]);
  const store = storeWith(repository);
  await store.load();
  const get = vi.spyOn(repository, 'get');

  expect(await store.get('1')).toMatchObject({ name: 'Ana' });
  expect(get).not.toHaveBeenCalled();
});

test('asks the repository for a person that is not loaded', async () => {
  const repository = new FakePersonRepository([person('1', 'Ana')]);
  const store = storeWith(repository);

  expect(await store.get('1')).toMatchObject({ name: 'Ana' });
  expect(await store.get('missing')).toBeNull();
});
