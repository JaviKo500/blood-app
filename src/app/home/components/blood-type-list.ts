import { Component, computed, signal } from "@angular/core";
import { ScrollView, View, Pressable, Text } from "@ng-native/components";
import { NgIcon } from "@ng-native/icons";

// Narrowest a card can be before a column is dropped, and the space between cards (gap-5).
const MIN_CARD_WIDTH = 140;
const GAP = 20;

@Component({
   selector: 'blood-type-list',
   template: `
      <scroll-view class="flex-1" contentContainerClass="grow px-6 min-pt-safe-12 min-pb-safe-32">
         <view class="gap-5">
            @for (person of persons; track person.id) {
               <pressable
                  accessibilityRole="radio"
                  [accessibilityLabel]=""
                  class="relative p-4 gap-2 flex-1 justify-center rounded-md transition-colors
                     bg-white hover:bg-neutral-200 aria-checked:text-white aria-checked:hover:bg-brand-pressed
                     focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2
                     dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700
                     dark:focus-visible:ring-offset-neutral-950 md:h-24
                     dark:aria-checked:text-zinc-100
                  "
               >
                  <view class="flex-row gap-4 items-center">
                     <view class="rounded-full bg-zinc-200 dark:bg-zinc-500 p-2">
                        <text>{{getFirstLetter(person.name, person.last_name)}}</text>
                     </view>
                     <view class="gap-2 flex-1">
                        <text class="text-xl" [numberOfLines]="1" ellipsizeMode="tail">{{ person.name }} {{person.last_name}}</text>
                        <view class="flex-row gap-2">
                           <text class="text-sm font-light text-zinc-500 dark:text-zinc-400">{{ person.type }}</text>
                           <text class="text-sm font-light text-zinc-500 dark:text-zinc-400">{{ person.dni }}</text>
                        </view>
                     </view>
                  </view>
               </pressable>
            }
         </view>
      </scroll-view>
   `,
   imports: [ScrollView, View, Pressable, Text,],
})
export class BloodTypeList {
   protected readonly persons = [
      { id: 1,type: 'A+', name:'javiko', last_name: 'Gutierrez', dni: '0105566046'},
      { id: 2,type: 'A-', name:'javiko', last_name: 'Gutierrez', dni: '0105566046'},
      { id: 3,type: 'B+', name:'Pablo Mesias', last_name: 'Gutierrez Urgiles', dni: '0105566038'},
      { id: 4,type: 'B-', name:'javiko', last_name: 'Gutierrez', dni: '0105566046'},
      { id: 5,type: 'AB+', name:'javiko', last_name: 'Gutierrez', dni: '0105566046'},
      { id: 6,type: 'AB-', name:'javiko', last_name: 'Gutierrez', dni: '0105566046'},
      { id: 7,type: 'O+', name:'javiko', last_name: 'Gutierrez', dni: '0105566046'},
      { id: 8,type: 'O-', name:'javiko', last_name: 'Gutierrez', dni: '0105566046'},
   ];

   protected getFirstLetter( name: string, lastName: string ) {
      return `${name.at(0) ?? ''}${lastName.at(0) ?? ''}`.trim().toUpperCase();
   }
}
