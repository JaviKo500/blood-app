import { Dialogs } from '@ng-native/device';
import { Clipboard } from '@ng-native/expo/clipboard';
import { Haptics } from '@ng-native/expo/haptics';
import { NativeNavigation } from '@ng-native/router';
import { render, screen, userEvent } from '@ng-native/testing';
import { expect, test, vi } from 'vitest';
import { groupDni, UserScreen } from './user.screen.ts';
import { appConfig } from '../../app.config.ts';

function setup(agrees = false) {
  const confirm = vi.fn(async () => agrees);
  const navigation = { push: vi.fn(async () => true), back: vi.fn() };
  const pasteboard = { setStringAsync: vi.fn(async () => true), getStringAsync: async () => '', addClipboardListener: () => ({ remove() {} }) };
  const providers = [
    ...appConfig.providers,
    { provide: Dialogs, useValue: { confirm } },
    { provide: NativeNavigation, useValue: navigation },
    { provide: Clipboard.SOURCE, useValue: pasteboard },
    { provide: Haptics.SOURCE, useValue: null },
  ];
  return { confirm, navigation, pasteboard, providers };
}

test('reads the blood type and the cédula first', async () => {
  const { providers } = setup();
  await render(UserScreen, { providers });

  expect(screen.getByLabelText('Tipo de sangre A B negativo')).toBeTruthy();
  expect(screen.getByText('010 556 6038')).toBeTruthy();
});

test('copies the cédula as digits when it is pressed', async () => {
  const { pasteboard, providers } = setup();
  await render(UserScreen, { providers });

  await userEvent.setup().press(screen.getByRole('button', { name: /^Cédula/ }));

  expect(pasteboard.setStringAsync).toHaveBeenCalledWith('0105566038');
  expect(await screen.findByText('Copiada')).toBeTruthy();
});

test('opens the edit form', async () => {
  const { navigation, providers } = setup();
  await render(UserScreen, { providers });

  await userEvent.setup().press(screen.getByRole('button', { name: 'Editar persona' }));

  expect(navigation.push).toHaveBeenCalledWith(['/home/user', '3', 'edit']);
});

test('asks before deleting the person', async () => {
  const { confirm, navigation, providers } = setup(false);
  await render(UserScreen, { providers });

  await userEvent.setup().press(screen.getByRole('button', { name: 'Eliminar persona' }));

  expect(confirm).toHaveBeenCalledWith('¿Eliminar a Pablo Mesias?', expect.objectContaining({ destructive: true }));
  expect(navigation.back).not.toHaveBeenCalled();
});

test('groups a 10-digit cédula 3-3-4 and leaves anything else as typed', () => {
  expect(groupDni('0105566046')).toBe('010 556 6046');
  expect(groupDni('12345')).toBe('12345');
});
