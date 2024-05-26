import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PaintWithCanvasComponent } from './paint-with-canvas/paint-with-canvas.component';
import { PaintComponent } from './paint/paint.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PaintComponent,PaintWithCanvasComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'paint-rxjs';
}
