import { Output, EventEmitter } from '@angular/core';

export class EventsService {
  public modal: EventEmitter<any> = new EventEmitter();
  public search: EventEmitter<any> = new EventEmitter();
}
