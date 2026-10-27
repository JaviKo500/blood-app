import { Component, inject } from '@angular/core';
import { SafeAreaProvider, } from '@ng-native/components';
import { nativePlatform } from '@ng-native/fabric';
import { NativeStackOutlet } from '@ng-native/router';
import { ThemePreference } from './shared/theme.shared';

/**
 * Element names are lowercase, and that is load-bearing rather than style: an uppercase name is
 * read as an unknown Angular component and commits as a plain view with nothing in it.
 */
@Component({
  imports: [ SafeAreaProvider, NativeStackOutlet],
  selector: 'app-root',
  template: `
    <safe-area-provider>
      <native-stack-outlet />
    </safe-area-provider>
  `,
  host: { '[class]': 'platformClass', '[style]': 'fill' },
})
export class App {
  protected readonly platformClass = `platform-${nativePlatform()}`;
  protected readonly fill = { flex: 1 };

  constructor() {
    // Restores the saved theme at startup, before the settings tab is ever opened.
    inject(ThemePreference);
  }
}
