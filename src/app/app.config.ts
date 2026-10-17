import { provideNativeRouter } from "@ng-native/router";
import { withComponentInputBinding } from "@angular/router";
import tailwind from '../../.angular-native/app.tailwind.js';
import { routes } from "./app.routes";

export const appConfig = {
   globalStyles: tailwind,
   providers: [
      provideNativeRouter( routes, withComponentInputBinding() ),
   ],
};