import { Component, computed, inject, input, OnInit, signal } from "@angular/core";
import { email, FieldTree, form, FormField, maxLength, pattern, required, submit } from "@angular/forms/signals";
import { KeyboardAvoidingView, Pressable, ScrollView, Text, TextInput, View } from "@ng-native/components";
import { NgIcon } from "@ng-native/icons";
import { Accessibility, ColorScheme } from "@ng-native/device";
import { Haptics } from "@ng-native/expo/haptics";
import { nativePlatform } from "@ng-native/fabric";
import { NativeNavigation, TabSafeAreaView } from "@ng-native/router";
import { AppBar } from "../../shared/appbar.shared";
import { bloodTypeGlyph, spokenBloodType } from "../components/person-list";
import { PersonField } from "../components/person-field";
import { NewPersonModel, PersonModel } from "../model/person.model";
import { PersonRepository } from "../data/person.repository";

@Component({
   selector: 'person-form-screen',
   imports: [
      View, ScrollView, KeyboardAvoidingView, Text, TextInput, Pressable, NgIcon, FormField,
      AppBar, TabSafeAreaView, PersonField,
   ],
   template:`
      <keyboard-avoiding-view class="flex-1 bg-neutral-100 dark:bg-neutral-950">
         <scroll-view
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="handled"
            class="flex-1"
            contentContainerClass="grow gap-8 px-6 pt-4 min-pb-safe-8"
         >
            <view class="gap-2">
               <text accessibilityRole="header"
                  class="px-4 text-xs font-medium uppercase tracking-wide text-ink-muted dark:text-neutral-300">
                  Identidad
               </text>
               <view class="gap-3 rounded-xl bg-white p-4 shadow-lg shadow-slate-900/5
                            dark:border-hairline dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
                  <person-field icon="lucideUser" [focused]="focused() === 'name'" [error]="errorOf(person.name)">
                     <text-input #name
                        [formField]="person.name"
                        accessibilityLabel="Nombres"
                        placeholder="Nombres"
                        autoCapitalize="words"
                        textContentType="givenName"
                        autoComplete="given-name"
                        returnKeyType="next"
                        submitBehavior="submit"
                        (submitEditing)="lastName.focus()"
                        (focus)="focused.set('name')"
                        (blur)="focused.set(null)"
                        [placeholderTextColor]="placeholderColor()"
                        [selectionColor]="caretColor()"
                        class="flex-1 py-3 text-base text-black dark:text-neutral-50"
                     />
                  </person-field>
                  <person-field icon="lucideUser" [focused]="focused() === 'lastName'" [error]="errorOf(person.lastName)">
                     <text-input #lastName
                        [formField]="person.lastName"
                        accessibilityLabel="Apellidos"
                        placeholder="Apellidos"
                        autoCapitalize="words"
                        textContentType="familyName"
                        autoComplete="family-name"
                        returnKeyType="next"
                        submitBehavior="submit"
                        (submitEditing)="dni.focus()"
                        (focus)="focused.set('lastName')"
                        (blur)="focused.set(null)"
                        [placeholderTextColor]="placeholderColor()"
                        [selectionColor]="caretColor()"
                        class="flex-1 py-3 text-base text-black dark:text-neutral-50"
                     />
                  </person-field>
                  <person-field icon="lucideIdCard" [focused]="focused() === 'dni'" [error]="errorOf(person.dni)">
                     <text-input #dni
                        [formField]="person.dni"
                        accessibilityLabel="Cédula"
                        placeholder="Cédula (10 dígitos)"
                        keyboardType="number-pad"
                        returnKeyType="next"
                        submitBehavior="submit"
                        (submitEditing)="phone.focus()"
                        (focus)="focused.set('dni')"
                        (blur)="focused.set(null)"
                        [placeholderTextColor]="placeholderColor()"
                        [selectionColor]="caretColor()"
                        class="flex-1 py-3 text-base tabular-nums text-black dark:text-neutral-50"
                     />
                  </person-field>
               </view>
            </view>

            <view class="gap-2">
               <text accessibilityRole="header"
                  class="px-4 text-xs font-medium uppercase tracking-wide text-ink-muted dark:text-neutral-300">
                  Tipo de sangre
               </text>
               <view class="gap-1.5 rounded-xl bg-white p-4 shadow-lg shadow-slate-900/5
                            dark:border-hairline dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
                  <view accessibilityRole="radiogroup" accessibilityLabel="Tipo de sangre" class="gap-2">
                     @for (row of bloodRows(); track $index) {
                        <view class="flex-row gap-2">
                           @for (type of row; track type) {
                              <pressable
                                 accessibilityRole="radio"
                                 [accessibilityLabel]="spoken(type)"
                                 [accessibilityState]="{ checked: data().bloodTypeCode === type }"
                                 (press)="chooseBlood(type)"
                                 [class]="data().bloodTypeCode === type
                                    ? 'border-red-700 bg-red-100 dark:border-red-300 dark:bg-red-900/40'
                                    : 'border-transparent bg-control hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700'"
                                 class="min-h-14 flex-1 items-center justify-center rounded-xl border-2 transition-colors"
                              >
                                 <text
                                    [class]="data().bloodTypeCode === type ? 'text-red-700 dark:text-red-300' : 'text-black dark:text-neutral-50'"
                                    class="text-xl font-semibold"
                                 >{{ glyph(type) }}</text>
                                 @if (data().bloodTypeCode === type) {
                                    <view class="absolute top-1 right-1">
                                       <ng-icon name="lucideCheck" [size]="14" class="text-red-700 dark:text-red-300" />
                                    </view>
                                 }
                              </pressable>
                           }
                        </view>
                     }
                  </view>
                  @if (errorOf(person.bloodTypeCode); as message) {
                     <view class="flex-row items-center gap-1.5 px-1 pt-1">
                        <ng-icon name="lucideCircleAlert" [size]="14" class="text-brand dark:text-brand-light" />
                        <text accessibilityRole="alert" class="flex-1 text-sm text-brand dark:text-brand-light">{{ message }}</text>
                     </view>
                  }
               </view>
            </view>

            <view class="gap-2">
               <text accessibilityRole="header"
                  class="px-4 text-xs font-medium uppercase tracking-wide text-ink-muted dark:text-neutral-300">
                  Contacto (opcional)
               </text>
               <view class="gap-3 rounded-xl bg-white p-4 shadow-lg shadow-slate-900/5
                            dark:border-hairline dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
                  <person-field icon="lucidePhone" [focused]="focused() === 'phone'" [error]="errorOf(person.phone)">
                     <text-input #phone
                        [formField]="person.phone"
                        accessibilityLabel="Teléfono"
                        placeholder="Teléfono"
                        keyboardType="phone-pad"
                        textContentType="telephoneNumber"
                        autoComplete="tel"
                        returnKeyType="next"
                        submitBehavior="submit"
                        (submitEditing)="mail.focus()"
                        (focus)="focused.set('phone')"
                        (blur)="focused.set(null)"
                        [placeholderTextColor]="placeholderColor()"
                        [selectionColor]="caretColor()"
                        class="flex-1 py-3 text-base tabular-nums text-black dark:text-neutral-50"
                     />
                  </person-field>
                  <person-field icon="lucideMail" [focused]="focused() === 'email'" [error]="errorOf(person.email)">
                     <text-input #mail
                        [formField]="person.email"
                        accessibilityLabel="Correo"
                        placeholder="Correo"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        [autoCorrect]="false"
                        textContentType="emailAddress"
                        autoComplete="email"
                        returnKeyType="done"
                        (focus)="focused.set('email')"
                        (blur)="focused.set(null)"
                        [placeholderTextColor]="placeholderColor()"
                        [selectionColor]="caretColor()"
                        class="flex-1 py-3 text-base text-black dark:text-neutral-50"
                     />
                  </person-field>
               </view>
               <text class="px-4 text-sm text-ink-muted dark:text-neutral-300">Solo se guarda en este teléfono.</text>
            </view>

            <pressable
               accessibilityRole="button"
               [disabled]="person().submitting()"
               (press)="save()"
               class="min-h-13 items-center justify-center rounded-full bg-brand px-6 transition-colors hover:bg-brand-pressed"
            >
               <text class="text-base font-medium text-white">{{ editing() ? 'Guardar cambios' : 'Guardar' }}</text>
            </pressable>

            @if (android) {
               <tab-safe-area-view [edges]="['bottom']" />
            }
         </scroll-view>
      </keyboard-avoiding-view>
      <app-bar [title]="editing() ? 'Editar persona' : 'Nueva persona'" [largeTitle]="false" [tabBarHidden]="true" />
   `,
   host: { style: 'flex: 1' },
})

export class PersonFormScreen implements OnInit {
   private readonly navigation = inject(NativeNavigation);
   private readonly haptics = inject(Haptics);
   private readonly accessibility = inject(Accessibility);
   private readonly scheme = inject(ColorScheme);
   private readonly repository = inject(PersonRepository);
   protected readonly android = nativePlatform() === 'android';

   readonly id = input<string>();

   protected readonly editing = computed(() => !!this.id());

   protected readonly data = signal<PersonFormModel>({ name: '', lastName: '', dni: '', bloodTypeCode: '', phone: '', email: '' });
   protected readonly person = form(this.data, path => {
      required(path.name, { message: 'Escribe los nombres' });
      required(path.lastName, { message: 'Escribe los apellidos' });
      required(path.dni, { message: 'Escribe la cédula' });
      maxLength(path.dni, 10);
      pattern(path.dni, /^\d{10}$/, { message: 'La cédula tiene 10 dígitos' });
      required(path.bloodTypeCode, { message: 'Elige el tipo de sangre' });
      pattern(path.phone, /^\+?[\d ]{7,15}$/, { message: 'Revisa el número: solo dígitos' });
      email(path.email, { message: 'Revisa el correo' });
   });

   /** Which field has the keyboard, for its crimson ring. */
   protected readonly focused = signal<string | null>(null);

   /** Four to a row; two from the accessibility text sizes, where "AB−" no longer fits a quarter. */
   protected readonly bloodRows = computed(() => {
      const perRow = this.accessibility.fontScale() >= STACK_FONT_SCALE ? 2 : 4;
      return Array.from({ length: BLOOD_TYPES.length / perRow }, (_, i) => BLOOD_TYPES.slice(i * perRow, (i + 1) * perRow));
   });

   protected readonly placeholderColor = computed(() => this.scheme.current() === 'dark' ? '#a3a3a3' : '#6b6b6b');
   protected readonly caretColor = computed(() => this.scheme.current() === 'dark' ? '#ff5c7a' : '#d70032');

   protected readonly glyph = bloodTypeGlyph;
   protected readonly spoken = (type: string) => `Tipo de sangre ${spokenBloodType(type)}`;

   ngOnInit(): void {
      if (!this.editing()) return;
      // TODO: look the person up by id once there is a store; until then every id edits this sample.
      const { name, lastName, dni, bloodTypeCode, phone = '', email = '' } = SAMPLE_PERSON;
      this.data.set({ name, lastName, dni, bloodTypeCode, phone, email });
   }

   /** A field's first error, once the person has left it or tried to save. */
   protected errorOf(field: FieldTree<string>): string {
      const state = field();
      return state.touched() && state.invalid() ? state.errors()[0]?.message ?? '' : '';
   }

   protected chooseBlood(type: string): void {
      this.data.update(value => ({ ...value, bloodTypeCode: type }));
      this.person.bloodTypeCode().markAsTouched();
      this.haptics.select();
   }

   protected async save(): Promise<void> {
      await submit(this.person, {
         action: async () => {
            const { phone, email, ...rest } = this.data();
            await this.repository.create( {...rest, phone: phone || undefined, email: email || undefined} );
            this.haptics.notify('success');
            this.navigation.back();
         },
         onInvalid: () => this.haptics.notify('error'),
      });
   }
}

type PersonFormModel = Required<NewPersonModel>;

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const STACK_FONT_SCALE = 1.6;

const SAMPLE_PERSON: PersonModel = {
   id: '3',
   bloodTypeCode: 'AB-',
   name: 'Pablo Mesias',
   lastName: 'Gutierrez Urgiles',
   dni: '0105566038',
   phone: '0991234567',
   email: 'pablo.gutierrez@example.com',
};
