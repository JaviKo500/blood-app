import { Component, computed, input } from "@angular/core";
import { Text, View } from "@ng-native/components";
import { NgIcon } from "@ng-native/icons";

/**
 * A filled field of the person form: the control's icon, the projected `<text-input>`, and the
 * field's error under it. The ring is the brand crimson while the field has focus or is wrong,
 * the two places the One Red Rule lets it in.
 */
@Component({
   selector: 'person-field',
   imports: [View, Text, NgIcon],
   template: `
      <view class="gap-1.5">
         <view [class]="ring()" class="min-h-13 flex-row items-center gap-3 rounded-xl border-2 px-4 bg-control dark:bg-neutral-800">
            <ng-icon [name]="icon()" [size]="18" class="text-ink-muted dark:text-neutral-300" />
            <ng-content />
         </view>
         @if (error(); as message) {
            <view class="flex-row items-center gap-1.5 px-1">
               <ng-icon name="lucideCircleAlert" [size]="14" class="text-brand dark:text-brand-light" />
               <text accessibilityRole="alert" class="flex-1 text-sm text-brand dark:text-brand-light">{{ message }}</text>
            </view>
         }
      </view>
   `,
})
export class PersonField {
   readonly icon = input.required<string>();
   readonly focused = input(false);
   /** The message to show, once the field has been touched and is wrong; empty otherwise. */
   readonly error = input('');

   protected readonly ring = computed(() =>
      this.focused() || this.error() ? 'border-brand dark:border-brand-light' : 'border-transparent'
   );
}
