import { render, screen, userEvent } from '@ng-native/testing';
import { signal } from '@angular/core';
import { Accessibility } from '@ng-native/device';
import { expect, test, vi } from 'vitest';
import { UserList, bloodTypeGlyph, spokenBloodType, spokenUser } from './user-list.ts';
import type { UserModel } from '../model/user.model.ts';

const users: UserModel[] = [
  { id: 1, typeBlood: 'A+', name: 'Javiko', lastName: 'Gutierrez', dni: '0105566046' },
  { id: 2, typeBlood: 'O-', name: 'Pablo Mesias', lastName: 'Gutierrez Urgiles', dni: '0105566038' },
];

test('draws a row per user with their blood type, name and dni', async () => {
  await render(UserList, { inputs: { users } });

  expect(screen.getAllByRole('button')).toHaveLength(2);
  const row = screen.getByRole('button', { name: /^Javiko Gutierrez, tipo de sangre A positivo/ });
  expect(row.props['accessibilityHint']).toBe('Abre la ficha');
  expect(screen.getByText('A+')).toBeTruthy();
  expect(screen.getByText('O\u2212')).toBeTruthy();
  expect(screen.getByText('0105566038')).toBeTruthy();
});

test('lets a long name wrap to two lines', async () => {
  await render(UserList, { inputs: { users } });

  const name = screen.getByText('Pablo Mesias Gutierrez Urgiles');
  expect(name.props['numberOfLines']).toBe(2);
  expect(name.props['ellipsizeMode']).toBe('tail');
});

test('stacks the row and lets the name wrap freely at accessibility text sizes', async () => {
  await render(UserList, {
    inputs: { users },
    providers: [{ provide: Accessibility, useValue: { fontScale: signal(2) } }],
  });

  const name = screen.getByText('Pablo Mesias Gutierrez Urgiles');
  expect(name.props['numberOfLines']).toBe(0);
  expect(screen.getByText('0105566038')).toBeTruthy();
});

test('emits the pressed user', async () => {
  const userSelected = vi.fn();
  await render(UserList, { inputs: { users }, on: { userSelected } });

  await userEvent.setup().press(screen.getByRole('button', { name: /^Pablo Mesias Gutierrez Urgiles, tipo de sangre O negativo/ }));

  expect(userSelected).toHaveBeenCalledTimes(1);
  expect(userSelected).toHaveBeenCalledWith(expect.objectContaining({ id: 2, name: 'Pablo Mesias' }));
});

test('shows the empty state when there are no users', async () => {
  await render(UserList, { inputs: { users: [] } });

  expect(screen.queryAllByRole('button')).toHaveLength(0);
  expect(screen.getByText('No hay usuarios todavía')).toBeTruthy();
});

test('bloodTypeGlyph draws a negative type with a minus sign', () => {
  expect(bloodTypeGlyph('AB-')).toBe('AB\u2212');
  expect(bloodTypeGlyph('O+')).toBe('O+');
});

test('spokenUser names the person, then the blood type and cédula in words a screen reader says clearly', () => {
  expect(spokenUser(users[1])).toBe(
    'Pablo Mesias Gutierrez Urgiles, tipo de sangre O negativo, cédula 0 1 0 5 5 6 6 0 3 8',
  );
  expect(spokenUser({ ...users[0], dni: ' ' })).toBe('Javiko Gutierrez, tipo de sangre A positivo');
});

test('spokenBloodType spells the group and names the sign', () => {
  expect(spokenBloodType('AB-')).toBe('A B negativo');
  expect(spokenBloodType('o+')).toBe('O positivo');
  expect(spokenBloodType('')).toBe('sin registrar');
  expect(spokenBloodType('desconocido')).toBe('desconocido');
});
