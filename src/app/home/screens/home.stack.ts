import { Component } from "@angular/core";
import { NativeStackOutlet } from "@ng-native/router";

@Component({
   selector: 'home-stack',
   template: `
      <native-stack-outlet />
   `,
   imports: [NativeStackOutlet],
   host: { style: 'flex: 1' },
})

export class HomeStack {

}