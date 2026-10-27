import { render, screen, userEvent } from '@ng-native/testing';
import { expect, test, vi } from 'vitest';
import { UserList, initials } from './user-list.ts';
import type { UserModel } from '../model/user.model.ts';

const users: UserModel[] = [
  { id: 1, typeBlood: 'A+', name: 'Javiko', lastName: 'Gutierrez', dni: '0105566046' },
  { id: 2, typeBlood: 'O-', name: 'Pablo Mesias', lastName: 'Gutierrez Urgiles', dni: '0105566038' },
];

test('draws a row per user with their initials, blood type and dni', async () => {
  await render(UserList, { inputs: { users } });

  expect(screen.getAllByRole('button')).toHaveLength(2);
  expect(screen.getByRole('button', { name: 'Javiko Gutierrez A+' })).toBeTruthy();
  expect(screen.getByText('JG')).toBeTruthy();
  expect(screen.getByText('PG')).toBeTruthy();
  expect(screen.getByText('O-')).toBeTruthy();
  expect(screen.getByText('0105566038')).toBeTruthy();
});

test('keeps a long name on one line', async () => {
  await render(UserList, { inputs: { users } });

  const name = screen.getByText('Pablo Mesias Gutierrez Urgiles');
  expect(name.props['numberOfLines']).toBe(1);
  expect(name.props['ellipsizeMode']).toBe('tail');
});

test('emits the pressed user', async () => {
  const userSelected = vi.fn();
  await render(UserList, { inputs: { users }, on: { userSelected } });

  await userEvent.setup().press(screen.getByRole('button', { name: 'Pablo Mesias Gutierrez Urgiles O-' }));

  expect(userSelected).toHaveBeenCalledTimes(1);
  expect(userSelected).toHaveBeenCalledWith(expect.objectContaining({ id: 2, name: 'Pablo Mesias' }));
});

test('shows the empty state when there are no users', async () => {
  await render(UserList, { inputs: { users: [] } });

  expect(screen.queryAllByRole('button')).toHaveLength(0);
  expect(screen.getByText('No hay usuarios todavía')).toBeTruthy();
});

test('initials takes the first letter of each word, upper-cased', () => {
  expect(initials(['javiko', 'gutierrez'])).toBe('JG');
  expect(initials(['', 'Gutierrez'])).toBe('G');
  expect(initials([])).toBe('');
});
