import { Component } from "@angular/core";
import { Text, View, Pressable } from "@ng-native/components";
import { AppBar, AppBarRight } from "../../shared/appbar.shared";
import { NgIcon } from "@ng-native/icons";

@Component({
   selector: 'home-screen',
   imports: [AppBar, AppBarRight, View, Pressable, NgIcon],
   template:`
      <view class="flex-1 px-4">
         <app-bar title="Home">
            <pressable 
               appBarRight 
               accessibilityRole="button" 
               accessibilityLabel="Search"
               class="size-11 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10"
               (press)="search()"
            >
               <ng-icon name="lucideSearch" class="text-black dark:text-neutral-50" size="24"/>
            </pressable>
         </app-bar>
      </view>
   `,
})

export class HomeScreen{
   protected search() {
      console.log('<--------------- JK Home.screen --------------->');
      console.log('search');
   }
}