import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { RepoService } from '../../../services';

import { Template } from '../../../model';

type SelectorParts = 'repositories' | 'branches' | 'commits' | 'templates';

@Component({
    selector: 'ax-commit-template-selector',
    templateUrl: './commit-template-selector.html',
    styles: [ require('./commit-template-selector.scss') ],
})
export class CommitTemplateSelectorComponent implements OnInit {
    public selectorSteps: any  = {
        repositories: {
            isActive: true,
            active: {
                name: '',
                url: '',
            },
            messages: {
                title: 'Select a repo',
                searchInputPlaceholder: 'Search repo'
            },
            items: []
        },
        branches: {
            isActive: false,
            active: {
                name: '',
                url: '',
            },
            messages: {
                title: 'Select a branch',
                searchInputPlaceholder: 'Search branch'
            },
            items: []
        },
        commits: {
            isActive: false,
            active: {
                name: '',
                url: '',
            },
            messages: {
                title: 'Select a commit',
                searchInputPlaceholder: 'Search commit'
            },
            items: []
        },
        templates: {
            isActive: false,
            active: {
                name: '',
                url: '',
            },
            messages: {
                title: 'Select service template',
                searchInputPlaceholder: 'Search template'
            },
            items: []
        }
    };
    public activePart: SelectorParts = 'repositories';

    constructor(private repoService: RepoService) {
    }

    ngOnInit() {
        this.repoService.getReposAsync().toPromise().then(res => {
            let repositories = _.map(res.data, (repo: string) => {
                let repoSplit = repo.split('/');

                return {
                    name: repoSplit[repoSplit.length - 1],
                    url: repo
                };
            }).sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1;
                }
                if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1;
                }
                return 0;
            });

            this.selectorSteps.repositories.items = repositories;
            console.log('repos', res, repositories);
        });
    }

    public onBrowse() {

    }

    public setActiveStep(stepName: SelectorParts) {
        this.activePart = stepName;
        this.selectorSteps.repositories.isActive = false;
        this.selectorSteps.branches.isActive = false;
        this.selectorSteps.commits.isActive = false;
        this.selectorSteps.templates.isActive = false;

        this.selectorSteps[stepName].isActive = true;
    }
}
