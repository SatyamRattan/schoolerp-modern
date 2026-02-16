import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, MessageSquare, Plus, ArrowLeft } from 'lucide-angular';

import { ThreadListComponent } from './pages/thread-list/thread-list.component';
import { ThreadDetailComponent } from './pages/thread-detail/thread-detail.component';
import { CreateThreadComponent } from './pages/create-thread/create-thread.component';
import { DiscussionService } from './services/discussion.service';

const routes: Routes = [
  { path: '', component: ThreadListComponent },
  { path: 'create', component: CreateThreadComponent },
  { path: ':id', component: ThreadDetailComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({ MessageSquare, Plus, ArrowLeft }),
    ThreadListComponent,
    ThreadDetailComponent,
    CreateThreadComponent
  ],
  providers: [DiscussionService]
})
export class DiscussionModule { }
