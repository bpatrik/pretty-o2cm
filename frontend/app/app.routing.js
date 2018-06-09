"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var summary_component_1 = require("./summary/summary.component");
var event_list_component_1 = require("./list/event-list.component");
var competitors_component_1 = require("./competitors/competitors.component");
var event_component_1 = require("./event/event.component");
var compare_component_1 = require("./compare/compare.component");
var registration_component_1 = require("./registration/registration.component");
var ROUTES = [
    {
        path: 'summary',
        component: summary_component_1.SummaryComponent
    },
    {
        path: 'list',
        component: event_list_component_1.EventListComponent
    },
    {
        path: 'competitors',
        component: competitors_component_1.CompetitorsComponent
    },
    {
        path: 'event',
        component: event_component_1.EventComponent
    },
    {
        path: 'registration',
        component: registration_component_1.RegistrationComponent
    },
    {
        path: 'compare',
        component: compare_component_1.CompareComponent
    },
    { path: '', redirectTo: '/summary', pathMatch: 'full' },
    { path: '**', redirectTo: '/summary', pathMatch: 'full' }
];
exports.appRoutes = router_1.RouterModule.forRoot(ROUTES);
//# sourceMappingURL=app.routing.js.map