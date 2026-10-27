import { lucideSettings, lucideUsers, } from '@ng-icons/lucide';
import { Component } from "@angular/core";
import { NativeHeader, NativeTab, NativeTabsOutlet } from '@ng-native/router';

@Component({
   selector: 'tabs-menu',
   imports: [ NativeHeader, NativeTab, NativeTabsOutlet],
   template:`
      <native-header [hidden]="true" />
      <native-tabs-outlet>
         <native-tab path="home" title="Personas" [icon]="{ svg: lucideUsers }" />
         <native-tab path="settings" title="Ajustes" [icon]="{ svg: lucideSettings }" />
      </native-tabs-outlet>
   `,
})

export class TabsMenu{
   protected readonly lucideUsers = lucideUsers;
   protected readonly lucideSettings = lucideSettings;
}