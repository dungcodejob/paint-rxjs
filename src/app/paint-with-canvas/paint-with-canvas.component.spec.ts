import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintWithCanvasComponent } from './paint-with-canvas.component';

describe('PaintWithCanvasComponent', () => {
  let component: PaintWithCanvasComponent;
  let fixture: ComponentFixture<PaintWithCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaintWithCanvasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaintWithCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
