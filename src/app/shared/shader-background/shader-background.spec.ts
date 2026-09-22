import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShaderBackground } from './shader-background';

describe('ShaderBackground', () => {
  let component: ShaderBackground;
  let fixture: ComponentFixture<ShaderBackground>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShaderBackground],
    }).compileComponents();

    fixture = TestBed.createComponent(ShaderBackground);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
