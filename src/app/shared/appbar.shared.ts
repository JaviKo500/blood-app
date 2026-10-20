import { Component, contentChild, Directive, input } from "@angular/core";
import { nativePlatform } from "@ng-native/fabric";
import { NativeHeader, NativeHeaderItem } from "@ng-native/router";

@Directive({ selector: '[appBarLeft]' })
export class AppBarLeft {}

@Directive({ selector: '[appBarRight]' })
export class AppBarRight {}

/**
 * On Android a left item makes react-native-screens drop the toolbar's title, so there the title
 * is drawn in the left item, after the projected buttons.
 */
@Component({
   selector: 'app-bar',
   imports: [NativeHeader, NativeHeaderItem,],
   template: `
      <native-header [title]="title()" [largeTitle]="largeTitle()">
         @if (right()) {
            <native-header-item type="right">
               <ng-content select="[appBarRight]" />
            </native-header-item>
         }
      </native-header>
   `,
})

export class AppBar {
   readonly title = input.required<string>();
   readonly largeTitle = input(true);

   protected readonly android = nativePlatform() === 'android';
   protected readonly left = contentChild(AppBarLeft);
   protected readonly right = contentChild(AppBarRight);
}
