import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders hero heading and sections', () => {
    const compiled: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#hero-heading')?.textContent).toContain('Get Your Own Verve On');
    expect(compiled.querySelector('#new-heading')?.textContent).toContain('New Releases');
    expect(compiled.querySelector('#best-heading')?.textContent).toContain('Best Sellers');
  });
});
