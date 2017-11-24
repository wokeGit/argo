import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'ax-top-bar',
  templateUrl: './top-bar.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {

  public isGlobalSearchVisible: boolean;
  public pageTitle = 'Timeline';
  public searchForm: FormGroup;

  constructor(private router: Router) {
  }

  public ngOnInit() {
    this.searchForm = new FormGroup({
      inputControl: new FormControl(''),
    });
  }

  public onSubmit(form?) {
    console.log('onSubmit', this.searchForm.controls);
    this.router.navigate(['/search/', this.searchForm.controls['inputControl'].value ]);
  }

  public onInputClick() {
    console.log('onInputClick');
  }
}
