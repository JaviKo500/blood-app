import { Component, inject, signal } from "@angular/core";
import { Text, View, Pressable, ScrollView, } from "@ng-native/components";
import { AppBar } from "../../shared/appbar.shared";
import { ColorScheme, Scheme } from "@ng-native/device";
import { NgIcon } from "@ng-native/icons";

@Component({
   selector: 'settings-screen',
   imports: [AppBar, View, ScrollView, Text, Pressable, NgIcon,],
   template:`
      <view class="flex-1 px-6 bg-zinc-100 dark:bg-neutral-950">
         <app-bar title="Settings"></app-bar>
         <scroll-view class="flex-1" contentContainerClass="grow gap-8 pt-4 min-pb-safe-8">
            <view class="gap-2">
               <text accessibilityRole="header"
                  class="px-4 text-xs font-medium uppercase tracking-wide text-ink-muted dark:text-neutral-400">
                  Apariencia
               </text>
               <view class="rounded-xl bg-white p-2 shadow-lg shadow-slate-900/5
                            dark:border-hairline dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
                  <view class="flex-row gap-2" accessibilityRole="radiogroup" accessibilityLabel="Tema">
                     @for (option of themes; track option.label) {
                        <pressable
                           accessibilityRole="radio"
                           [accessibilityLabel]="option.label"
                           [aria-checked]="theme() === option.value"
                           (press)="chooseTheme(option.value)"
                           class="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-md bg-control text-ink-muted transition-colors
                              hover:bg-neutral-200 aria-checked:bg-red-500 aria-checked:text-white aria-checked:hover:bg-brand-pressed
                              focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2
                              dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700
                              dark:focus-visible:ring-offset-neutral-900
                              dark:aria-checked:bg-red-600 dark:aria-checked:text-zinc-100
                           "
                        >
                           <ng-icon [name]="option.icon" [size]="18" [class]="theme() === option.value 
                              ? 'text-white dark:text-zinc-100' 
                              : 'text-black dark:text-zinc-100'"/>
                           <text class="text-sm font-medium">{{ option.label }}</text>
                        </pressable>
                     }
                  </view>
               </view>
            </view>
             <view class="gap-2">
               <text accessibilityRole="header"
                  class="px-4 text-xs font-medium uppercase tracking-wide text-ink-muted dark:text-neutral-400">
                  Datos y privacidad
               </text>
               <view class="overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5
                            dark:border-hairline dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
                  <view class="ml-15 h-hairline bg-neutral-200 dark:bg-neutral-800"></view>
                  <!-- Fila destructiva -->
                  <pressable accessibilityRole="button"
                     class="min-h-14 flex-row items-center gap-3 px-4 py-2 transition-colors
                            hover:bg-neutral-50 dark:hover:bg-neutral-800">
                     <view class="size-8 items-center justify-center rounded-md bg-brand/10">
                        <ng-icon name="lucideTrash2" [size]="18" class="text-brand dark:text-neutral-400" />
                     </view>
                     <text class="flex-1 text-base dark:text-neutral-400">Borrar todos los datos</text>
                  </pressable>
               </view>
            </view>
            <text class="mt-auto text-center text-sm text-ink-muted dark:text-neutral-400 mb-20">Versión 1.0.0</text>
         </scroll-view>
      </view>
   `,
})

export class SettingsScreen{
   private readonly colorScheme = inject(ColorScheme);
   protected readonly themes = [
      { value: 'light', label: 'Claro', icon: 'lucideSun' },
      { value: 'dark', label: 'Oscuro', icon: 'lucideMoon' },
      { value: null, label: 'Sistema', icon: 'lucideSmartphone' },
   ] as const;
   protected readonly theme = signal<Scheme | null>(null);
    protected chooseTheme(scheme: Scheme | null): void {
      this.theme.set(scheme);
      // Changes the window's appearance: CSS dark:, headers, tabs and switches all follow.
      this.colorScheme.set(scheme);
   }
}