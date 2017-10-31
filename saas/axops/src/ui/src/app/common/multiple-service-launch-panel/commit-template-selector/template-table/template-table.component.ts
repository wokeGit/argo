import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ax-template-table',
    templateUrl: './template-table.html',
})
export class TemplateTableComponent {
    public allSelected: boolean = false;

    @Input()
    public templates: {name: string, url: string, selected: boolean}[];

    @Input()
    public search: string;

    @Input()
    public loadData: boolean = false;

    @Output()
    public onSelect: EventEmitter<any> = new EventEmitter();

    public selectTemplate(template: {name: string, url: string, selected: boolean}) {
        this.onSelect.emit(template);
    }

    public selectAllTemplates() {
        this.allSelected = !this.allSelected;

        this.templates.forEach(t => {
            t.selected = this.allSelected;
        });

        if (this.allSelected) {
            this.onSelect.emit(this.templates);
        }
    }
}
