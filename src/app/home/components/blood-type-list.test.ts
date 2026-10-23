import { render, screen, userEvent } from '@ng-native/testing';
import { expect, test } from 'vitest';
import { BloodTypeList } from './blood-type-list.ts';

const checked = (name: string) => {
  const props = screen.getByRole('radio', { name }).props;
  return props['aria-checked'] ?? (props['accessibilityState'] as { checked?: boolean })?.checked;
};

test('lays the types out two to a row on a phone', async () => {
  await render(BloodTypeList);

  expect(screen.getAllByRole('radio')).toHaveLength(8);
  expect(screen.getByRole('radio', { name: 'A+' }).parent!.children).toHaveLength(2);
});

test('selects one blood type at a time', async () => {
  await render(BloodTypeList);
  const user = userEvent.setup();

  await user.press(screen.getByRole('radio', { name: 'A+' }));
  expect(checked('A+')).toBe(true);

  await user.press(screen.getByRole('radio', { name: 'O-' }));
  expect(checked('O-')).toBe(true);
  expect(checked('A+')).toBe(false);
});
