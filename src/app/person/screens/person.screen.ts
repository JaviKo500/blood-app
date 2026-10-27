import { Component, computed, inject, input, signal } from "@angular/core";
import { Pressable, ScrollView, Text, View } from "@ng-native/components";
import { NgIcon } from "@ng-native/icons";
import { Accessibility, ColorScheme, DeepLinks, Dialogs } from "@ng-native/device";
import { Clipboard } from "@ng-native/expo/clipboard";
import { Haptics } from "@ng-native/expo/haptics";
import { UiHost, UiSlot, UiText } from "@ng-native/expo/expo-ui-components";
import { nativePlatform } from "@ng-native/fabric";
import { NativeNavigation, TabSafeAreaView } from "@ng-native/router";
import { AppBar, AppBarRight } from "../../shared/appbar.shared";
import { UiAlertDialog, UiTextButton, type UiButtonColors } from "../../shared/alert-dialog.shared";
import { bloodTypeGlyph, spokenBloodType } from "../components/person-list";
import { PersonModel } from "../model/person.model";

@Component({
   selector: 'person-screen',
   imports: [
      View, ScrollView, Text, Pressable, NgIcon, AppBar, AppBarRight, TabSafeAreaView,
      UiHost, UiSlot, UiText, UiAlertDialog, UiTextButton,
   ],
   template:`
      <scroll-view
         contentInsetAdjustmentBehavior="automatic"
         class="flex-1 bg-neutral-100 dark:bg-neutral-950"
         contentContainerClass="grow gap-8 px-6 pt-4 min-pb-safe-8"
      >
         <!-- The wallet card: what someone at a hospital desk asks for, readable at arm's length. -->
         <view class="gap-5 rounded-xl bg-white p-4 shadow-lg shadow-slate-900/5
                      dark:border-hairline dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
            <view
               accessible
               [accessibilityLabel]="'Tipo de sangre ' + spokenBlood()"
               class="items-center justify-center rounded-xl py-6 bg-red-100 dark:bg-red-900/40"
            >
               <text class="text-6xl font-semibold text-red-700 dark:text-red-300">{{ bloodType() }}</text>
            </view>

            <text accessibilityRole="header" class="text-xl font-semibold text-black dark:text-neutral-50">
               {{ person().name }} {{ person().lastName }}
            </text>

            <pressable
               accessibilityRole="button"
               [accessibilityLabel]="'Cédula ' + spokenDni()"
               accessibilityHint="Copia la cédula"
               (press)="copyDni()"
               class="-mx-2 -mb-2 flex-row items-end gap-3 rounded-xl px-2 pb-2 transition-colors
                      hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
               <view class="flex-1 gap-1">
                  <text class="text-sm text-ink-muted dark:text-neutral-300">Cédula</text>
                  <text class="text-3xl font-medium tabular-nums text-black dark:text-neutral-50">{{ groupedDni() }}</text>
               </view>
               <view class="min-h-11 flex-row items-center gap-1">
                  @if (copied()) {
                     <ng-icon name="lucideCheck" [size]="18" class="text-ink-muted dark:text-neutral-300" />
                     <text class="text-sm font-medium text-ink-muted dark:text-neutral-300">Copiada</text>
                  } @else {
                     <ng-icon name="lucideCopy" [size]="18" class="text-ink-muted dark:text-neutral-300" />
                     <text class="text-sm font-medium text-ink-muted dark:text-neutral-300">Copiar</text>
                  }
               </view>
            </pressable>
         </view>

         @if (person().phone || person().email) {
            <view class="gap-2">
               <text accessibilityRole="header"
                  class="px-4 text-xs font-medium uppercase tracking-wide text-ink-muted dark:text-neutral-300">
                  Contacto
               </text>
               <view class="overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5
                            dark:border-hairline dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
                  @if (person().phone; as phone) {
                     <pressable accessibilityRole="button"
                        [accessibilityLabel]="'Teléfono ' + phone"
                        accessibilityHint="Llama a este número"
                        (press)="open('tel:' + phone)"
                        class="min-h-14 flex-row items-center gap-3 px-4 py-2 transition-colors
                               hover:bg-neutral-100 dark:hover:bg-neutral-800">
                        <view class="size-8 items-center justify-center rounded-md bg-control dark:bg-neutral-800">
                           <ng-icon name="lucidePhone" [size]="18" class="text-ink-muted dark:text-neutral-300" />
                        </view>
                        <text class="flex-1 text-base tabular-nums text-black dark:text-neutral-50">{{ phone }}</text>
                     </pressable>
                  }
                  @if (person().phone && person().email) {
                     <!-- Inset to the text, past the icon tile, as iOS insets a grouped list's divider. -->
                     <view class="ml-15 h-hairline bg-neutral-200 dark:bg-neutral-800"></view>
                  }
                  @if (person().email; as email) {
                     <pressable accessibilityRole="button"
                        [accessibilityLabel]="'Correo ' + email"
                        accessibilityHint="Escribe un correo"
                        (press)="open('mailto:' + email)"
                        class="min-h-14 flex-row items-center gap-3 px-4 py-2 transition-colors
                               hover:bg-neutral-100 dark:hover:bg-neutral-800">
                        <view class="size-8 items-center justify-center rounded-md bg-control dark:bg-neutral-800">
                           <ng-icon name="lucideMail" [size]="18" class="text-ink-muted dark:text-neutral-300" />
                        </view>
                        <text class="flex-1 text-base text-black dark:text-neutral-50">{{ email }}</text>
                     </pressable>
                  }
               </view>
            </view>
         }

         <view class="overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5
                      dark:border-hairline dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
            <pressable accessibilityRole="button"
               accessibilityHint="Pide confirmación. No se puede deshacer"
               (press)="confirmDelete()"
               class="min-h-14 flex-row items-center gap-3 px-4 py-2 transition-colors
                      hover:bg-neutral-100 dark:hover:bg-neutral-800">
               <view class="size-8 items-center justify-center rounded-md bg-brand/10 dark:bg-brand-light/15">
                  <ng-icon name="lucideTrash2" [size]="18" class="text-brand dark:text-brand-light" />
               </view>
               <text class="flex-1 text-base text-brand dark:text-brand-light">Eliminar persona</text>
            </pressable>
         </view>

         @if (android) {
            <tab-safe-area-view [edges]="['bottom']" />
         }
         @if (confirmingDelete()) {
            <!-- Android's confirmation: Material 3's dialog, as in Ajustes. iOS keeps its own alert. -->
            <ui-host
               [matchContents]="true"
               [attr.colorScheme]="scheme.current()"
               [attr.seedColor]="brandSeed"
            >
               <ui-alert (dismiss)="confirmingDelete.set(false)">
                  <ui-slot name="title"><ui-text [text]="deleteTitle()" /></ui-slot>
                  <ui-slot name="text"><ui-text [text]="deleteMessage" /></ui-slot>
                  <ui-slot name="confirmButton">
                     <ui-text-button [colors]="destructiveButton()" (press)="delete()">
                        <ui-text text="Eliminar" />
                     </ui-text-button>
                  </ui-slot>
                  <ui-slot name="dismissButton">
                     <ui-text-button (press)="confirmingDelete.set(false)">
                        <ui-text text="Cancelar" />
                     </ui-text-button>
                  </ui-slot>
               </ui-alert>
            </ui-host>
         }
      </scroll-view>
      <app-bar title="Ficha" [largeTitle]="false" [tabBarHidden]="true">
         <pressable
            appBarRight
            accessibilityRole="button"
            accessibilityLabel="Editar persona"
            class="size-11 android:size-12 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            (press)="edit()"
         >
            <ng-icon name="lucidePencil" class="text-black dark:text-neutral-50" size="22"/>
         </pressable>
      </app-bar>
   `,
   host: { style: 'flex: 1' },
})

export class PersonScreen{
   private readonly navigation = inject(NativeNavigation);
   private readonly dialogs = inject(Dialogs);
   private readonly links = inject(DeepLinks);
   private readonly clipboard = inject(Clipboard);
   private readonly haptics = inject(Haptics);
   private readonly accessibility = inject(Accessibility);
   protected readonly scheme = inject(ColorScheme);
   protected readonly android = nativePlatform() === 'android';
   /** The brand crimson (--color-brand in styles.css): Compose derives the dialog's palette from it. */
   protected readonly brandSeed = '#d70032';

   readonly id = input<string>();

   // TODO: look the person up by id once there is a store; until then every id shows this sample.
   protected readonly person = signal<PersonModel>(SAMPLE_PERSON);

   protected readonly bloodType = computed(() => bloodTypeGlyph(this.person().bloodTypeCode));
   protected readonly spokenBlood = computed(() => spokenBloodType(this.person().bloodTypeCode));
   protected readonly groupedDni = computed(() => groupDni(this.person().dni));
   protected readonly spokenDni = computed(() => [...this.person().dni.trim()].join(' '));

   /** Whether the cédula was just copied: the row says so for a moment, then offers to copy again. */
   protected readonly copied = signal(false);
   private copiedTimer?: ReturnType<typeof setTimeout>;

   protected async copyDni(): Promise<void> {
      await this.clipboard.write(this.person().dni.trim());
      this.haptics.notify('success');
      this.accessibility.announce('Cédula copiada');
      this.copied.set(true);
      clearTimeout(this.copiedTimer);
      this.copiedTimer = setTimeout(() => this.copied.set(false), COPIED_MS);
   }

   protected open(url: string): void {
      this.links.open(url);
   }

   protected edit(): void {
      void this.navigation.push(['/home/person', this.person().id.toString(), 'edit']);
   }

   /** Whether Android's Material 3 confirmation is open. */
   protected readonly confirmingDelete = signal(false);
   protected readonly deleteTitle = computed(() => `¿Eliminar a ${this.person().name}?`);
   protected readonly deleteMessage = 'Se borrarán su tipo de sangre, su cédula y su contacto de este teléfono. No se puede deshacer.';
   /** The confirming button in the brand's crimson; brand-light where the dialog is dark. */
   protected readonly destructiveButton = computed<UiButtonColors>(() => ({
      contentColor: this.scheme.current() === 'dark' ? '#ff5c7a' : '#d70032',
   }));

   protected async confirmDelete(): Promise<void> {
      if (this.android) {
         // The system's AlertDialog on Android is AppCompat's, which predates Material 3.
         this.confirmingDelete.set(true);
         return;
      }
      const sure = await this.dialogs.confirm(this.deleteTitle(), {
         message: this.deleteMessage,
         confirm: 'Eliminar',
         cancel: 'Cancelar',
         destructive: true,
      });
      if (sure) this.delete();
   }

   protected delete(): void {
      this.confirmingDelete.set(false);
      // TODO: remove the person from the store once persistence exists; for now it only goes back.
      this.navigation.back();
   }
}

const COPIED_MS = 2000;

const SAMPLE_PERSON: PersonModel = {
   id: '3',
   bloodTypeCode: 'AB-',
   name: 'Pablo Mesias',
   lastName: 'Gutierrez Urgiles',
   dni: '0105566038',
   phone: '0991234567',
   email: 'pablo.gutierrez@example.com',
};

/** 3-3-4, the way a 10-digit cédula is read aloud at a desk; anything else is shown as typed. */
export const groupDni = (dni: string) => {
   const digits = dni.trim();
   return /^\d{10}$/.test(digits) ? `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}` : digits;
};
