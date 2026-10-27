import { Component, computed, inject, input, output } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { View, Pressable, Text } from "@ng-native/components";
import { NgIcon } from "@ng-native/icons";
import { Accessibility } from "@ng-native/device";
import { UserModel } from "../model/user.model";

@Component({
   selector: 'user-list',
   template: `
      <view class="gap-3">
         @for (row of rows(); track row.id) {
            <pressable
               accessibilityRole="button"
               [accessibilityLabel]="row.spoken"
               accessibilityHint="Abre la ficha"
               (press)="userSelected.emit(row)"
               class="p-4 bg-white rounded-xl transition-colors hover:bg-neutral-100
                  focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2
                  dark:border-hairline dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800
                  dark:focus-visible:ring-offset-neutral-950
               "
            >
               @if (stacked()) {
                  <view class="gap-3">
                     <view class="flex-row items-center justify-between">
                        <ng-container *ngTemplateOutlet="tile; context: { $implicit: row }" />
                        <ng-container *ngTemplateOutlet="chevron" />
                     </view>
                     <ng-container *ngTemplateOutlet="details; context: { $implicit: row }" />
                  </view>
               } @else {
                  <view class="flex-row gap-4 items-center">
                     <ng-container *ngTemplateOutlet="tile; context: { $implicit: row }" />
                     <view class="flex-1">
                        <ng-container *ngTemplateOutlet="details; context: { $implicit: row }" />
                     </view>
                     <ng-container *ngTemplateOutlet="chevron" />
                  </view>
               }
            </pressable>
         } @empty {
            <text class="text-center text-neutral-500 dark:text-neutral-400 py-12">No hay usuarios todavía</text>
         }
      </view>

      <ng-template #tile let-row>
         <view [style]="{ minWidth: tileWidth(), minHeight: 56 }" class="px-2 rounded-xl items-center justify-center bg-red-100 dark:bg-red-900/40">
            <text class="text-xl font-semibold text-red-700 dark:text-red-300">{{ row.bloodType }}</text>
         </view>
      </ng-template>

      <ng-template #details let-row>
         <view class="gap-1">
            <text class="text-base font-medium text-black dark:text-neutral-50" [numberOfLines]="stacked() ? 0 : 2" ellipsizeMode="tail">{{ row.name }} {{ row.lastName }}</text>
            <text class="text-sm tabular-nums text-ink-muted dark:text-neutral-300">{{ row.dni }}</text>
         </view>
      </ng-template>

      <ng-template #chevron>
         <ng-icon name="lucideChevronRight" class="text-neutral-400 dark:text-neutral-500" size="20"/>
      </ng-template>
   `,
   imports: [View, Pressable, Text, NgIcon, NgTemplateOutlet],
})
export class UserList {
   private readonly accessibility = inject(Accessibility);

   readonly users = input<UserModel[]>([]);

   readonly userSelected = output<UserModel>();

   /** From the accessibility text sizes a row cannot hold the tile, the name and a 10-digit cédula side by side. */
   protected readonly stacked = computed(() => this.accessibility.fontScale() >= STACK_FONT_SCALE);

   /** Wide enough for "AB−" at the current text size, so every name in the list starts at one edge. */
   protected readonly tileWidth = computed(() => Math.round(TILE_WIDTH * Math.max(1, this.accessibility.fontScale())));

   protected readonly rows = computed(() =>
      this.users().map(user => ({ ...user, bloodType: bloodTypeGlyph(user.typeBlood), spoken: spokenUser(user) }))
   );
}

const STACK_FONT_SCALE = 1.6;
const TILE_WIDTH = 64;

/** A hyphen is a short dash beside a plus; the minus sign is as wide as the plus it opposes. */
export const bloodTypeGlyph = (type: string) => type.replace('-', '−');

export const spokenUser = (user: UserModel) => [
   `${user.name} ${user.lastName}`.trim(),
   `tipo de sangre ${spokenBloodType(user.typeBlood)}`,
   user.dni.trim() ? `cédula ${spaced(user.dni.trim())}` : '',
].filter(Boolean).join(', ');

export const spokenBloodType = (type: string) => {
   const match = /^(AB|A|B|O)\s*([+-])$/i.exec(type.trim());
   if (!match) return type.trim() || 'sin registrar';
   return `${spaced(match[1].toUpperCase())} ${match[2] === '+' ? 'positivo' : 'negativo'}`;
};

const spaced = (text: string) => [...text].join(' ');
