import { render, screen } from '@ng-native/testing';
import { expect, test } from 'vitest';
import { App } from './app.ts';
import { appConfig } from './app.config.ts';

test('boots on the home screen', async () => {
  await render(App, { providers: appConfig.providers });

  expect(await screen.findByRole('button', { name: 'Search' })).toBeTruthy();
  expect(screen.getAllByRole('button', { name: /Gutierrez/ })).toHaveLength(8);
});
