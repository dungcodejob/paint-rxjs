import { AsyncPipe, NgStyle } from '@angular/common';
import { Component, ElementRef, OnInit, inject } from '@angular/core';
import {
  Subject,
  fromEvent,
  merge,
  scan,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';

type PointerEventName = 'mousedown' | 'mousemove' | 'mouseup' | 'mouseleave';

@Component({
  selector: 'app-paint',
  standalone: true,
  imports: [AsyncPipe, NgStyle],
  templateUrl: './paint.component.html',
  styleUrl: './paint.component.css',
})
export class PaintComponent implements OnInit {
  private readonly _elementRef = inject(ElementRef);
  resetSubject = new Subject<void>();

  move$ = fromEvent<PointerEvent>(this._elementRef.nativeElement, 'mousemove');
  down$ = fromEvent<PointerEvent>(this._elementRef.nativeElement, 'mousedown');
  leave$ = fromEvent<PointerEvent>(
    this._elementRef.nativeElement,
    'mouseleave'
  );
  up$ = fromEvent<PointerEvent>(this._elementRef.nativeElement, 'mouseup');

  reset$ = this.resetSubject.asObservable();

  clicks$ = merge(
    this.down$.pipe(
      switchMap((pointer) =>
        this.move$.pipe(
          startWith(pointer),
          takeUntil(merge(this.up$, this.leave$))
        )
      ),
      scan((state: PointerEvent[], event) => [...state, event], [])

      // switchMap((event) =>
      //   this.reset$.pipe<PointerEvent[]>(
      //     map(() => [] as PointerEvent[]),
      //     scan((state: PointerEvent[], event) => [...state, event], [])
      //   )
      // )
    )
  );

  ngOnInit(): void {
    console.log(this._elementRef);
  }

  // clicks$ = merge(
  //   this.start$.pipe<PointerEvent[]>(map(() => [])),
  //   this.reset$.pipe<PointerEvent[]>(map(() => []))
  // ).pipe(switchMap(() => this.move$));
}
