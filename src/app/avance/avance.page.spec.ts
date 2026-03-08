import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AvancePage } from './avance.page';

describe('AvancePage', () => {
  let component: AvancePage;
  let fixture: ComponentFixture<AvancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AvancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
