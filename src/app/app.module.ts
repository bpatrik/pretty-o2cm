import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {GaugeModule} from 'angular-gauge';
import {AppComponent} from './app.component';
import {StylePanelComponent} from './summary/style-pannel/style-panel.component';
import {DataService} from './services/data.service';
import {StylePanelEntryComponent} from './summary/style-pannel/entry/entry.style-panel.component';
import {HttpClientModule} from '@angular/common/http';
import {SummaryComponent} from './summary/summary.component';
import {CompetitionEventListComponent} from './list/competition/competition.event-list.component';
import {EventListComponent} from './list/event-list.component';
import {CompetitionEventComponent} from './list/competition/event/event.competition.list.component';
import {appRoutes} from './app.routing';
import {FrameComponent} from './frame/frame.component';
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';
import {CacheService} from './services/cache.service';
import {LoadingFrameComponent} from './frame/loading/loading.frame.component';
import {ProgressbarModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {DataParserService} from './services/data-loader.service';
import {CompetitorsComponent} from './competitors/competitors.component';
import {CompetitorsPanelComponent} from './competitors/panel/panel.competitors.component';
import {EventComponent} from './event/event.component';
import {CompareComponent} from './compare/compare.component';

@NgModule({
  declarations: [
    AppComponent,
    SummaryComponent,
    StylePanelComponent,
    StylePanelEntryComponent,
    EventListComponent,
    CompetitionEventListComponent,
    CompetitionEventComponent,
    FrameComponent,
    LoadingFrameComponent,
    CompetitorsComponent,
    CompetitorsPanelComponent,
    EventComponent,
    CompareComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    appRoutes,
    TooltipModule.forRoot(),
    GaugeModule.forRoot(),
    SlimLoadingBarModule.forRoot(),
    ProgressbarModule.forRoot(),
  ],
  providers: [DataService, CacheService, DataParserService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
