import { Component, input } from "@angular/core";
import { Text, View } from "@ng-native/components";
import { AppBar } from "../../shared/appbar.shared";

@Component({
   selector: 'user-screen',
   imports: [View, AppBar, Text],
   template:`
      <view class="flex-1 px-6 bg-neutral-100 dark:bg-neutral-950">
         <app-bar title="User" [tabBarHidden]="true" />
         <text class="p-20 dark:text-white text-neutral-500 text-2xl" >{{id()}}</text>
      </view>
   `,
})

export class UserScreen{
   readonly id = input<string>();
}