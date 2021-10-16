import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SendataPage } from './sendata.page';

describe('SendataPage', () => {
  let component: SendataPage;
  let fixture: ComponentFixture<SendataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SendataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
