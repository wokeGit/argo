import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'ax-top-bar',
  templateUrl: './top-bar.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {

  public pageTitle = 'Timeline';
  public searchForm: FormGroup;

  constructor(private router: Router, private eventsService: EventsService) {
  }

  public ngOnInit() {
    this.searchForm = new FormGroup({
      inputControl: new FormControl(''),
    });

    this.eventsService.search.subscribe(searchString => {
      this.searchForm.controls['inputControl'].setValue(searchString);
    });
  }

  public onSubmit(form?) {
    this.router.navigate(['/search/', this.searchForm.controls['inputControl'].value]);
  }
}
