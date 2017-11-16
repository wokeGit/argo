// import * as moment from 'moment';
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { Subject, Subscription, Observable } from 'rxjs';
//
// import { DropdownMenuSettings, SlidingPanelService, DateRange } from 'argo-ui-lib/src/components';
// import { GlobalSearchSetting, LaunchPanelService, MultipleServiceLaunchPanelComponent } from '../../common';
// import {
//     NotificationService,
//     PlaygroundInfoService,
//     ViewPreferencesService,
//     AuthenticationService,
// } from '../../services';
// import { Task, Application } from '../../model';
//
export interface LayoutSettings {
    hasExtendedBg?: boolean;
    hiddenToolbar?: boolean;
    pageTitle?: string;
    pageTitleIcon?: string;
    breadcrumb?: { title: string, routerLink?: any[] }[];
    searchString?: string;
    globalAddAction?: () => void;
    globalAddActionMenu?: DropdownMenuSettings;
    branchNavPanelUrl?: string;
    globalSearch?: Subject<GlobalSearchSetting>;
    layoutDateRange?: {
        data: DateRange;
        onApplySelection: (any) => void;
        isAllDates?: boolean;
    };
    toolbarFilters?: {
        data: {
            name: string;
            value: string;
            icon?: {
                className?: string;
                color?: string; // 'success' | 'fail' | 'running' | 'queued';
            };
            hasSeparator?: boolean;
        }[];
        model: string[];
        onChange: (any) => void;
    };
    hasTabs?: boolean;
    customStickyPanelHeight?: number;
}

export interface HasLayoutSettings {
    layoutSettings: LayoutSettings;
}

@Component({
    selector: 'app-layout',
    templateUrl: './layout.html',
    styles: [ './layout.scss' ],
})
export class LayoutComponent {
    @ViewChild(RouterOutlet)
    public routerOutlet: RouterOutlet;
    // @ViewChild(MultipleServiceLaunchPanelComponent)
    // public multipleServiceLaunchPanel: MultipleServiceLaunchPanelComponent;
    // public globalSearch: GlobalSearchSetting;
    // public hiddenScrollbar: boolean;
    // public openedPanelOffCanvas: boolean;
    // public repos: string[] = [];
    // public reposLoaded: boolean;
    // public showNotificationsCenter: boolean;
    // public mostRecentEventTime: moment.Moment = moment.unix(0);
    // public mostRecentNotificationsViewTime: moment.Moment = moment.unix(0);
    public openedNav: boolean;
    // public branchNavPanelOpened = false;

    private subscriptions: Subscription[] = [];

    constructor(
            // private launchPanelService: LaunchPanelService,
    //         private slidingPanelService: SlidingPanelService,
    //         private playgroundInfoService: PlaygroundInfoService,
    //         private notificationService: NotificationService,
    //         private viewPreferencesService: ViewPreferencesService,
    //         private authenticationService: AuthenticationService
    ) {
    //
    //     this.subscriptions.push(this.slidingPanelService.panelOpened.subscribe(
    //         isHidden => setTimeout(() => this.hiddenScrollbar = isHidden)));
    //
    //     this.subscriptions.push(this.slidingPanelService.panelOffCanvasOpened.subscribe(
    //         openedPanelOffCanvas => setTimeout(() => this.openedPanelOffCanvas = openedPanelOffCanvas),
    //     ));
    //
    //
    //     this.authenticationService.getCurrentUser().then(user => {
    //         this.subscriptions.push(Observable.merge(
    //             this.notificationService.getEventsStream(user.username),
    //                 Observable.fromPromise(this.notificationService.getEvents({ limit: 1, recipient: user.username })).filter(events => events.length > 0).map(events => events[0])
    //             ).subscribe(event => {
    //                 this.mostRecentEventTime = moment(event.timestamp / 1000);
    //             }));
    //     });
    //
    //     this.subscriptions.push(Observable.merge(
    //         Observable.fromPromise(viewPreferencesService.getViewPreferences()),
    //         viewPreferencesService.onPreferencesUpdated.asObservable(),
    //     ).subscribe(viewPreferences => {
    //         this.mostRecentNotificationsViewTime = moment.unix(viewPreferences.mostRecentNotificationsViewTime || 0);
    //     }));
    }

    public get layoutSettings(): LayoutSettings {
        let component: any = this.routerOutlet.isActivated ? this.routerOutlet.component : null;
        return component ? component.layoutSettings || {} : {};
    }

    // public ngOnInit() {
    //     this.launchPanelService.initPanel(this.multipleServiceLaunchPanel);
    // }

    public ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }

    // public openBranchNavPanel() {
    //     this.branchNavPanelOpened = true;
    // }
    //
    // public closeBranchNavPanel() {
    //     this.branchNavPanelOpened = false;
    // }
    //
    // public toggleNotificationsCenter(status: boolean) {
    //     this.showNotificationsCenter = status;
    //     if (this.showNotificationsCenter) {
    //         this.viewPreferencesService.updateViewPreferences(viewPreferences => {
    //             viewPreferences.mostRecentNotificationsViewTime = moment.utc().unix();
    //         });
    //     }
    // }

    public toggleNav(status?: boolean) {
        this.openedNav = typeof status !== 'undefined' ? status : !this.openedNav;
    }

    // public get animateNotificationIcon(): boolean {
    //     return this.mostRecentEventTime.isAfter(this.mostRecentNotificationsViewTime);
    // }
}
