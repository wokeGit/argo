import { Component, OnInit, Input } from '@angular/core';

import { RepoService, BranchService } from '../../../services';
import { SortOperations } from '../../../common';
import { Template, Commit } from '../../../model';

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
            search: '',
            messages: {
                title: 'Select a repo',
                searchInputPlaceholder: 'Search repo'
            },
            items: []
        },
        branches: {
            isActive: false,
            search: '',
            selectedParent: { // selected repositories
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
            search: '',
            selectedParent: { // selected branch
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
            search: '',
            selectedParent: { // selected commit
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

    @Input()
    set commit(c: Commit) {
        if (c.revision && c.repo && c.branch) {
            this.selectorSteps.branches.selectedParent = this.splitRepository([c.repo])[0];
            this.selectorSteps.commits.selectedParent.name = c.branch;
            this.selectorSteps.templates.selectedParent.name = c.revision;
        }
    }

    public activePart: SelectorParts = 'repositories';

    constructor(private repoService: RepoService,
                private branchService: BranchService) {
    }

    ngOnInit() {
    }

    public async onBrowse() {
        if (this.selectorSteps.repositories.items.length === 0) {
            await this.getRepos();
            this.selectRepoByUrl(this.selectorSteps.branches.selectedParent.url);
        }
    }

    public changeStep(stepName: SelectorParts) {
        this.setActiveStep(stepName);

        switch (stepName) {
            case 'branches':
                // TODO get branches base on repo
                this.getBranches();
                break;
            case 'commits':
                // TODO
                break;
            case 'templates':
                // TODO
                break;
        }
    }

    public setActiveStep(stepName: SelectorParts) {
        this.activePart = stepName;
        this.selectorSteps.repositories.isActive = false;
        this.selectorSteps.branches.isActive = false;
        this.selectorSteps.commits.isActive = false;
        this.selectorSteps.templates.isActive = false;

        this.selectorSteps[stepName].isActive = true;
    }

    public selectRepo(repo: { name: string, url: string, selected: boolean }) {
        this.selectorSteps.branches.selectedParent = {
            name: repo.name,
            url: repo.url
        };

        this.selectorSteps.repositories.items.map((repository) => {
            repository.selected = false;
            return repository;
        });
        repo.selected = true;
    }

    public selectBranch(branch) {
        console.log('branch', branch)
    }

    public selectRepoByUrl(url: string) {
        this.selectorSteps.repositories.items.forEach(item => {
            if (item.url === url) {
                item.selected = true;
            }
        });
    }

    private async getRepos() {
        await this.repoService.getReposAsync().toPromise().then(res => {
            let repositories: { name: string, url: string, selected: boolean }[] = this.splitRepository(res.data);
            this.selectorSteps.repositories.items = SortOperations.sortBy(repositories, 'name');
        });
    }

    private async getBranches() {
        await this.branchService.getBranchesAsync({ repo: this.selectorSteps.branches.selectedParent.url }).toPromise().then((branches) => {
            console.log('branches', branches);
            this.selectorSteps.branches.items = branches.data.map(branch => {
                return {
                    name: branch.name,
                    selected: false
                };
            });
            console.log('this.selectorSteps.branches.item', this.selectorSteps.branches.items);
        });
    }

    private splitRepository(repos: string []): { name: string, url: string, selected: boolean }[] {
        return repos.map((item: string) => {
            let repoSplit = item.split('/');

            return {
                name: repoSplit[repoSplit.length - 1],
                url: item,
                selected: false
            };
        });
    }
}
