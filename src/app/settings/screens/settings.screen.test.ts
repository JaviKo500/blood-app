import { Dialogs } from '@ng-native/device';
import { Storage } from '@ng-native/expo/async-storage';
import { Store } from '@ng-native/expo/store';
import { render, screen, userEvent } from '@ng-native/testing';
import { expect, test, vi } from 'vitest';
import { SettingsScreen } from './settings.screen.ts';
import { appConfig } from '../../app.config.ts';

function setup(stored: Record<string, string> = {}, agrees = false) {
  const disk = new Map(Object.entries(stored));
  const storage = new Store({
    get: async (key) => disk.get(key) ?? null,
    set: async (key, value) => void disk.set(key, value),
    remove: async (key) => void disk.delete(key),
  });
  const confirm = vi.fn(async () => agrees);
  const providers = [
    ...appConfig.providers,
    { provide: Storage, useValue: storage },
    { provide: Dialogs, useValue: { confirm } },
  ];
  return { disk, storage, confirm, providers };
}

test('marks the saved theme as chosen', async () => {
  const { providers } = setup({ theme: JSON.stringify('dark') });
  await render(SettingsScreen, { providers });

  expect(await screen.findByRole('radio', { name: 'Oscuro', checked: true })).toBeTruthy();
  expect(screen.getByRole('radio', { name: 'Sistema', checked: false })).toBeTruthy();
});

test('saves the theme the user picks', async () => {
  const { disk, storage, providers } = setup();
  await render(SettingsScreen, { providers });

  await userEvent.setup().press(screen.getByRole('radio', { name: 'Claro' }));
  await storage.flush();

  expect(disk.get('theme')).toBe(JSON.stringify('light'));
  expect(screen.getByRole('radio', { name: 'Claro', checked: true })).toBeTruthy();
});

test('asks before deleting everything', async () => {
  const { confirm, providers } = setup();
  await render(SettingsScreen, { providers });

  await userEvent.setup().press(screen.getByRole('button', { name: 'Borrar todos los datos' }));

  expect(confirm).toHaveBeenCalledWith('¿Borrar todos los datos?', expect.objectContaining({ destructive: true }));
});
