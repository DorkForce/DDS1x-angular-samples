import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ModalComponent } from './modal.component';

const generateModalHTML = (testNum: number) => `
    <app-modal-component [modalId]="'test-id-${testNum}'">
        <div modal-body>
            test-dialog-content-${testNum}
        </div>
        <span modal-trigger trigger-${testNum}>
            test-trigger-content-${testNum}
        </span>
    </app-modal-component>
`;

@Component({
    selector: 'app-dummy-component',
    template: '<div>test-dialog-content-0</div>'
}) class DummyComponent { constructor() { } }

@Component({
    selector: 'app-dummy-root-component',
    template: `
        <app-modal-component [modalId]="'test-id-0'" [modalTitleId]="title-id-0">
            <app-dummy-component modal-body>
            </app-dummy-component>
            <span modal-trigger trigger-0>
                test-trigger-content-0
            </span>
        </app-modal-component>
        ${generateModalHTML(1)}
        ${generateModalHTML(2)}
        ${generateModalHTML(3)}
    `
}) class DummyRootComponent {
    constructor() { }
    @ViewChild('modalTriggerContent') modalTriggerContent: ElementRef<HTMLElement>;
    @ViewChild('modalBodyContent') modalBodyContent: ElementRef<HTMLElement>;
}

describe('ModalComponent', () => {
    let rootComponent: DummyRootComponent;
    let fixture: ComponentFixture<DummyRootComponent>;

    beforeEach(async(() => {

        // configureTestingModule
        TestBed.configureTestingModule({
            imports: [],
            declarations: [ModalComponent, DummyRootComponent, DummyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DummyRootComponent);
        fixture.detectChanges();
        rootComponent = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(rootComponent).toBeTruthy();

        // modalComponent
        const rootDebugElement = fixture.debugElement;
        const modalDebugElement = rootDebugElement ? rootDebugElement.query(By.directive(ModalComponent)) : null;
        const modalComponent = modalDebugElement ? modalDebugElement.componentInstance as ModalComponent : null;
        expect(modalComponent).toBeTruthy();
    });


    it('component dialog Id and trigger dataTarget should be generated properly and not repeated', () => {
        const page: HTMLElement = fixture.nativeElement;
        const checkModalId = (testNum: number) => {
            const trigger = page.querySelector(`[trigger-${testNum}]`);
            expect(trigger).toBeTruthy();
            expect(trigger.innerHTML).toContain(`test-trigger-content-${testNum}`);
            const dataTarget = trigger.getAttribute(`data-target`);
            expect(dataTarget).toBeTruthy();
            const matchesModalId = page.querySelectorAll(dataTarget);
            expect(matchesModalId).toBeTruthy();
            expect(matchesModalId.length).toEqual(1);
            expect(matchesModalId[0].innerHTML).toContain(`test-dialog-content-${testNum}`);
        };
        checkModalId(0);
        checkModalId(1);
        checkModalId(2);
        checkModalId(3);
    });
});
