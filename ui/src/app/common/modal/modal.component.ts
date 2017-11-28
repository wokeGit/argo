import { Component, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { ModalTemplateComponent } from './modal.template';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'ax-modal',
  templateUrl: './modal.html',
  styleUrls: ['./modal.scss'],
})
export class ModalComponent {
  private componentRef: ComponentRef<ModalTemplateComponent>;

  constructor(private eventsService: EventsService,
              private viewContainerRef: ViewContainerRef,
              private factory: ComponentFactoryResolver) {
    eventsService.modal.subscribe(stream => {
      stream.subscribe(() => {
        this.componentRef.destroy();
        this.componentRef = null;
      });
      this.componentRef = viewContainerRef.createComponent(factory.resolveComponentFactory(ModalTemplateComponent));
    });
  }
}
