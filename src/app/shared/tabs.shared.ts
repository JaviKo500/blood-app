import { Component } from "@angular/core";
import { NativeHeader, NativeTab, NativeTabsOutlet } from '@ng-native/router';

@Component({
   selector: 'tabs-menu',
   imports: [ NativeHeader, NativeTab, NativeTabsOutlet],
   template:`
      <native-header [hidden]="true" />
      <native-tabs-outlet>
         <native-tab path="home" title="Home"/>
         <native-tab path="settings" title="Settings"/>
      </native-tabs-outlet>
   `,
})

export class TabsMenu{
   
}