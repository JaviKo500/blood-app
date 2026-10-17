import { provideNativeRouter } from "@ng-native/router";
import { withComponentInputBinding } from "@angular/router";

import { routes } from "./app.routes";

export const appConfig = {
   providers: [
      provideNativeRouter( routes, withComponentInputBinding() ),
   ]
};