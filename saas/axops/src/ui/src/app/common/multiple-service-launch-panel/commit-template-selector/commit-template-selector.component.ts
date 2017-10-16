import { Component, OnInit } from '@angular/core';
import { RepoService } from '../../../services';

@Component({
    selector: 'ax-commit-template-selector',
    templateUrl: './commit-template-selector.html',
    styles: [ require('./commit-template-selector.scss') ],
})
export class CommitTemplateSelectorComponent implements OnInit {
    public qwe: any  = {
        repositories: [],
        branches: [],
        commits: [],
        templates: []
    };

    constructor(private repoService: RepoService) {
    }

    ngOnInit() {
        this.repoService.getReposAsync().toPromise().then(repos => {
            console.log('repos', repos);
        });
    }

    public onBrowse() {

    }
}
