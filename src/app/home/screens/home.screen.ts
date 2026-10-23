import { Component } from "@angular/core";
import { View, Pressable, } from "@ng-native/components";
import { AppBar, AppBarRight } from "../../shared/appbar.shared";
import { NgIcon } from "@ng-native/icons";
import { BloodTypeList } from "../components/blood-type-list";

@Component({
   selector: 'home-screen',
   imports: [AppBar, AppBarRight, View, Pressable, NgIcon, BloodTypeList],
   template:`
      <view class="flex-1 px-4 bg-white dark:bg-neutral-950">
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
         <blood-type-list class="flex-1"/>
      </view>
   `,
})

export class HomeScreen{
   protected search() {
      console.log('<--------------- JK Home.screen --------------->');
      console.log('search');
   }
}