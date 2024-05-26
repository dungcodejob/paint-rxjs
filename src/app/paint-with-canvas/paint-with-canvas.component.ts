import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, map, merge, pairwise, switchMap, tap, throttleTime, windowToggle } from 'rxjs';
type Point = {
  x: number;
  y: number;
};
@Component({
  selector: 'app-paint-with-canvas',
  standalone: true,
  imports: [],
  templateUrl: './paint-with-canvas.component.html',
  styleUrl: './paint-with-canvas.component.css',
})
export class PaintWithCanvasComponent implements OnInit, AfterViewInit {
  private readonly _destroyRef = inject(DestroyRef);
  drawing = viewChild.required('drawing', {
    read: ElementRef<HTMLCanvasElement>,
  });
  ctx = computed(() => this.drawing().nativeElement.getContext('2d'));

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const element = this.drawing().nativeElement;
    const down$ = fromEvent<PointerEvent>(element, 'mousedown');
    const move$ = fromEvent<PointerEvent>(element, 'mousemove');
    const leave$ = fromEvent<PointerEvent>(element, 'mouseleave');
    const up$ = fromEvent<PointerEvent>(element, 'mouseup');

    move$
      .pipe(
        throttleTime(10),
        windowToggle(down$, () => merge(leave$, up$)),
        switchMap((event$) =>
          event$.pipe(
            map((event) => this._position(event)),
            pairwise()
          )
        ),
        tap(([point1, point2]) => this._draw(point1, point2)),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();
  }

  private _draw(point1: Point, point2: Point) {
    console.log('from _draw', point1, point2);
    const ctx = this.ctx();
    if (ctx) {
      ctx.beginPath();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.moveTo(point1.x, point1.y);
      ctx.lineTo(point2.x, point2.y);
      ctx.stroke();
      ctx.closePath();
    }
  }

  private _position(pointer: PointerEvent): Point {
    const rect = this.drawing().nativeElement.getBoundingClientRect();
    return {
      x: pointer.clientX - rect.left,
      y: pointer.clientY - rect.top,
    };
  }
}
