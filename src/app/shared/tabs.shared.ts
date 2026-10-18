import { lucideHome, lucideSettings, } from '@ng-icons/lucide';
import { Component } from "@angular/core";
import { NativeHeader, NativeTab, NativeTabsOutlet } from '@ng-native/router';

@Component({
   selector: 'tabs-menu',
   imports: [ NativeHeader, NativeTab, NativeTabsOutlet],
   template:`
      <native-header [hidden]="true" />
      <native-tabs-outlet>
         <native-tab path="home" title="Home" [icon]="{ svg: lucideHome }" />
         <native-tab path="settings" title="Settings" [icon]="{ svg: lucideSettings }" />
      </native-tabs-outlet>
   `,
})

export class TabsMenu{
   protected readonly lucideHome = lucideHome;
   protected readonly lucideSettings = lucideSettings;
}