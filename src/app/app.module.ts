import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {GaugeModule} from 'angular-gauge';
import {AppComponent} from './app.component';
import {StylePanelComponent} from "./style-pannel/style-panel.component";
import {DataService} from "./services/data.service";
import {StylePanelEntryComponent} from "./style-pannel/entry/entry.style-panel.component";
import {HttpClientModule} from '@angular/common/http';
import {SummaryComponent} from "./summary/summary.component";
import {CompetitionEventListComponent} from "./events-list/competition/competition.event-list.component";
import {EventListComponent} from "./events-list/event-list.component";
import {CompetitionEventComponent} from "./events-list/competition/event/event.competition.list.component";
import {appRoutes} from "./app.routing";
import {FrameComponent} from "./frame/frame.component";
import {SlimLoadingBarModule} from "ng2-slim-loading-bar";

@NgModule({
  declarations: [
    AppComponent,
    SummaryComponent,
    StylePanelComponent,
    StylePanelEntryComponent,
    EventListComponent,
    CompetitionEventListComponent,
    CompetitionEventComponent,
    FrameComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    appRoutes,
    TooltipModule.forRoot(),
    GaugeModule.forRoot(),
    SlimLoadingBarModule.forRoot()
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
