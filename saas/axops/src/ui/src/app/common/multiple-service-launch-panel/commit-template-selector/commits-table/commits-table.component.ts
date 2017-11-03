import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ax-commits-table',
    templateUrl: './commits-table.html',
})
export class CommitsTableComponent {
    @Input()
    public commits: {name: string, url: string, selected: boolean}[];

    @Input()
    public search: string;

    @Input()
    public loadData: boolean = false;

    @Input()
    public isLoadMoreBtnVisible: boolean = true;

    @Output()
    public onSelect: EventEmitter<any> = new EventEmitter();

    @Output()
    public onGetMoreCommits: EventEmitter<any> = new EventEmitter();

    public selectCommit(branch: {name: string, url: string, selected: boolean}) {
        this.onSelect.emit(branch);
    }

    public getMoreCommits() {
        this.onGetMoreCommits.emit();
    }
}
