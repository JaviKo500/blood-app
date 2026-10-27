import { effect, inject, Injectable } from "@angular/core";
import { ColorScheme, Scheme } from "@ng-native/device";
import { Storage } from "@ng-native/expo/async-storage";

/**
 * The theme the user chose, saved on the device. `null` follows the system.
 * ColorScheme.current() reports what is shown, not what was chosen, so the choice lives here.
 */
@Injectable({ providedIn: 'root' })
export class ThemePreference {
   private readonly colorScheme = inject(ColorScheme);
   readonly choice = inject(Storage).signal<Scheme | null>('theme', null);

   constructor() {
      // Applies the stored choice once it is read back at startup, and every change after it.
      effect(() => this.colorScheme.set(this.choice()));
   }
}
