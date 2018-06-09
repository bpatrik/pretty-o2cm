"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var tooltip_1 = require("ngx-bootstrap/tooltip");
var angular_gauge_1 = require("angular-gauge");
var app_component_1 = require("./app.component");
var style_panel_component_1 = require("./summary/style-pannel/style-panel.component");
var data_service_1 = require("./services/data.service");
var entry_style_panel_component_1 = require("./summary/style-pannel/entry/entry.style-panel.component");
var http_1 = require("@angular/common/http");
var summary_component_1 = require("./summary/summary.component");
var competition_event_list_component_1 = require("./list/competition/competition.event-list.component");
var event_list_component_1 = require("./list/event-list.component");
var event_competition_list_component_1 = require("./list/competition/event/event.competition.list.component");
var app_routing_1 = require("./app.routing");
var frame_component_1 = require("./frame/frame.component");
var ng2_slim_loading_bar_1 = require("ng2-slim-loading-bar");
var cache_service_1 = require("./services/cache.service");
var loading_frame_component_1 = require("./frame/loading/loading.frame.component");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var forms_1 = require("@angular/forms");
var data_loader_service_1 = require("./services/data-loader.service");
var competitors_component_1 = require("./competitors/competitors.component");
var panel_competitors_component_1 = require("./competitors/panel/panel.competitors.component");
var event_component_1 = require("./event/event.component");
var compare_component_1 = require("./compare/compare.component");
var registration_component_1 = require("./registration/registration.component");
var registration_service_1 = require("./services/registration.service");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                summary_component_1.SummaryComponent,
                style_panel_component_1.StylePanelComponent,
                entry_style_panel_component_1.StylePanelEntryComponent,
                event_list_component_1.EventListComponent,
                competition_event_list_component_1.CompetitionEventListComponent,
                event_competition_list_component_1.CompetitionEventComponent,
                frame_component_1.FrameComponent,
                loading_frame_component_1.LoadingFrameComponent,
                competitors_component_1.CompetitorsComponent,
                panel_competitors_component_1.CompetitorsPanelComponent,
                event_component_1.EventComponent,
                compare_component_1.CompareComponent,
                registration_component_1.RegistrationComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpClientModule,
                app_routing_1.appRoutes,
                tooltip_1.TooltipModule.forRoot(),
                angular_gauge_1.GaugeModule.forRoot(),
                ng2_slim_loading_bar_1.SlimLoadingBarModule.forRoot(),
                ngx_bootstrap_1.ProgressbarModule.forRoot(),
            ],
            providers: [data_service_1.DataService, cache_service_1.CacheService, data_loader_service_1.DataParserService, registration_service_1.RegistrationService],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map