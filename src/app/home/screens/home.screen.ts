import { Component, inject, OnInit } from "@angular/core";
import { Pressable, ScrollView, View, Text } from "@ng-native/components";
import { AppBar, AppBarRight } from "../../shared/appbar.shared";
import { NgIcon } from "@ng-native/icons";
import { PersonList } from "../../person/components/person-list";
import { PersonModel } from "../../person/model/person.model";
import { NativeNavigation, TabSafeAreaView } from "@ng-native/router";
import { nativePlatform } from "@ng-native/fabric";
import { PersonStore } from "../../person/data/person.store";

@Component({
   selector: 'home-screen',
   imports: [AppBar, AppBarRight, ScrollView, Pressable, NgIcon, PersonList, TabSafeAreaView, View, Text],
   template:`
      <scroll-view
         contentInsetAdjustmentBehavior="automatic"
         class="flex-1 bg-neutral-100 dark:bg-neutral-950"
         contentContainerClass="grow px-6 pt-3 pb-8"
      >
         @if ( store.loading() ) {
            <view>Cargando...</view>
         } @else if (store.error(); as  message) {
            <text>{{ message }}</text> 
         } @else { 
            <person-list [persons]="store.persons()" (personSelected)="openPerson($event)" /> 
         }
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

export class HomeScreen implements OnInit{
   private readonly navigation = inject(NativeNavigation);
   protected readonly android = nativePlatform() === 'android';

   protected readonly store =inject(PersonStore);

   ngOnInit(): void {
      this.store.load();
   }

   protected add() {
      void this.navigation.push(['/home/person/new']);
   }

   protected openPerson(person: PersonModel) {
      void this.navigation.push(['/home/person', person.id.toString()]);
   }
}
