import { Component, inject } from "@angular/core";
import { Pressable, ScrollView } from "@ng-native/components";
import { AppBar, AppBarRight } from "../../shared/appbar.shared";
import { NgIcon } from "@ng-native/icons";
import { UserList } from "../../user/components/user-list";
import { UserModel } from "../../user/model/user.model";
import { NativeNavigation } from "@ng-native/router";

@Component({
   selector: 'home-screen',
   imports: [AppBar, AppBarRight, ScrollView, Pressable, NgIcon, UserList],
   template:`
      <scroll-view
         contentInsetAdjustmentBehavior="automatic"
         class="flex-1 bg-neutral-100 dark:bg-neutral-950"
         contentContainerClass="grow px-6 pt-3 pb-8"
      >
         <user-list [users]="users" (userSelected)="openUser($event)"/>
      </scroll-view>
      <app-bar title="Home">
         <pressable
            appBarRight
            accessibilityRole="button"
            accessibilityLabel="Añadir persona"
            class="size-11 android:size-12 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            (press)="add()"
         >
            <ng-icon name="lucidePlus" class="text-black dark:text-neutral-50" size="24"/>
         </pressable>
      </app-bar>
   `,
   host: { style: 'flex: 1' },
})

export class HomeScreen{
   private readonly navigation = inject(NativeNavigation);

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

   protected add() {
      void this.navigation.push(['/home/user/new']);
   }

   protected openUser(user: UserModel) {
      void this.navigation.push(['/home/user', user.id.toString()]);
   }
}
