import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight, Plus, Info } from 'lucide-angular';
import { CalendarService, CalendarEvent } from '../../services/calendar';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './calendar-view.html',
  styleUrls: ['./calendar-view.css']
})
export class CalendarViewComponent implements OnInit {
  currentDate = new Date();
  calendarDays: any[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  events: CalendarEvent[] = [];
  loading = false;

  readonly leftIcon = ChevronLeft;
  readonly rightIcon = ChevronRight;
  readonly plusIcon = Plus;
  readonly infoIcon = Info;

  get currentMonth() { return this.currentDate.getMonth(); }
  get currentYear() { return this.currentDate.getFullYear(); }

  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    this.loading = true;
    const year = this.currentYear;
    const month = this.currentMonth;

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41);

    this.calendarService.getEvents(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    ).subscribe({
      next: (data) => {
        this.events = data;
        this.buildDays(startDate);
        this.loading = false;
      },
      error: () => {
        this.buildDays(startDate);
        this.loading = false;
      }
    });
  }

  buildDays(startDate: Date) {
    this.calendarDays = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const dayEvents = this.events.filter(event => {
        const eventDate = new Date(event.start_date);
        return date.getDate() === eventDate.getDate() &&
          date.getMonth() === eventDate.getMonth() &&
          date.getFullYear() === eventDate.getFullYear();
      });

      this.calendarDays.push({
        day: date.getDate(),
        date: date,
        currentMonth: date.getMonth() === this.currentMonth,
        isToday: date.getTime() === today.getTime(),
        events: dayEvents
      });
    }
  }

  previousMonth() {
    this.currentDate = new Date(this.currentYear, this.currentMonth - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentYear, this.currentMonth + 1, 1);
    this.generateCalendar();
  }

  getEventColor(type: string): string {
    switch (type) {
      case 'holiday': return '#ef4444';
      case 'exam': return '#f59e0b';
      case 'event': return '#435ebe';
      case 'meeting': return '#10b981';
      default: return '#64748b';
    }
  }

  getEventColorLight(type: string): string {
    switch (type) {
      case 'holiday': return '#fee2e2';
      case 'exam': return '#fef3c7';
      case 'event': return '#eef2ff';
      case 'meeting': return '#dcfce7';
      default: return '#f1f5f9';
    }
  }

  openEventWizard() {
    alert("Opening School Event Wizard...");
  }
}
