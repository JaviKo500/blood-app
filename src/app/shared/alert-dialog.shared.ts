import { Component, ElementRef, inject, input, output } from "@angular/core";
import { keepNativeView } from "@ng-native/fabric";

/** A Compose color, as `@expo/ui` takes one: '#rrggbb' text. */
export interface UiButtonColors {
   readonly containerColor?: string;
   readonly contentColor?: string;
}

/**
 * Material 3's AlertDialog from @expo/ui, Android only. Its content goes in `ui-slot`s named
 * title, text, icon, confirmButton and dismissButton, and it sits inside a `ui-host`.
 * ng-native has no typed component for it, so this is one of the same shape as its own.
 */
@Component({
   selector: 'ui-alert',
   template: '<ng-content />',
   host: { '(dismissRequest)': 'dismiss.emit()' },
})
export class UiAlertDialog {
   // Says the host is the native view the selector is registered as, not a plain view.
   protected readonly nativeView = (keepNativeView(inject(ElementRef).nativeElement), true);
   /** Back, or a tap outside the dialog. */
   readonly dismiss = output<void>();
}

/**
 * Compose's TextButton, Android only: the buttons Material 3 puts in a dialog. Registered as
 * ui-text-button in main.ts, since @expo/ui's own table has no name for it.
 */
@Component({
   selector: 'ui-text-button',
   template: '<ng-content />',
   host: { '[colors]': 'colors()', '(buttonPressed)': 'press.emit()' },
})
export class UiTextButton {
   protected readonly nativeView = (keepNativeView(inject(ElementRef).nativeElement), true);
   readonly colors = input<UiButtonColors>();
   readonly press = output<void>();
}
