import { Component, computed, inject } from "@angular/core";
import { Text, View, Pressable, ScrollView, } from "@ng-native/components";
import { AppBar } from "../../shared/appbar.shared";
import { Dialogs } from "@ng-native/device";
import { UiHost, UiPicker, type UiPickerOption } from "@ng-native/expo/expo-ui-components";
import { ThemePreference } from "../../shared/theme.shared";
import { NgIcon } from "@ng-native/icons";

@Component({
   selector: 'settings-screen',
   imports: [AppBar, View, ScrollView, Text, Pressable, NgIcon, UiHost, UiPicker,],
   template:`
      <scroll-view
         contentInsetAdjustmentBehavior="automatic"
         class="flex-1 bg-neutral-100 dark:bg-neutral-950"
         contentContainerClass="grow gap-8 px-6 pt-4 min-pb-safe-8"
      >
         <view class="gap-2">
            <text accessibilityRole="header"
               class="px-4 text-xs font-medium uppercase tracking-wide text-ink-muted dark:text-neutral-300">
               Apariencia
            </text>
            <view class="rounded-xl bg-white p-3 shadow-lg shadow-slate-900/5
                         dark:border-hairline dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
               <!-- The platform's own segmented control: UISegmentedControl on iOS, Material's
                    segmented buttons on Android. It announces itself and its selection. -->
               <ui-host [matchContents]="{ vertical: true }">
                  <ui-picker
                     label="Tema"
                     pickerStyle="segmented"
                     [options]="themes"
                     [value]="picked()"
                     (valueChange)="chooseTheme($event)"
                  />
               </ui-host>
            </view>
         </view>
          <view class="gap-2">
            <text accessibilityRole="header"
               class="px-4 text-xs font-medium uppercase tracking-wide text-ink-muted dark:text-neutral-300">
               Datos y privacidad
            </text>
            <view class="overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5
                         dark:border-hairline dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
               <!-- Fila destructiva -->
               <pressable accessibilityRole="button"
                  accessibilityHint="Pide confirmación y borra para siempre todas las personas guardadas"
                  (press)="confirmDeleteAll()"
                  class="min-h-14 flex-row items-center gap-3 px-4 py-2 transition-colors
                         hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  <view class="size-8 items-center justify-center rounded-md bg-brand/10 dark:bg-brand-light/15">
                     <ng-icon name="lucideTrash2" [size]="18" class="text-brand dark:text-brand-light" />
                  </view>
                  <text class="flex-1 text-base text-brand dark:text-brand-light">Borrar todos los datos</text>
               </pressable>
            </view>
         </view>
         <text class="mt-auto text-center text-sm text-ink-muted dark:text-neutral-300 mb-20">Versión 1.0.0</text>
      </scroll-view>
      <app-bar title="Ajustes"></app-bar>
   `,
   host: { style: 'flex: 1' },
})

export class SettingsScreen{
   private readonly dialogs = inject(Dialogs);
   protected readonly themes: readonly UiPickerOption[] = [
      { value: 'light', label: 'Claro' },
      { value: 'dark', label: 'Oscuro' },
      { value: 'system', label: 'Sistema' },
   ];
   // Saved on the device; ThemePreference applies it to the window, so CSS dark:, headers, tabs
   // and switches all follow.
   private readonly theme = inject(ThemePreference).choice;
   // A picker value is a string or a number, so following the system is 'system' here, null there.
   protected readonly picked = computed(() => this.theme() ?? 'system');

   protected chooseTheme(value: string | number | null): void {
      this.theme.set(value === 'light' || value === 'dark' ? value : null);
   }

   protected async confirmDeleteAll(): Promise<void> {
      const sure = await this.dialogs.confirm('¿Borrar todos los datos?', {
         message: 'Se borrarán todas las personas guardadas en este teléfono. No se puede deshacer.',
         confirm: 'Borrar todo',
         cancel: 'Cancelar',
         destructive: true,
      });
      if (!sure) return;
      // TODO: clear the people store once persistence exists; the list is sample data for now.
   }
}