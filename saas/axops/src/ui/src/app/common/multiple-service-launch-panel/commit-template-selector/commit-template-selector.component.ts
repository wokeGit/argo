import { Component, Output, EventEmitter } from '@angular/core';

import { RepoService, BranchService, CommitsService, TemplateService } from '../../../services';
import { SortOperations } from '../../../common';
import { ShortRevisionPipe } from '../../../pipes';
import { Commit } from '../../../model';

type SelectorParts = 'repositories' | 'branches' | 'commits' | 'templates';

@Component({
    selector: 'ax-commit-template-selector',
    templateUrl: './commit-template-selector.html',
    styles: [ require('./commit-template-selector.scss') ],
})
export class CommitTemplateSelectorComponent {
    public activePart: SelectorParts = 'templates';
    public isBrowseVisible: boolean = false;
    public selectorSteps: any;
    public selectorStepsModel: any = {
        repositories: {
            isActive: true,
            search: '',
            messages: {
                title: 'Select a repo',
                searchInputPlaceholder: 'Search repo'
            },
            items: [],
            showDataLoader: false
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
            items: [],
            showDataLoader: false
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
            items: [],
            showDataLoader: false
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
            items: [],
            showDataLoader: false
        }
    };

    @Output()
    public updateTemplatesToSubmit: EventEmitter<any> = new EventEmitter();

    constructor(private repoService: RepoService,
                private branchService: BranchService,
                private commitsService: CommitsService,
                private templateService: TemplateService) {
        this.selectorSteps = JSON.parse(JSON.stringify(this.selectorStepsModel));
    }

    public async onBrowse() {
        this.activePart = 'templates';
        if (this.selectorSteps.repositories.items.length === 0) {
            await this.getRepos();
            this.selectRepoByUrl(this.selectorSteps.branches.selectedParent.url);
        }
    }

    public async changeStep(stepName: SelectorParts) {
        this.setActiveStep(stepName);

        switch (stepName) {
            case 'branches':
                await this.getBranches();
                // TODO if none is selected => select master => if there is no master select first at list
                this.selectBranch({name: this.selectorSteps.commits.selectedParent.name, selected: false});
                break;
            case 'commits':
                await this.getCommits();
                this.selectCommit({revision: this.selectorSteps.templates.selectedParent.name});
                break;
            case 'templates':
                await this.getTemplates();
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
        this.selectorSteps.commits.selectedParent = {
            name: branch.name,
            url: `${this.selectorSteps.branches.selectedParent.url}/${branch.name}`
        };

        this.selectorSteps.branches.items.forEach(item => {
            item.selected = item.name === branch.name;
        });
    }

    public selectCommit(commit) {
        this.selectorSteps.templates.selectedParent = {
            name: `${new ShortRevisionPipe().transform(commit.revision)}`,
            url: `${this.selectorSteps.branches.selectedParent.url}/${this.selectorSteps.commits.selectedParent.name}/${new ShortRevisionPipe().transform(commit.revision)}`
        };

        this.selectorSteps.commits.items.forEach(item => {
            item.selected = new ShortRevisionPipe().transform(item.revision) === new ShortRevisionPipe().transform(commit.revision);
        });
    }

    public selectTemplate(template) {
        template.selected = !template.selected;
        let templatesToSubmit = this.selectorSteps.templates.items.filter(t => {
            return t.selected;
        });

        this.updateTemplatesToSubmit.emit(templatesToSubmit);
    }

    public selectRepoByUrl(url: string) {
        this.selectorSteps.repositories.items.forEach(item => {
            if (item.url === url) {
                item.selected = true;
            }
        });
    }

    public init(commit) {
        this.activePart = 'templates';

        if (commit.revision && commit.repo && commit.branch) {
            this.setParents(commit);
            this.getTemplates();
        } else {
            this.commitsService.getCommitByRevision(commit.revision).subscribe((c: Commit) => {
                this.setParents(c);
                this.getTemplates(c);
            });
        }
    }

    public resetComponent() {
        // TODO reset component
        console.log('reset', this.selectorStepsModel);
        this.selectorSteps = JSON.parse(JSON.stringify(this.selectorStepsModel));
        this.isBrowseVisible = false;
    }

    private setParents(commit: Commit) {
        console.log('commit.repo', commit.repo)
        this.selectorSteps.branches.selectedParent = this.splitRepository([commit.repo])[0];
        this.selectorSteps.commits.selectedParent.name = commit.branch;
        this.selectorSteps.commits.selectedParent.url = `${commit.repo}/${commit.branch}`;
        this.selectorSteps.templates.selectedParent.name = commit.revision;
        this.selectorSteps.templates.selectedParent.url = `${commit.repo}/${commit.branch}/${new ShortRevisionPipe().transform(commit.revision)}`;
    }

    private async getRepos() {
        this.selectorSteps.repositories.items = [];
        this.selectorSteps.repositories.showDataLoader = true;
        await this.repoService.getReposAsync(true).toPromise().then(res => {
            let repositories: { name: string, url: string, selected: boolean }[] = this.splitRepository(res.data);
            this.selectorSteps.repositories.items = SortOperations.sortBy(repositories, 'name');
        });
        this.selectorSteps.repositories.showDataLoader = false;
    }

    private async getBranches() {
        this.selectorSteps.branches.items = [];
        this.selectorSteps.branches.showDataLoader = true;
        await this.branchService.getBranchesAsync({ repo: this.selectorSteps.branches.selectedParent.url }, true).toPromise().then((branches) => {
            this.selectorSteps.branches.items = branches.data.map(branch => {
                return {
                    name: branch.name,
                    selected: false
                };
            });
        });
        this.selectorSteps.branches.showDataLoader = false;
    }

    private async getTemplates(commit?: Commit) {
        this.selectorSteps.templates.items = [];
        this.selectorSteps.templates.showDataLoader = true;
        // TODO once API will be ready update this step. Templates list should base on commit
        let parameters = {
            repo: commit ? commit.repo : this.selectorSteps.branches.selectedParent.url,
            branch: commit ? commit.branch || commit.branches[0] : this.selectorSteps.commits.selectedParent.name,
        };
        console.log('parameters', parameters);
        await this.templateService.getTemplatesAsync(parameters, false).toPromise().then(res => {
            this.selectorSteps.templates.items = res.data.map(template => {
                template['selected'] = false;
                return template;
            });
        });
        this.selectorSteps.templates.showDataLoader = false;
    }

    private async getCommits() {
        this.selectorSteps.commits.items = [];
        this.selectorSteps.commits.showDataLoader = true;
        let parameters = {
            repo: this.selectorSteps.branches.selectedParent.url,
            branch: this.selectorSteps.commits.selectedParent.name,
            offset: 0,
            limit: 20,
        };
        console.log('parameters', parameters);
        await this.commitsService.getCommitsAsync(parameters).toPromise().then(res => {
            this.selectorSteps.commits.items = res.data.map(commit => {
                commit['selected'] = false;
                return commit;
            });
        });
        this.selectorSteps.commits.showDataLoader = false;
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
