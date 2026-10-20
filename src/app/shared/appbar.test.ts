import { render, screen } from '@ng-native/testing';
import { expect, test } from 'vitest';
import { HomeScreen } from '../home/screens/home.screen.ts';

test('draws the buttons the screen projects into the app bar', async () => {
  await render(HomeScreen);

  expect(screen.getByRole('button', { name: 'Añadir donación' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Cerrar' })).toBeTruthy();
});
