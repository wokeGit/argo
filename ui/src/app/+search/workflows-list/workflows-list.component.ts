import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import * as models from '../../models';
import { WorkflowsService, ModalService } from '../../services/';
import { BulkUpdater } from '../bulk-updater';

@Component({
  selector: 'ax-workflows-list',
  templateUrl: './workflows-list.html',
  styleUrls: ['./workflows-list.scss'],
})
export class WorkflowsListComponent implements OnInit {

  // @Input()
  // public filters: JobsFilters;

  @Input()
  public searchInput: string;

  public bulkUpdater: BulkUpdater<any>;
  // public tasks: Task[] = [];
  //
  // public limit: number = 10;
  // public params: JobsFilters;
  public dataLoaded: boolean = false;
  // public pagination: Pagination = {
  //     limit: this.limit,
  //     offset: 0,
  //     listLength: this.tasks.length
  // };
  public workflowListItems: models.Workflow[];

  // private subscriptions: Subscription[] = [];

  constructor(private workflowsService: WorkflowsService,
              private modalService: ModalService,
              private router: Router) {
    this.bulkUpdater = new BulkUpdater<any>(modalService)
      .addAction('cancel', {
        title: 'Cancel Jobs',
        confirmation: count => `Are you sure you want to cancel ${count} jobs?`,
        execute: task => this.qwe(), // this.taskService.cancelTask(task.id).toPromise(),
        isApplicable: task => this.isActiveTask(task) && task.status !== 'cancelling',
        warningMessage: tasks => `The ${tasks.length} selected job${tasks.length > 1 ? 's' : ''} are not active and cannot be cancelled.`,
        postMessage: (successfulCount, failedCount) => `${successfulCount} jobs had been successfully canceled.`
      }).addAction('resubmit', {
        title: 'Resubmit Jobs',
        confirmation: count => `Are you sure you want to resubmit ${count} Job${count > 1 ? 's' : ''}?`,
        execute: task => this.qwe(), // this.resubmitTask(task.id),
        isApplicable: task => true,
        warningMessage: tasks => null,
        postMessage: (successfulCount, failedCount) => `${successfulCount} jobs had been successfully resubmitted.`
      });
    // this.bulkUpdater.actionExecuted.subscribe(action => this.updateTasks(this.params, this.pagination, true));
  }

  public async ngOnInit() {
    this.workflowListItems = await this.getWorkflowItems();
  }

  private async getWorkflowItems() {
    this.dataLoaded = false;
    let workflowsList = await this.workflowsService.getWorkflows();
    this.dataLoaded = true;

    return workflowsList['items'].map(workflow => Object.assign(workflow, {checked: false, disabled: false}));
  }

  private qwe() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('Success!');
      }, 250);
    });
  }

  private resubmitTask(taskId: string): Promise<any> {
    // return this.taskService.getTask(taskId).toPromise().then(task => {
    //   return this.taskService.launchTask({
    //     arguments: task.arguments,
    //     template_id: task.template_id,
    //   }).toPromise();
    // });
    return this.qwe();
  }

  // public ngOnChanges() {
  //     // need to map readable statuses string representation to numbers
  //     this.params = {
  //         statuses: this.filters.statuses.map(status => new StatusToNumberPipe().transform(status).toString()),
  //         authors: this.filters.authors,
  //         artifact_tags: this.filters.artifact_tags,
  //         branch: this.filters.branch,
  //         repo: this.filters.repo,
  //         templates: this.filters.templates,
  //     };
  //     // restart pagination if changed search parameters
  //     this.pagination = {limit: this.limit, offset: 0, listLength: this.tasks.length};
  //     this.updateTasks(this.params, this.pagination, true);
  // }

  public navigateToDetails(id: string): void {
    this.router.navigate(['/timeline/', id]);
  }

  private isActiveTask(task: any) {
    return true;
    // return task.status !== TaskStatus.Cancelled && task.status !== TaskStatus.Success && task.status !== TaskStatus.Failed ? 1 : 0;
  }

  //
  // private updateTasks(params: JobsFilters, pagination: Pagination, hideLoader?: boolean) {
  //     this.unsubscribeGetTaskSubscription();
  //
  //     this.dataLoaded = false;
  //     // Remove previously loaded number of active tasks from offset, since pagination is not applicable to active tasks
  //     let offset = Math.max(0, pagination.offset - this.activeTasks.length);
  //     this.getTasksSubscrioption = this.getTasks(params, this.limit + 1, offset)
  //     // Sort tasks by status to make sure that active tasks come first
  //         .map(result => result.data.sort((first, second) => this.isActiveTask(second) - this.isActiveTask(first))).subscribe(tasks => {
  //
  //             this.activeTasks = tasks.filter(task => this.isActiveTask(task));
  //
  //             this.dataLoaded = true;
  //
  //             // Remove active tasks which are not supposed to be shown for current page
  //             let prevPagesTaskCount = Math.min(pagination.offset, this.activeTasks.length);
  //             this.tasks = tasks.slice(prevPagesTaskCount, prevPagesTaskCount + pagination.limit).map(task => {
  //                 task.artifact_tags = task.artifact_tags.length ? JSON.parse(task.artifact_tags) : [];
  //                 return task;
  //             });
  //             this.bulkUpdater.items = this.tasks;
  //
  //             this.pagination = {
  //                 offset: pagination.offset,
  //                 limit: this.limit,
  //                 listLength: this.tasks.length,
  //                 hasMore: tasks.filter(task => !this.isActiveTask(task)).length > this.limit
  //             };
  //         }, error => {
  //             this.dataLoaded = true;
  //             this.tasks = [];
  //             this.bulkUpdater.items = this.tasks;
  //         });
  // }

  // private getTasks(params: JobsFilters, limit: number, offset: number) {
  //     let parameters = {
  //         status: null,
  //         tags: null,
  //         limit: null,
  //         offset: null,
  //         repo: null,
  //         branches: null,
  //         username: null,
  //         template_name: null,
  //         fields: [
  //             TaskFieldNames.name,
  //             TaskFieldNames.status,
  //             TaskFieldNames.status_string,
  //             TaskFieldNames.username,
  //             TaskFieldNames.commit,
  //             TaskFieldNames.repo,
  //             TaskFieldNames.branch,
  //         ],
  //         searchFields: [
  //             TaskFieldNames.name,
  //             TaskFieldNames.description,
  //             TaskFieldNames.status_string,
  //             TaskFieldNames.username,
  //             TaskFieldNames.repo,
  //             TaskFieldNames.branch,
  //         ],
  //         search: this.searchString
  //     };
  //
  //     parameters.offset = offset;
  //     parameters.limit = limit;
  //
  //     if (params.statuses && params.statuses.length) {
  //         parameters.status = params.statuses;
  //     }
  //
  //     if (params.authors && params.authors.length) {
  //         parameters.username = params.authors;
  //     }
  //
  //     if (params.artifact_tags && params.artifact_tags.length) {
  //         parameters.tags = params.artifact_tags;
  //     }
  //
  //     if (params.repo && params.repo.length) {
  //         if (params.repo.length === 1 && params.branch.length === 0) {
  //             parameters.repo = params.repo;
  //         } else {
  //             parameters.branches = params.repo.map(i => {
  //                 return {repo: i, name: ''};
  //             });
  //         }
  //     }
  //
  //     if (params.branch && params.branch.length) {
  //         let branches = params.branch.map(i => {
  //             return {repo: i.split(' ')[0], name: i.split(' ')[1]};
  //         });
  //
  //         parameters.branches = parameters.branches || [];
  //         parameters.branches = parameters.branches.concat(branches || []);
  //     }
  //
  //
  //     if (params.templates && params.templates.length) {
  //         parameters.template_name = params.templates;
  //     }
  //
  //     return this.taskService.getTasks(parameters, true);
  // }
}
