import { Component } from "@angular/core";
import { Text } from "@ng-native/components";
import { NativeStackOutlet } from "@ng-native/router";

@Component({
   selector: 'settings-stack',
   imports: [NativeStackOutlet],
   template:`
      <native-stack-outlet/>
   `,
   host: { style: 'flex: 1' }
})

export class SettingsStack{
   
}