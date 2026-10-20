import { Routes } from '@angular/router';
export const routes: Routes = [
   {
      path: '',
      loadComponent: () => import('./shared/tabs.shared').then( m => m.TabsMenu ),
      children: [
         {
            path: '',
            pathMatch: 'full',
            redirectTo: 'home',
         },
         {
            path: 'home',
            loadComponent: () => import('./home/home.stack').then( m => m.HomeStack ),
            children: [
               {
                  path: '',
                  loadComponent: () => import('./home/screens/home.screen').then( m => m.HomeScreen ),
               }
            ]
         },
         {
            path: 'settings',
            loadComponent: () => import('./settings/settings.stack').then( m => m.SettingsStack ),
            children: [
               {
                  path:'',
                  loadComponent: () => import('./settings/screens/settings.screen').then( m => m.SettingsScreen ),
               }
            ]
         }
      ],
   }
];