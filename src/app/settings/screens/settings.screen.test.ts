import { Dialogs } from '@ng-native/device';
import { Storage } from '@ng-native/expo/async-storage';
import { Store } from '@ng-native/expo/store';
import { render, screen, userEvent, type FakeFabricNode } from '@ng-native/testing';
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

/** The native segmented picker: off a device it commits as a plain view carrying its props. */
function picker(nodes: readonly FakeFabricNode[]): FakeFabricNode | undefined {
  for (const node of nodes) {
    if (node.props['label'] === 'Tema') return node;
    const found = picker(node.children);
    if (found) return found;
  }
  return undefined;
}

test('shows the system theme until one is chosen', async () => {
  const { providers } = setup();
  const { fabric } = await render(SettingsScreen, { providers });

  expect(picker(fabric.committed)?.props['selection']).toBe('system');
});

test('marks the saved theme as chosen', async () => {
  const { providers } = setup({ theme: JSON.stringify('dark') });
  const result = await render(SettingsScreen, { providers });
  await result.fixture.detectChanges();

  expect(picker(result.fabric.committed)?.props['selection']).toBe('dark');
});

test('saves the theme the user picks', async () => {
  const { disk, storage, providers } = setup();
  const result = await render(SettingsScreen, { providers });

  result.fabric.emit(picker(result.fabric.committed)!, 'topSelectionChange', { selection: 'light' });
  await result.fixture.detectChanges();
  await storage.flush();

  expect(disk.get('theme')).toBe(JSON.stringify('light'));
  expect(picker(result.fabric.committed)?.props['selection']).toBe('light');
});

test('says where the data lives', async () => {
  const { providers } = setup();
  await render(SettingsScreen, { providers });

  expect(screen.getByText(/se guardan en este teléfono/)).toBeTruthy();
});

test('asks before deleting everything', async () => {
  const { confirm, providers } = setup();
  await render(SettingsScreen, { providers });

  await userEvent.setup().press(screen.getByRole('button', { name: 'Borrar todos los datos' }));

  expect(confirm).toHaveBeenCalledWith('¿Borrar todos los datos?', expect.objectContaining({ destructive: true }));
});
