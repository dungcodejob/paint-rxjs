describe('PaintComponent', () => {
  let component: PaintComponent;
  let fixture: ComponentFixture<PaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaintComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset state when resetSubject emits', () => {
    spyOn(component, 'resetState');
    component.resetSubject.next();
    expect(component.resetState).toHaveBeenCalled();
  });

  it('should emit click when mousedown, mousemove, and mouseup events occur', () => {
    spyOn(component.clicks$, 'next');
    const downEvent = new MouseEvent('mousedown');
    const moveEvent = new MouseEvent('mousemove');
    const upEvent = new MouseEvent('mouseup');
    component.element.dispatchEvent(downEvent);
    component.element.dispatchEvent(moveEvent);
    component.element.dispatchEvent(upEvent);
    expect(component.clicks$.next).toHaveBeenCalledWith({
      start: downEvent,
      end: upEvent,
      duration: moveEvent.timeStamp - downEvent.timeStamp,
    });
  });
});
