import { Component } from "@angular/core";
import { Text, View, Pressable } from "@ng-native/components";
import { AppBar } from "../../shared/appbar.shared";

@Component({
   selector: 'settings-screen',
   imports: [AppBar, View],
   template:`
      <view class="flex-1 px-4">
         <app-bar title="Settings"></app-bar>
      </view>
   `,
})

export class SettingsScreen{
   
}