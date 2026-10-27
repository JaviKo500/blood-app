import { render, screen } from '@ng-native/testing';
import { expect, test } from 'vitest';
import { HomeScreen } from '../home/screens/home.screen.ts';

test('draws the action the screen projects into the app bar', async () => {
  await render(HomeScreen);

  expect(screen.getByRole('button', { name: 'Search' })).toBeTruthy();
});

test('hands its users to the list', async () => {
  await render(HomeScreen);

  expect(screen.getAllByRole('button', { name: /Gutierrez/ })).toHaveLength(8);
  expect(screen.getByRole('button', { name: 'Pablo Mesias Gutierrez Urgiles B+' })).toBeTruthy();
});
