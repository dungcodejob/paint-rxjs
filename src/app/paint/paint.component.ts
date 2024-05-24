import { AsyncPipe, NgStyle } from '@angular/common';
import { Component, ElementRef, OnInit, inject } from '@angular/core';
import {
  Subject,
  fromEvent,
  map,
  merge,
  scan,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';


type ScanHandlerFn<T> = (state: T) => T;
@Component({
  selector: 'app-paint',
  standalone: true,
  imports: [AsyncPipe, NgStyle],
  templateUrl: './paint.component.html',
  styleUrl: './paint.component.css',
})
export class PaintComponent implements OnInit {
  private readonly element = inject(ElementRef).nativeElement;

  down$ = fromEvent<PointerEvent>(this.element, 'mousedown');
  move$ = fromEvent<PointerEvent>(this.element, 'mousemove');
  leave$ = fromEvent<PointerEvent>(this.element, 'mouseleave');
  up$ = fromEvent<PointerEvent>(this.element, 'mouseup');

  resetSubject = new Subject<void>();

  reset$ = this.resetSubject.asObservable();

  clicks$ = merge(
    this.down$
      .pipe(
        switchMap((event) =>
          this.move$.pipe(
            startWith(event),
            takeUntil(merge(this.leave$, this.up$))
          )
        )
      )
      .pipe(map(accumulationHandler)),
    this.reset$.pipe(map(resetHandler)),
  ).pipe(scan((state: PointerEvent[], fn) => fn(state), []));


  ngOnInit(): void {}
}

const resetHandler =
  (): ScanHandlerFn<PointerEvent[]> => (state: PointerEvent[]) =>
    [];

const accumulationHandler =
  (event: PointerEvent): ScanHandlerFn<PointerEvent[]> =>
  (state: PointerEvent[]) =>
    [...state, event];
