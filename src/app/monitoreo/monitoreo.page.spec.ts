import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MonitoreoPage } from './monitoreo.page';

describe('MonitoreoPage', () => {
  let component: MonitoreoPage;
  let fixture: ComponentFixture<MonitoreoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MonitoreoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
