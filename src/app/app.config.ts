import { provideNativeRouter, withSvgIcons } from "@ng-native/router";
import { withComponentInputBinding } from "@angular/router";
import tailwind from '../../.angular-native/app.tailwind.js';
import { SvgImages } from '@ng-native/icons';
import { provideIcons } from '@ng-icons/core';
import { 
   lucideHome, 
   lucideSettings, 
   lucideMenu, 
   lucideSearch, 
   lucideCheck, 
   lucidePlus, 
   lucideTrash2,
   lucideChevronRight,
   lucideCopy,
   lucideMail,
   lucidePencil,
   lucidePhone,
   lucideUser,
   lucideIdCard,
   lucideCircleAlert,
} from '@ng-icons/lucide';

import { routes } from "./app.routes";
import { provideDataSource } from "./core/data/provide-data-source.ts";

export const appConfig = {
   globalStyles: tailwind,
   providers: [
      provideNativeRouter( routes, withComponentInputBinding(), withSvgIcons( SvgImages ) ),
      provideDataSource('sqlite'),
      provideIcons({
         lucideHome,
         lucideMenu,
         lucideSearch,
         lucideSettings,
         lucideCheck,
         lucidePlus,
         lucideTrash2,
         lucideChevronRight,
         lucideCopy,
         lucideMail,
         lucidePencil,
         lucidePhone,
         lucideUser,
         lucideIdCard,
         lucideCircleAlert,
      }),
   ],
};