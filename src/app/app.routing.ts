import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SummaryComponent} from './summary/summary.component';
import {EventListComponent} from './events-list/event-list.component';

const ROUTES: Routes = [
  {
    path: 'summary',
    component: SummaryComponent
  },
  {
    path: 'list',
    component: EventListComponent
  },
  {path: '', redirectTo: '/summary', pathMatch: 'full'},
  {path: '**', redirectTo: '/summary', pathMatch: 'full'}
];

export const appRoutes: ModuleWithProviders = RouterModule.forRoot(ROUTES);

