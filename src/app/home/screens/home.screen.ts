import { Component, inject } from "@angular/core";
import { Pressable, ScrollView } from "@ng-native/components";
import { AppBar, AppBarRight } from "../../shared/appbar.shared";
import { NgIcon } from "@ng-native/icons";
import { PersonList } from "../../person/components/person-list";
import { PersonModel } from "../../person/model/person.model";
import { NativeNavigation, TabSafeAreaView } from "@ng-native/router";
import { nativePlatform } from "@ng-native/fabric";

@Component({
   selector: 'home-screen',
   imports: [AppBar, AppBarRight, ScrollView, Pressable, NgIcon, PersonList, TabSafeAreaView],
   template:`
      <scroll-view
         contentInsetAdjustmentBehavior="automatic"
         class="flex-1 bg-neutral-100 dark:bg-neutral-950"
         contentContainerClass="grow px-6 pt-3 pb-8"
      >
         <person-list [persons]="persons" (personSelected)="openPerson($event)"/>
         @if (android) {
            <!-- Android has no automatic inset: this spacer lifts the last row clear of the tab bar. -->
            <tab-safe-area-view [edges]="['bottom']" />
         }
      </scroll-view>
      <app-bar title="Personas">
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
   protected readonly android = nativePlatform() === 'android';

   protected readonly persons: PersonModel[] = [
      { id: '1', bloodTypeCode: 'A+', name: 'javiko', lastName: 'Gutierrez', dni: '0105566046' },
      { id: '2', bloodTypeCode: 'A-', name: 'javiko', lastName: 'Gutierrez', dni: '0105566046' },
      { id: '3', bloodTypeCode: 'B+', name: 'Pablo Mesias', lastName: 'Gutierrez Urgiles', dni: '0105566038' },
      { id: '4', bloodTypeCode: 'B-', name: 'javiko', lastName: 'Gutierrez', dni: '0105566046' },
      { id: '5', bloodTypeCode: 'AB+', name: 'javiko', lastName: 'Gutierrez', dni: '0105566046' },
      { id: '6', bloodTypeCode: 'AB-', name: 'javiko', lastName: 'Gutierrez', dni: '0105566046' },
      { id: '7', bloodTypeCode: 'O+', name: 'javiko', lastName: 'Gutierrez', dni: '0105566046' },
      { id: '8', bloodTypeCode: 'O-', name: 'javiko', lastName: 'Gutierrez', dni: '0105566046' },
   ];

   protected add() {
      void this.navigation.push(['/home/person/new']);
   }

   protected openPerson(person: PersonModel) {
      void this.navigation.push(['/home/person', person.id.toString()]);
   }
}
