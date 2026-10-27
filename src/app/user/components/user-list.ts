import { Component, computed, input, output } from "@angular/core";
import { ScrollView, View, Pressable, Text } from "@ng-native/components";
import { NgIcon } from "@ng-native/icons";
import { UserModel } from "../model/user.model";

@Component({
   selector: 'user-list',
   template: `
      <scroll-view class="flex-1" contentContainerClass="grow px-6 min-pt-safe-12 min-pb-safe-32">
         <view class="gap-3">
            @for (row of rows(); track row.id) {
               <pressable
                  accessibilityRole="button"
                  [accessibilityLabel]="row.name + ' ' + row.lastName + ' ' + row.typeBlood"
                  (press)="userSelected.emit(row)"
                  class="p-4 bg-white rounded-xl hover:bg-neutral-100
                     focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2
                     dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700
                     dark:focus-visible:ring-offset-neutral-950
                  "
               >
                  <view class="flex-row gap-4 items-center">
                     <view class="rounded-full size-12 items-center justify-center bg-zinc-200 dark:bg-zinc-500">
                        <text class="font-semibold">{{ row.initials }}</text>
                     </view>
                     <view class="gap-2 flex-1">
                        <text class="text-base font-medium" [numberOfLines]="1" ellipsizeMode="tail">{{ row.name }} {{ row.lastName }}</text>
                        <view class="flex-row gap-1 items-center">
                           <text class="text-xs font-medium rounded-full px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">{{ row.typeBlood }}</text>
                           <text class="text-sm text-zinc-500 dark:text-zinc-400">·</text>
                           <text class="text-sm font-light text-zinc-500 dark:text-zinc-400">{{ row.dni }}</text>
                        </view>
                     </view>
                     <ng-icon name="lucideChevronRight" class="text-zinc-400" size="20"/>
                  </view>
               </pressable>
            } @empty {
               <text class="text-center text-zinc-500 dark:text-zinc-400 py-12">No hay usuarios todavía</text>
            }
         </view>
      </scroll-view>
   `,
   imports: [ScrollView, View, Pressable, Text, NgIcon],
})
export class UserList {
   readonly users = input<UserModel[]>([]);

   readonly userSelected = output<UserModel>();

   protected readonly rows = computed(() =>
      this.users().map(user => ({ ...user, initials: initials([user.name, user.lastName]) }))
   );
}

export const initials = (texts: string[]) =>
   texts.map(t => t.at(0) ?? '').join('').trim().toUpperCase();
