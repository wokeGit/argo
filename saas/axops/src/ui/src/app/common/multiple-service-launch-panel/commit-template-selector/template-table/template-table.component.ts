import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ax-template-table',
    templateUrl: './template-table.html',
    styles: [ require('./template-table.scss') ],
})
export class TemplateTableComponent {
    @Input()
    public templates: {name: string, url: string, selected: boolean}[];

    @Input()
    public search: string;

    @Input()
    public loadData: boolean = false;

    @Output()
    public onSelect: EventEmitter<any> = new EventEmitter();

    public selectTemplate(branch: {name: string, url: string, selected: boolean}) {
        this.onSelect.emit(branch);
    }
}
