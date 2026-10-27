import { render, screen, userEvent } from '@ng-native/testing';
import { signal } from '@angular/core';
import { Accessibility } from '@ng-native/device';
import { expect, test, vi } from 'vitest';
import { PersonList, bloodTypeGlyph, spokenBloodType, spokenPerson } from './person-list.ts';
import type { PersonModel } from '../model/person.model.ts';

const persons: PersonModel[] = [
  { id: '1', bloodTypeCode: 'A+', name: 'Javiko', lastName: 'Gutierrez', dni: '0105566046' },
  { id: '2', bloodTypeCode: 'O-', name: 'Pablo Mesias', lastName: 'Gutierrez Urgiles', dni: '0105566038' },
];

test('draws a row per person with their blood type, name and dni', async () => {
  await render(PersonList, { inputs: { persons } });

  expect(screen.getAllByRole('button')).toHaveLength(2);
  const row = screen.getByRole('button', { name: /^Javiko Gutierrez, tipo de sangre A positivo/ });
  expect(row.props['accessibilityHint']).toBe('Abre la ficha');
  expect(screen.getByText('A+')).toBeTruthy();
  expect(screen.getByText('O\u2212')).toBeTruthy();
  expect(screen.getByText('0105566038')).toBeTruthy();
});

test('lets a long name wrap to two lines', async () => {
  await render(PersonList, { inputs: { persons } });

  const name = screen.getByText('Pablo Mesias Gutierrez Urgiles');
  expect(name.props['numberOfLines']).toBe(2);
  expect(name.props['ellipsizeMode']).toBe('tail');
});

test('stacks the row and lets the name wrap freely at accessibility text sizes', async () => {
  await render(PersonList, {
    inputs: { persons },
    providers: [{ provide: Accessibility, useValue: { fontScale: signal(2) } }],
  });

  const name = screen.getByText('Pablo Mesias Gutierrez Urgiles');
  expect(name.props['numberOfLines']).toBe(0);
  expect(screen.getByText('0105566038')).toBeTruthy();
});

test('emits the pressed person', async () => {
  const personSelected = vi.fn();
  await render(PersonList, { inputs: { persons }, on: { personSelected } });

  await userEvent.setup().press(screen.getByRole('button', { name: /^Pablo Mesias Gutierrez Urgiles, tipo de sangre O negativo/ }));

  expect(personSelected).toHaveBeenCalledTimes(1);
  expect(personSelected).toHaveBeenCalledWith(expect.objectContaining({ id: '2', name: 'Pablo Mesias' }));
});

test('shows the empty state when there are no persons', async () => {
  await render(PersonList, { inputs: { persons: [] } });

  expect(screen.queryAllByRole('button')).toHaveLength(0);
  expect(screen.getByText('No hay personas todavía')).toBeTruthy();
});

test('bloodTypeGlyph draws a negative type with a minus sign', () => {
  expect(bloodTypeGlyph('AB-')).toBe('AB\u2212');
  expect(bloodTypeGlyph('O+')).toBe('O+');
});

test('spokenPerson names the person, then the blood type and cédula in words a screen reader says clearly', () => {
  expect(spokenPerson(persons[1])).toBe(
    'Pablo Mesias Gutierrez Urgiles, tipo de sangre O negativo, cédula 0 1 0 5 5 6 6 0 3 8',
  );
  expect(spokenPerson({ ...persons[0], dni: ' ' })).toBe('Javiko Gutierrez, tipo de sangre A positivo');
});

test('spokenBloodType spells the group and names the sign', () => {
  expect(spokenBloodType('AB-')).toBe('A B negativo');
  expect(spokenBloodType('o+')).toBe('O positivo');
  expect(spokenBloodType('')).toBe('sin registrar');
  expect(spokenBloodType('desconocido')).toBe('desconocido');
});
