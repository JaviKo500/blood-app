import { render, screen, userEvent } from '@ng-native/testing';
import { expect, test } from 'vitest';
import { App } from './app.ts';
import { appConfig } from './app.config.ts';

test('boots on the home screen', async () => {
  await render(App, { providers: appConfig.providers });

  expect(await screen.findByRole('button', { name: 'Search' })).toBeTruthy();
  expect(screen.getAllByRole('button', { name: /Gutierrez/ })).toHaveLength(8);
});

test('pushes the user screen when a person is pressed', async () => {
  await render(App, { providers: appConfig.providers });
  const user = userEvent.setup();

  await user.press(await screen.findByRole('button', { name: 'Pablo Mesias Gutierrez Urgiles B+' }));

  expect(await screen.findByText('3')).toBeTruthy();
});
