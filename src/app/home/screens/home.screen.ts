import { Component } from "@angular/core";
import { View, Pressable, } from "@ng-native/components";
import { AppBar, AppBarRight } from "../../shared/appbar.shared";
import { NgIcon } from "@ng-native/icons";
import { UserList } from "../../user/components/user-list";
import { UserModel } from "../../user/model/user.model";

@Component({
   selector: 'home-screen',
   imports: [AppBar, AppBarRight, View, Pressable, NgIcon, UserList],
   template:`
      <view class="flex-1 px-4 bg-zinc-100 dark:bg-neutral-950">
         <app-bar title="Home">
            <pressable 
               appBarRight 
               accessibilityRole="button" 
               accessibilityLabel="Search"
               class="size-11 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10"
               (press)="search()"
            >
               <ng-icon name="lucidePlus" class="text-black dark:text-neutral-50" size="24"/>
            </pressable>
         </app-bar>
         <user-list class="flex-1" [users]="users" (userSelected)="openUser($event)"/>
      </view>
   `,
})

export class HomeScreen{
   protected readonly users: UserModel[] = [
      { id: 1, typeBlood: 'A+', name: 'javiko', lastName: 'Gutierrez', dni: '0105566046' },
      { id: 2, typeBlood: 'A-', name: 'javiko', lastName: 'Gutierrez', dni: '0105566046' },
      { id: 3, typeBlood: 'B+', name: 'Pablo Mesias', lastName: 'Gutierrez Urgiles', dni: '0105566038' },
      { id: 4, typeBlood: 'B-', name: 'javiko', lastName: 'Gutierrez', dni: '0105566046' },
      { id: 5, typeBlood: 'AB+', name: 'javiko', lastName: 'Gutierrez', dni: '0105566046' },
      { id: 6, typeBlood: 'AB-', name: 'javiko', lastName: 'Gutierrez', dni: '0105566046' },
      { id: 7, typeBlood: 'O+', name: 'javiko', lastName: 'Gutierrez', dni: '0105566046' },
      { id: 8, typeBlood: 'O-', name: 'javiko', lastName: 'Gutierrez', dni: '0105566046' },
   ];

   protected search() {
      console.log('<--------------- JK Home.screen --------------->');
      console.log('search');
   }

   protected openUser(user: UserModel) {
      console.log('openUser', user.id);
   }
}
