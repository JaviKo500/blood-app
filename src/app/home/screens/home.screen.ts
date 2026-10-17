import { Component } from "@angular/core";
import { Text } from "@ng-native/components";

@Component({
   selector: 'home-screen',
   imports: [Text],
   template:`
      <text class="text-2xl font-bold text-red-500">HomeScreen</text>
   `,
})

export class HomeScreen{
   
}