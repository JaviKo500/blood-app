import { lucideSettings, lucideUsers, } from '@ng-icons/lucide';
import { Component, computed, inject } from "@angular/core";
import { ColorScheme } from '@ng-native/device';
import { HostEngine, nativePlatform } from '@ng-native/fabric';
import { NativeHeader, NativeTab, NativeTabsOutlet, type TabAppearance } from '@ng-native/router';

@Component({
   selector: 'tabs-menu',
   imports: [ NativeHeader, NativeTab, NativeTabsOutlet],
   template:`
      <native-header [hidden]="true" />
      <native-tabs-outlet [tintColor]="tint()">
         <native-tab path="home" title="Personas" [icon]="{ svg: lucideUsers }" [standardAppearance]="appearance()" />
         <native-tab path="settings" title="Ajustes" [icon]="{ svg: lucideSettings }" [standardAppearance]="appearance()" />
      </native-tabs-outlet>
   `,
})

export class TabsMenu{
   private readonly engine = inject(HostEngine);
   private readonly scheme = inject(ColorScheme);
   private readonly android = nativePlatform() === 'android';
   protected readonly lucideUsers = lucideUsers;
   protected readonly lucideSettings = lucideSettings;

   /** The current tab in the brand's crimson; brand-light on dark, where crimson is too dim. */
   protected readonly tint = computed(() => this.scheme.current() === 'dark' ? '#ff5c7a' : '#d70032');

   /**
    * Android's bar, which tintColor does not reach: Material's indicator pill and item colors come
    * from its own palette otherwise. ng-native converts only the iOS appearance's colors, so these
    * go through the engine here, as native wants them.
    */
   protected readonly appearance = computed(() => {
      if (!this.android) return undefined;
      const dark = this.scheme.current() === 'dark';
      const color = (value: string) => this.engine.color(value);
      const item = (value: string) => ({ tabBarItemIconColor: color(value), tabBarItemTitleFontColor: color(value) });
      return {
         // Surface: white, or neutral 900 on dark, as the app's cards.
         tabBarBackgroundColor: dark ? '#171717' : '#ffffff',
         // A pale tone of the brand behind the current tab's icon, as Material seeds it.
         tabBarItemActiveIndicatorColor: color(dark ? '#5c1a24' : '#ffdadf'),
         selected: item(this.tint()),
         // ink-muted, and neutral 300 on dark.
         normal: item(dark ? '#d4d4d4' : '#484848'),
      } as TabAppearance;
   });
}
