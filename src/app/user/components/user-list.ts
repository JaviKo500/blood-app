import { Component, computed, input, output } from "@angular/core";
import { View, Pressable, Text } from "@ng-native/components";
import { NgIcon } from "@ng-native/icons";
import { UserModel } from "../model/user.model";

@Component({
   selector: 'user-list',
   template: `
      <view class="gap-3">
         @for (row of rows(); track row.id) {
            <pressable
               accessibilityRole="button"
               [accessibilityLabel]="row.name + ' ' + row.lastName + ' ' + row.typeBlood"
               (press)="userSelected.emit(row)"
               class="p-4 bg-white rounded-xl transition-colors hover:bg-neutral-100
                  focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2
                  dark:border-hairline dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800
                  dark:focus-visible:ring-offset-neutral-950
               "
            >
               <view class="flex-row gap-4 items-center">
                  <view [style]="{ minWidth: 64, minHeight: 56 }" class="px-2 rounded-xl items-center justify-center bg-red-100 dark:bg-red-900/40">
                     <text class="text-xl font-semibold text-red-700 dark:text-red-300">{{ row.bloodType }}</text>
                  </view>
                  <view class="gap-1 flex-1">
                     <text class="text-base font-medium text-black dark:text-neutral-50" [numberOfLines]="1" ellipsizeMode="tail">{{ row.name }} {{ row.lastName }}</text>
                     <text class="text-sm tabular-nums text-ink-muted dark:text-neutral-300">{{ row.dni }}</text>
                  </view>
                  <ng-icon name="lucideChevronRight" class="text-neutral-400 dark:text-neutral-500" size="20"/>
               </view>
            </pressable>
         } @empty {
            <text class="text-center text-neutral-500 dark:text-neutral-400 py-12">No hay usuarios todavía</text>
         }
      </view>
   `,
   imports: [View, Pressable, Text, NgIcon],
})
export class UserList {
   readonly users = input<UserModel[]>([]);

   readonly userSelected = output<UserModel>();

   protected readonly rows = computed(() =>
      this.users().map(user => ({ ...user, bloodType: bloodTypeGlyph(user.typeBlood) }))
   );
}

/** A hyphen is a short dash beside a plus; the minus sign is as wide as the plus it opposes. */
export const bloodTypeGlyph = (type: string) => type.replace('-', '−');
