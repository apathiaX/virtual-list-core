import { applyStyles, handleScrollbarEvents } from './utils';
import {
  ScrollbarEvent,
  SCROLLBAR_MIN_SIZE,
  ScrollbarDirection,
  SCROLL_BAR_STATE_MAP,
  type IRenderThumbStyleParams,
  type IScrollbarCallBack,
  type IScrollbarState,
  type IScrollbarStyleKeys,
  type IScrollbarStyleOptions,
  type IScrollOptions,
} from './types';

export class Scrollbar {
  private _thumbEl: HTMLElement;
  private _trickerEl: HTMLElement;
  private _state: IScrollbarState;
  private _barState: IScrollbarStyleKeys;
  private _direction: ScrollbarDirection;
  private _totalOffset: number = 0;
  private _styleOptions: IScrollbarStyleOptions;

  private _emitEvents: IScrollbarCallBack;
  private _detachEvents: () => void;
  private _attachEvents: () => void;

  private _isDragging = false;
  private _offset = 0;
  private _clickOffset = 0;

  constructor(options: IScrollOptions, callback?: IScrollbarCallBack) {
    this._init(options);
    this._emitEvents = callback ?? {};
    const { attachEvents, detachEvents } = handleScrollbarEvents(
      this._thumbEl,
      {
        onThumbUp: this._onThumbUp,
        onThumbMove: this._onThumbMove,
        onThumbDown: this._onThumbDown,
      },
    );
    this._attachEvents = attachEvents;
    this._detachEvents = detachEvents;
    this._thumbEl.addEventListener('mousedown', this._onThumbDown);
    this._thumbEl.addEventListener('touchstart', this._onThumbDown);
    this._trickerEl.addEventListener('click', this._onClickTrack);
    applyStyles(this._thumbEl, this._renderThumbStyle());
    applyStyles(this._trickerEl, this._renderTrackStyle());
  }

  _init(options: IScrollOptions) {
    const {
      thumbEl,
      trickerEl,
      direction,
      thumbClass,
      trickerClass,
      thumbStyle,
      trickerStyle,
      clientSize,
      listSize,
      bgColor,
      scrollFrom,
    } = options;

    if (!thumbEl) {
      console.error('[Virtual List] ', 'thumbEl is required');
      return;
    }
    if (!trickerEl) {
      console.error('[Virtual List] ', 'trickerEl is required');
      return;
    }
    if (!trickerEl.contains(thumbEl)) {
      console.error('[Virtual List] ', 'thumbEl must be a child of trickerEl');
      return;
    }

    this._thumbEl = thumbEl;
    this._trickerEl = trickerEl;
    this._direction = direction ?? ScrollbarDirection.VERTICAL;
    this._state = {
      listSize: listSize ?? 0,
      clientSize: clientSize ?? 0,
      scrollFrom: scrollFrom ?? 0,
      thumbSize: 0,
    };
    this._state.thumbSize = this._getThumbSize();
    this._totalOffset = this._getTotalOffset();
    this._styleOptions = {
      thumbClass,
      trickerClass,
      thumbStyle,
      trickerStyle,
      bgColor: bgColor || '#909399',
    };
    this._barState = SCROLL_BAR_STATE_MAP[this._direction];
    if (this._styleOptions.thumbClass) {
      this._thumbEl.classList.add(this._styleOptions.thumbClass || '');
    }
    if (this._styleOptions.trickerClass) {
      this._trickerEl.classList.add(this._styleOptions.trickerClass || '');
    }
  }

  private _getThumbSize() {
    if (this._state.listSize === 0 || !this._state.listSize) {
      return 0;
    }
    const { listSize, clientSize } = this._state;
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

  private _getTotalOffset() {
    return this._state.clientSize - this._state.thumbSize - 4;
  }

  private _getThumbStyle(options: IRenderThumbStyleParams) {
    const { bar, move, size, direction } = options;
    const style: {
      backgroundColor?: string;
      [key: string]: string | undefined;
    } = {};
    const translate = `translate${bar.axis}(${move}px)`;

    style[bar.size] = size;
    style.transform = translate;
    style.msTransform = translate;
    style.backgroundColor = this._styleOptions.bgColor;

    if (direction === 'horizontal') {
      style.height = '100%';
    } else {
      style.width = '100%';
    }

    return style;
  }

  private _renderThumbStyle() {
    if (!Number.isFinite(this._state.thumbSize)) {
      return {
        display: 'none',
      };
    }
    const thumb = `${this._state.thumbSize}px`;

    const style: Record<string, any> = this._getThumbStyle({
      bar: {
        size: this._barState.size,
        axis: this._direction === 'horizontal' ? 'X' : 'Y',
      },
      size: thumb,
      move: this._offset,
      direction: this._direction,
    });

    return style;
  }

  private _renderTrackStyle() {
    return {
      position: 'absolute',
      width:
        this._direction === 'horizontal'
          ? `${this._state.clientSize}px`
          : '10px',
      height:
        this._direction === 'horizontal'
          ? '10px'
          : `${this._state.clientSize}px`,
      [this._barState.direction]: '2px',
      right: '2px',
      bottom: '2px',
      borderRadius: '4px',
      zIndex: 11,
    };
  }

  private _onThumbDown = (e: MouseEvent | TouchEvent) => {
    document.body.style.overflow = 'hidden';
    e.stopPropagation();
    this._isDragging = true;
    if (e.type === 'touchstart') {
      if ((e as TouchEvent).touches.length === 0) return;
      this._clickOffset =
        (e.target as HTMLElement)![this._barState.offset] -
        ((e as TouchEvent).touches[0][this._barState.client] -
          (e.target as HTMLElement).getBoundingClientRect()[
            this._barState.direction
          ]);
    } else {
      this._clickOffset =
        (e.currentTarget as HTMLElement)![this._barState.offset] -
        ((e as MouseEvent)[this._barState.client] -
          (e.currentTarget as HTMLElement).getBoundingClientRect()[
            this._barState.direction
          ]);
    }
    this._attachEvents();
  };

  private _onThumbUp = (e: Event) => {
    e.preventDefault();
    this._isDragging = false;
    this._clickOffset = 0;
    this._detachEvents();

    document.body.style.overflow = 'scroll';
    document.body.style.userSelect = '';
  };

  private _frameHandle: null | number = null;
  private _onThumbMove = (e: MouseEvent | TouchEvent) => {
    if (!this._isDragging) return;
    e.preventDefault();
    document.body.style.userSelect = 'none';
    if (!this._thumbEl || !this._trickerEl) return;
    const prevClickOffset = this._clickOffset;
    if (!prevClickOffset) return;
    cancelAnimationFrame(this._frameHandle as number);
    // 移动端兼容
    let clientSize = 0;
    if (e.type === 'touchmove') {
      if ((e as TouchEvent).touches.length === 0) return;
      clientSize = (e as TouchEvent).touches[0][this._barState.client];
    } else {
      clientSize = (e as MouseEvent)[this._barState.client];
    }
    const tempOffset =
      (this._trickerEl.getBoundingClientRect()[this._barState.direction] -
        clientSize) *
      -1;
    const thumbClickPosition =
      this._thumbEl[this._barState.offset] - prevClickOffset;
    let distance = tempOffset - thumbClickPosition;
    if (distance < 0) {
      distance = 0;
    }
    if (distance > this._totalOffset) {
      distance = this._totalOffset;
    }
    this._emitEvents[ScrollbarEvent.SCROLL]?.(distance / this._totalOffset);
    this._frameHandle = requestAnimationFrame(() => {
      this._updateOffset(distance);
    });
  };

  private _onClickTrack = (e: MouseEvent) => {
    // 点击滚动条时，thumb 中点定位到鼠标点击位置
    if (!this._trickerEl) return;
    let mousePosition =
      e[this._barState.client] -
      this._trickerEl.getBoundingClientRect()[this._barState.direction] -
      this._state.thumbSize / 2;
    if (mousePosition < 0) {
      mousePosition = 0;
    } else if (mousePosition > this._totalOffset) {
      mousePosition = this._totalOffset;
    }
    this._emitEvents[ScrollbarEvent.SCROLL]?.(
      mousePosition / this._totalOffset,
    );
    this._updateOffset(mousePosition);
  };

  private _updateOffset(offset: number) {
    this._offset = offset;
    applyStyles(this._thumbEl, this._renderThumbStyle());
  }

  updateListSize(listSize: number) {
    this._state.listSize = listSize;
    this._state.thumbSize = this._getThumbSize();
    this._totalOffset = this._getTotalOffset();
    applyStyles(this._thumbEl, this._renderThumbStyle());
  }

  updateClientSize(clientSize: number) {
    this._state.clientSize = clientSize;
    this._state.thumbSize = this._getThumbSize();
    this._totalOffset = this._getTotalOffset();
    applyStyles(this._trickerEl, this._renderTrackStyle());
    applyStyles(this._thumbEl, this._renderThumbStyle());
  }

  updateScrollFrom(scrollFrom: number) {
    if (this._isDragging || (!scrollFrom && scrollFrom !== 0)) return;
    this._updateOffset(scrollFrom * this._totalOffset);
  }
}
