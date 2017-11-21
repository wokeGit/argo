import { Component, Input, OnChanges, SimpleChange, EventEmitter, Output, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// import { ContentService, SystemService, GlobalSearchService, AuthenticationService } from '../../../services';
// import { User } from '../../../model';
// import { GLOBAL_SEARCH_TABS, GlobalSearchSetting } from '../../../common';

@Component({
    selector: 'ax-top-bar',
    templateUrl: './top-bar.html',
    styleUrls: [ './top-bar.component.scss' ],
})
export class TopBarComponent {

    public isGlobalSearchVisible: boolean;
    // public releaseNotesUrl: string = '';
    // public isPlayground = false;
    // public userObj: User;

    // constructor(
    //     private contentService: ContentService,
    //     private systemService: SystemService,
    //     private globalSearchService: GlobalSearchService,
    //     private authenticationService: AuthenticationService) {}
    //
    // public ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    //     if (changes && changes.hasOwnProperty('settings')) {
    //         if (this.settings.pageTitle) {
    //             document.title = 'Argo | ' + this.settings.pageTitle;
    //         } else {
    //             document.title = 'Argo';
    //         }
    //
    //         // if there is no local or global search add default search same as /jobs page
    //         if (!this.settings.hasOwnProperty ('globalSearch')) {
    //             this.settings.globalSearch = new BehaviorSubject<GlobalSearchSetting>({
    //                 suppressBackRoute: false,
    //                 keepOpen: false,
    //                 searchCategory: GLOBAL_SEARCH_TABS.JOBS.name,
    //                 hideSearchHistoryAndSuggestions: true,
    //             });
    //         }
    //     }
    // }
    //
    // public openNotificationsCenter() {
    //     this.onOpenNotificationsCenter.emit(null);
    // }
    //
    // public doSignOut() {
    //     this.authenticationService.logout();
    // }
}
