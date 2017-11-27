import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'ax-loader-list-mockup',
    templateUrl: './loader-list-mockup.html',
    styleUrls: [ './loader-list-mockup.scss' ],
})
export class LoaderListMockupComponent implements OnInit {
    public itemsList: any[] = [];

    @Input()
    public itemHeight = 60;

    @Input()
    public itemOpacity = 0.3;

    @Input()
    public marginLeft = 0;

    @Input()
    public marginRight = 0;

    @Input()
    public itemGap = 8;

    @Input()
    public itemsLength: number;

    @Input()
    public customClass: string;

    @Input()
    public noMarginTop = false;

    public ngOnInit() {
        if (!this.itemsLength) {
            // count how many loader template elements we need to fill full screen
            for (let i = 0; i < window.innerHeight / this.itemHeight; i++) { // 60 is height of single element
                this.itemsList.push('');
            }
        } else {
            for (let i = 0; i < this.itemsLength; i++) {
                this.itemsList.push('');
            }
        }
    }
}
