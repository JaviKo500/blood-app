import { Component } from "@angular/core";
import { NativeStackOutlet } from "@ng-native/router";

@Component({
   selector: 'home-stack',
   imports: [NativeStackOutlet],
   template: `
      <native-stack-outlet />
   `,
   host: { style: 'flex: 1' },
})

export class HomeStack {

}