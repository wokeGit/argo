import { Component, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { ModalTemplateComponent } from './modal.template';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'ax-modal',
  templateUrl: './modal.html',
  styleUrls: ['./modal.scss'],
})
export class ModalComponent {
  private componentRef: ComponentRef<ModalTemplateComponent>;

  constructor(private modalService: ModalService,
              private viewContainerRef: ViewContainerRef,
              private factory: ComponentFactoryResolver) {
    modalService.modal.subscribe(stream => {
      stream.subscribe(() => {
        this.componentRef.destroy();
        this.componentRef = null;
      });
      this.componentRef = viewContainerRef.createComponent(factory.resolveComponentFactory(ModalTemplateComponent));
    });
  }
}
