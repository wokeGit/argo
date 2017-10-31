import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ax-branch-table',
    templateUrl: './branch-table.html',
})
export class BranchTableComponent {
    @Input()
    public branches: {name: string, url: string, selected: boolean}[];

    @Input()
    public search: string;

    @Input()
    public loadData: boolean = false;

    @Output()
    public onSelect: EventEmitter<any> = new EventEmitter();

    public selectBranch(branch: {name: string, url: string, selected: boolean}) {
        this.onSelect.emit(branch);
    }
}
