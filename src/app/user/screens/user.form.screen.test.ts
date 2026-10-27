import { Haptics } from '@ng-native/expo/haptics';
import { NativeNavigation } from '@ng-native/router';
import { render, screen, userEvent } from '@ng-native/testing';
import { expect, test, vi } from 'vitest';
import { UserFormScreen } from './user.form.screen.ts';
import { appConfig } from '../../app.config.ts';

function setup() {
  const navigation = { push: vi.fn(async () => true), back: vi.fn() };
  const providers = [
    ...appConfig.providers,
    { provide: NativeNavigation, useValue: navigation },
    { provide: Haptics.SOURCE, useValue: null },
  ];
  return { navigation, providers };
}

test('saves a new person once the required fields are filled', async () => {
  const { navigation, providers } = setup();
  await render(UserFormScreen, { providers });
  const user = userEvent.setup();

  await user.type(screen.getByLabelText('Nombres'), 'Ana');
  await user.type(screen.getByLabelText('Apellidos'), 'Mesias');
  await user.type(screen.getByLabelText('Cédula'), '0105566038');
  await user.press(screen.getByRole('radio', { name: 'Tipo de sangre O negativo' }));
  await user.press(screen.getByRole('button', { name: 'Guardar' }));

  expect(screen.getByRole('radio', { name: 'Tipo de sangre O negativo' }).props['accessibilityState']).toEqual({ checked: true });
  expect(navigation.back).toHaveBeenCalled();
});

test('says what is missing instead of saving', async () => {
  const { navigation, providers } = setup();
  await render(UserFormScreen, { providers });

  await userEvent.setup().press(screen.getByRole('button', { name: 'Guardar' }));

  expect(screen.getByText('Escribe los nombres')).toBeTruthy();
  expect(screen.getByText('Escribe la cédula')).toBeTruthy();
  expect(screen.getByText('Elige el tipo de sangre')).toBeTruthy();
  expect(navigation.back).not.toHaveBeenCalled();
});

test('asks for the ten digits of the cédula', async () => {
  const { providers } = setup();
  await render(UserFormScreen, { providers });

  await userEvent.setup().type(screen.getByLabelText('Cédula'), '01055');

  expect(screen.getByText('La cédula tiene 10 dígitos')).toBeTruthy();
  expect(screen.getByLabelText('Cédula').props['maxLength']).toBe(10);
});

test('opens with the person filled in when editing', async () => {
  const { providers } = setup();
  await render(UserFormScreen, { providers, inputs: { id: '3' } });

  expect(screen.getByDisplayValue('Pablo Mesias')).toBeTruthy();
  expect(screen.getByDisplayValue('0105566038')).toBeTruthy();
  expect(screen.getByRole('radio', { name: 'Tipo de sangre A B negativo' }).props['accessibilityState']).toEqual({ checked: true });
  expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeTruthy();
});
