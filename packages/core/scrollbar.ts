import {
  IScrollbarState,
  IScrollOptions,
  SCROLLBAR_MIN_SIZE,
  ScrollbarDirection,
} from './types';

export class Scrollbar {
  private state: IScrollbarState;
  private direction: ScrollbarDirection;

  constructor(options: IScrollOptions) {
    this._init(options);
  }

  _init(options: IScrollOptions) {
    const {
      thumbEl,
      trickerEl,
      direction,
      scrollFn,
      thumbClass,
      trickerClass,
      thumbStyle,
      trickerStyle,
      clientSize,
      listSize,
      scrollFrom,
    } = options;
    if (!thumbEl) {
      console.error('thumbEl is required');
      return;
    }
    if (!trickerEl) {
      console.error('trickerEl is required');
      return;
    }
    if (!trickerEl.contains(thumbEl)) {
      console.error('thumbEl must be a child of trickerEl');
      return;
    }
    this.direction = direction ?? ScrollbarDirection.VERTICAL;
    this.state.listSize = listSize ?? 0;
    this.state.clientSize = clientSize ?? 0;
    this.state.scrollFrom = scrollFrom ?? 0;
    this.state.thumbSize = this.getThumbSize();
  }

  getThumbSize() {
    if (this.state.listSize === 0 || !this.state.listSize) {
      return 0;
    }
    const { listSize, clientSize } = this.state;
    const ratio = (clientSize * 100) / listSize;
    if (ratio >= 100) return Number.POSITIVE_INFINITY;
    if (ratio >= 50) return (ratio * clientSize) / 100;
    const SCROLLBAR_MAX_SIZE = clientSize / 3;

    return Math.floor(
      Math.min(
        Math.max((ratio * clientSize) / 100, SCROLLBAR_MIN_SIZE),
        SCROLLBAR_MAX_SIZE,
      ),
    );
  }

  renderThumbStyle() {}

  renderTrackSize() {}
}
