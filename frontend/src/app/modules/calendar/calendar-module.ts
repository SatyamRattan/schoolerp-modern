import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarRoutingModule } from './calendar-routing-module';
import { CalendarViewComponent } from './pages/calendar-view/calendar-view';

@NgModule({
  imports: [
    CommonModule,
    CalendarRoutingModule,
    CalendarViewComponent
  ]
})
export class CalendarModule { }
