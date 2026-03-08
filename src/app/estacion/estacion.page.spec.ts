import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EstacionPage } from './estacion.page';

describe('EstacionPage', () => {
  let component: EstacionPage;
  let fixture: ComponentFixture<EstacionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstacionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EstacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
