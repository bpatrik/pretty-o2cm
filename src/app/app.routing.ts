import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SummaryComponent} from './summary/summary.component';
import {EventListComponent} from './list/event-list.component';
import {CompetitorsComponent} from './competitors/competitors.component';
import {EventComponent} from './event/event.component';
import {CompareComponent} from './compare/compare.component';

const ROUTES: Routes = [
  {
    path: 'summary',
    component: SummaryComponent
  },
  {
    path: 'list',
    component: EventListComponent
  },
  {
    path: 'competitors',
    component: CompetitorsComponent
  },
  {
    path: 'event',
    component: EventComponent
  },
  {
    path: 'compare',
    component: CompareComponent
  },
  {path: '', redirectTo: '/summary', pathMatch: 'full'},
  {path: '**', redirectTo: '/summary', pathMatch: 'full'}
];

export const appRoutes: ModuleWithProviders = RouterModule.forRoot(ROUTES);

