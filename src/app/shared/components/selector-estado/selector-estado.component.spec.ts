import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorEstadoComponent } from './selector-estado.component';

describe('SelectorEstadoComponent', () => {
  let component: SelectorEstadoComponent;
  let fixture: ComponentFixture<SelectorEstadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectorEstadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectorEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
