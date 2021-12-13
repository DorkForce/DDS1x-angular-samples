import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, Input } from '@angular/core';
// import { Modal } from '@dds-uicore/all';
declare var UIC: any; // Use declare if you import via CDN. Regular Angular (node_modules) usage would be via an import like above

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal.component.html',
  styles: ['./modal.component.scss'] // why not styleUrls?
})
export class ModalComponent implements OnInit, AfterViewInit {
  @ViewChild('triggerContainer') triggerContainer: ElementRef<HTMLElement>;
  @Input() modalId: string;
  @Input() modalTitleId: string;

  constructor() { }

  ngOnInit(): void {
    this.modalId = `${this.modalId}-modal-${this.Uuid()}`;
    this.modalTitleId = `${this.modalTitleId}-modal-${this.Uuid()}`;
  }

  ngAfterViewInit() {
    const content = this.triggerContainer.nativeElement;
    if (content) {
      // If the modal-trigger ngcontent is plain text then we want to work with the contentContainer.
      // If otherwise modal-trigger ngcontent has one or more tags we want to work with the first child of contentContainer.
      const actualContent = (content.children && content.children.length > 0)
        ? content.children[0]
        : content;
      // This two attributes are needed by @dds-uicore Modal
      actualContent.setAttribute('data-toggle', 'dds__modal');
      actualContent.setAttribute('data-target', `#${this.modalId}`);
      const thisModal = new UIC.Modal(actualContent);
    }
  }

  Uuid() {
    const windowObj: any = window;
    const winCrypto = windowObj.crypto || windowObj.msCrypto;
    let index = winCrypto.getRandomValues(new Uint32Array(1))[0];
    index = +`${index}`.substr(0, 1);
    const uuid = winCrypto.getRandomValues(new Uint32Array(10))[index];
    return uuid;
  }
}
