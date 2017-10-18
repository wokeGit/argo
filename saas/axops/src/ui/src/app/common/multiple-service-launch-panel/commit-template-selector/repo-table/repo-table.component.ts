import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ax-repo-table',
    templateUrl: './repo-table.html',
    styles: [ require('./repo-table.scss') ],
})
export class RepoTableComponent {
    @Input()
    public repos: {name: string, url: string, selected: boolean}[];

    @Input()
    public search: string;

    @Input()
    public loadData: boolean = false;

    @Output()
    public onSelect: EventEmitter<any> = new EventEmitter();

    public selectRepo(repo: {name: string, url: string, selected: boolean}) {
        this.onSelect.emit(repo);
    }
}
