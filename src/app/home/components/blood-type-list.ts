import { Component, computed, signal } from "@angular/core";
import { ScrollView, View, Pressable, Text } from "@ng-native/components";
import { NgIcon } from "@ng-native/icons";

// Narrowest a card can be before a column is dropped, and the space between cards (gap-5).
const MIN_CARD_WIDTH = 140;
const GAP = 20;

@Component({
   selector: 'blood-type-list',
   template: `
      <scroll-view class="flex-1" contentContainerClass="grow px-6 min-pt-safe-12 min-pb-safe-8">
         <view
            class="mt-5 gap-5"
            accessibilityRole="radiogroup"
            accessibilityLabel="Blood group"
            (layout)="width.set($event.nativeEvent.layout.width)"
         >
            @for (row of rows(); track $index) {
               <view class="flex-row gap-5">
                  @for (type of row; track $index) {
                     @if (type) {
                        <pressable
                           accessibilityRole="radio"
                           [accessibilityLabel]="type"
                           [aria-checked]="selected() === type"
                           (press)="selected.set(type)"
                           class="relative h-19 flex-1 items-center justify-center rounded-md bg-control text-ink-muted transition-colors
                              hover:bg-neutral-200 aria-checked:bg-brand aria-checked:text-white aria-checked:hover:bg-brand-pressed
                              focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2
                              dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700
                              dark:focus-visible:ring-offset-neutral-950 md:h-24
                           "
                        >
                           <text class="text-2xl">{{ type }}</text>
                           @if (selected() === type) {
                              <ng-icon name="lucideCheck" [size]="16" strokeWidth="3" class="absolute right-2 top-2" />
                           }
                        </pressable>
                     } @else {
                        <!-- Keeps the cards of a short last row as wide as the rest -->
                        <view class="flex-1" />
                     }
                  }
               </view>
            }
         </view>
      </scroll-view>
   `,
   imports: [ScrollView, View, Pressable, Text, NgIcon],
})
export class BloodTypeList {
   protected readonly bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
   readonly selected = signal<string | null>(null);

   /** The list's own width, from its layout; 0 until the first one arrives. */
   protected readonly width = signal(0);

   /** Two on a phone, as many as fit at MIN_CARD_WIDTH on anything wider. */
   protected readonly columns = computed(() =>
      Math.max(2, Math.floor((this.width() + GAP) / (MIN_CARD_WIDTH + GAP))),
   );

   /** The types in rows of `columns`, the last one padded with nulls. */
   protected readonly rows = computed(() => {
      const columns = this.columns();
      const rows: (string | null)[][] = [];
      for (let i = 0; i < this.bloodTypes.length; i += columns) {
         const row: (string | null)[] = this.bloodTypes.slice(i, i + columns);
         while (row.length < columns) row.push(null);
         rows.push(row);
      }
      return rows;
   });
}
