import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ax-branch-table',
    templateUrl: './branch-table.html',
    styles: [ require('./branch-table.scss') ],
})
export class BranchTableComponent {
    @Input()
    public branches: {name: string, url: string, selected: boolean}[];

    @Input()
    public search: string;

    @Output()
    public onSelect: EventEmitter<any> = new EventEmitter();

    public selectBranch(branch: {name: string, url: string, selected: boolean}) {
        this.onSelect.emit(branch);
    }
}
