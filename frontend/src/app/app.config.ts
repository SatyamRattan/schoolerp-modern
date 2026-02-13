import { ApplicationConfig, provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { LucideAngularModule, LayoutDashboard, Users, UserCheck, CreditCard, BookOpen, Settings, LogOut, Search, Bell, User, GraduationCap, DollarSign, CalendarCheck } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      LucideAngularModule.pick({
        LayoutDashboard, Users, UserCheck, CreditCard, BookOpen, Settings, LogOut,
        Search, Bell, User, GraduationCap, DollarSign, CalendarCheck
      })
    )
  ]
};
