import { getDefaultState, handleScroll } from './utils';
import {
  VirtualListEvent,
  ScrollDirection,
  DEFAULT_LIST_ITEM_KEY,
  DEFAULT_LIST_ITEM_OBSERVER_ID,
  type GenericFunction,
  type IVirtualListState,
  type IVirtualListOptions,
  type IVirtualListCallBack,
  type IVirtualListChildrenSize,
} from './types';

export class BaseVirtualList<T extends Record<string, any>> {
  private _clientEl!: HTMLElement;
  private _bodyEl!: HTMLElement;

  private _fixOffset = false;
  private _abortFixOffset = false;
  private _forceFixOffset = false;
  private _fixed: boolean = false;
  private _minSize: number = 40;
  private _horizontal: boolean = false;
  private _direction: ScrollDirection = ScrollDirection.BACKWARD;
  private _itemKey: string = DEFAULT_LIST_ITEM_KEY;
  private _renderControl?: (
    begin: number,
    end: number,
  ) => { begin: number; end: number };

  private _list: T[] = [];
  private _renderList: T[] = [];
  private _sizeMap: Map<string, number> = new Map();
  private _resizeObserver: ResizeObserver | undefined = undefined;
  private _observerItemList: HTMLElement[] = [];
  private _emitEvents: IVirtualListCallBack<T> = {};
  private _fixOffsetMethod: null | GenericFunction = null;
  private _detachEventsFn: GenericFunction | undefined = undefined;
  private _state: IVirtualListState = getDefaultState();
  private _childrenSize: IVirtualListChildrenSize = {
    clientSize: 0,
    headerSize: 0,
    footerSize: 0,
    stickyHeaderSize: 0,
    stickyFooterSize: 0,
  };

  static create<T extends Record<string, any>>(
    options: IVirtualListOptions<T>,
    callback?: IVirtualListCallBack<T>,
  ) {
    return new BaseVirtualList(options, callback);
  }

  constructor(
    options: IVirtualListOptions<T>,
    callback?: IVirtualListCallBack<T>,
  ) {
    this._emitEvents = callback || {};
    this._init(options);
  }

  /**------------------ init start  -------------------------*/
  _initElement(options: IVirtualListOptions<T>) {
    const { clientEl, bodyEl } = options;
    if (!clientEl) {
      console.error('[Virtual List] ', 'clientEl are required');
      return;
    }
    if (!bodyEl) {
      console.error('[Virtual List] ', 'bodyEl are required');
      return;
    }
    this._clientEl = clientEl;
    this._bodyEl = bodyEl;
    this.observerEl(this._clientEl);
  }

  _initEvent() {
    const { detachEvents, attachEvents } = handleScroll(
      this._clientEl as HTMLElement,
      this._scroll,
      this._horizontal,
      true,
    );
    attachEvents();
    this._detachEventsFn = detachEvents;
  }

  _initState(options: IVirtualListOptions<T>) {
    this._list = options.list;
    this._fixed = !!options.fixed;
    this._minSize = options.minSize || 40;
    this._state.bufferTop = options.bufferTop || options.buffer || 0;
    this._state.bufferBottom = options.bufferBottom || options.buffer || 0;
    this._itemKey = options.itemKey || DEFAULT_LIST_ITEM_KEY;
    this._renderControl = options.renderControl;
    this._resizeObserver = this._createObserver();
    this._calcListTotalSize();
  }

  _init(options: IVirtualListOptions<T>) {
    this._initState(options);

    this._initElement(options);

    this._initEvent();
  }
  /**------------------  init end  -------------------------- */

  _getItemSize(id: string) {
    if (this._fixed) {
      return this._minSize;
    }
    return this._sizeMap.get(id) ?? this._minSize;
  }

  _setItemSize(id: string, size: number) {
    this._sizeMap.set(id, size);
  }

  _deleteItemSize(id: string) {
    this._sizeMap.delete(id);
  }

  // _getItemAlreadyRendered(id: string) {
  //   return this._sizeMap.has(id);
  // }

  _getItemPosByIndex(index: number) {
    if (this._fixed) {
      return {
        top: this._minSize * index,
        current: this._minSize,
        bottom: this._minSize * (index + 1),
      };
    }

    const { _itemKey } = this;
    let topReduce = this._childrenSize.headerSize;
    for (let i = 0; i <= index - 1; i += 1) {
      const currentSize = this._getItemSize(this._list[i]?.[_itemKey]);
      topReduce += currentSize;
    }
    const current = this._getItemSize(this._list[index]?.[_itemKey]);
    return {
      top: topReduce,
      current,
      bottom: topReduce + current,
    };
  }

  _getOffset() {
    return this._state.offset > 0 ? this._state.offset : 0;
  }

  // _fixDynamicOffset(targetId: string, changeItemSize: number, preSize: number) {
  //   const changeItemIndex = this._list.findIndex(
  //     (item) => item.id === targetId,
  //   );
  //   if (changeItemIndex === -1 || changeItemIndex < this._state.renderBegin)
  //     return;
  //   let preOffset = 0;
  //   for (let i = this._state.renderBegin; i < changeItemIndex; i++) {
  //     preOffset += this._getItemSize(this._list[i]?.[this._itemKey]);
  //   }
  //   if (Math.abs(this._state.transformDistance) > preOffset) {
  //     this._scroll(changeItemSize, false);
  //   } else {
  //   }
  // preOffset += preSize;
  // console.warn('xzc', 'fixed', 'third-', preOffset);
  // const realTransformDistance =
  //   preOffset - Math.abs(this._state.transformDistance);
  // if (preOffset - realTransformDistance > 0) {
  //   console.warn('xzc', 'fixed', 'fifth-');
  //   this._scroll(changeItemSize, false);
  // }
  // }

  _createObserver() {
    if (typeof ResizeObserver === 'undefined') {
      console.error('[Virtual List] ', 'ResizeObserver is not supported');
      return;
    }
    return new ResizeObserver((entries) => {
      let diff = 0;
      // let existItemDiff = 0;
      // let preSize = 0;
      // let targetId = '';
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).dataset.id;
        if (id) {
          const oldSize = this._getItemSize(id);
          // const isExist = this._getItemAlreadyRendered(id);
          let newSize = 0;
          if (entry.borderBoxSize) {
            const contentBoxSize = Array.isArray(entry.borderBoxSize)
              ? entry.borderBoxSize[0]
              : entry.borderBoxSize;
            newSize = this._horizontal
              ? contentBoxSize.inlineSize
              : contentBoxSize.blockSize;
          } else {
            newSize = this._horizontal
              ? entry.contentRect.width
              : entry.contentRect.height;
          }

          if (newSize === 0) {
            continue;
          }

          if (id === DEFAULT_LIST_ITEM_OBSERVER_ID.CLIENT) {
            this._childrenSize.clientSize = newSize;
            this._handleClientResize();
          } else if (id === DEFAULT_LIST_ITEM_OBSERVER_ID.HEADER) {
            this._childrenSize.headerSize = newSize;
          } else if (id === DEFAULT_LIST_ITEM_OBSERVER_ID.FOOTER) {
            this._childrenSize.footerSize = newSize;
          } else if (id === DEFAULT_LIST_ITEM_OBSERVER_ID.STICKY_HEADER) {
            this._childrenSize.stickyHeaderSize = newSize;
          } else if (id === DEFAULT_LIST_ITEM_OBSERVER_ID.STICKY_FOOTER) {
            this._childrenSize.stickyFooterSize = newSize;
          } else if (oldSize !== newSize) {
            this._setItemSize(id, newSize);
            diff += newSize - oldSize;
            // if (isExist) {
            //   targetId = id;
            //   preSize = oldSize;
            //   existItemDiff += newSize - oldSize;
            // }
            this._emitEvents[VirtualListEvent.UPDATE_ITEM_SIZE]?.(id, newSize);
          }
          this._emitEvents[VirtualListEvent.SIZE_CHANGE]?.(this._childrenSize);
        }
      }
      this._state.listTotalSize += diff;

      if (this._fixOffsetMethod) {
        this._fixOffsetMethod();
      }

      // if (existItemDiff !== 0) {
      //   // console.warn(
      //   //   'xzc',
      //   //   'fixed',
      //   //   'first-',
      //   //   targetId,
      //   //   existItemDiff,
      //   //   preSize,
      //   // );
      //   // this._fixDynamicOffset(targetId, existItemDiff, preSize);
      //   // this._scroll(existItemDiff, false);
      //   // this.scrollToOffset(this._state.offset);
      // } else
      if (
        (this._fixOffset || this._forceFixOffset) &&
        diff !== 0 &&
        !this._abortFixOffset
      ) {
        this._fixOffset = false;
        this._forceFixOffset = false;
        this._scroll(diff, false);
      }
      this._abortFixOffset = false;
    });
  }

  _updateBodyPosition() {
    this._bodyEl.style.transform = this._horizontal
      ? `translate(${this._state.transformDistance}px, 0)`
      : `translate(0, ${this._state.transformDistance}px)`;
  }

  _getTotalSize() {
    return (
      this._state.listTotalSize +
      this._childrenSize.headerSize +
      this._childrenSize.footerSize +
      this._childrenSize.stickyHeaderSize +
      this._childrenSize.stickyFooterSize
    );
  }

  _handleClientResize() {
    this._calcViews();
    this._updateRange(this._state.inViewBegin);
  }

  _calcListTotalSize() {
    if (this._fixed) {
      this._state.listTotalSize = this._minSize * this._list.length;
      return;
    }
    let re = 0;
    for (let i = 0; i <= this._list.length - 1; i += 1) {
      re += this._getItemSize(this._list[i]?.[this._itemKey]);
    }
    this._state.listTotalSize = re;
  }

  _updateVirtualSize() {
    let offset = 0;
    for (let i = 0; i < this._state.inViewBegin; i++) {
      offset += this._getItemSize(this._list[i]?.[this._itemKey]);
    }
    this._state.virtualSize = offset;
  }

  _scroll = (delta: number, withRaf = true) => {
    if (this._getTotalSize() - this._childrenSize.clientSize < 0) return;
    this._direction =
      delta < 0 ? ScrollDirection.FORWARD : ScrollDirection.BACKWARD;
    let offset = this._state.offset + delta;

    if (offset >= this._getTotalSize() - this._childrenSize.clientSize) {
      offset = this._getTotalSize() - this._childrenSize.clientSize;
    } else if (offset <= 0) {
      offset = 0;
    }

    if (offset === this._state.offset) {
      return;
    }

    this._state.offset = offset;

    this._emitEvents[VirtualListEvent.SCROLL]?.(this._state.offset);

    this._calcViewRange();

    if (withRaf) {
      requestAnimationFrame(() => {
        this._state.transformDistance =
          this._state.virtualSize - this._state.offset;
        this._updateBodyPosition();
      });
    } else {
      this._state.transformDistance =
        this._state.virtualSize - this._state.offset;
      this._updateBodyPosition();
    }

    this._emitEvents[VirtualListEvent.UPDATE_TRANSFORM_DISTANCE]?.(
      this._state.transformDistance,
    );
    this._checkCurrentStatus(this._direction);
  };

  _getRangeSize(range1: number, range2: number) {
    const start = Math.min(range1, range2);
    const end = Math.max(range1, range2);
    let re = 0;
    for (let i = start; i < end; i += 1) {
      re += this._getItemSize(this._list[i]?.[this._itemKey]);
    }
    return re;
  }

  _getVirtualSize2View() {
    return (
      this._state.virtualSize +
      this._getRangeSize(this._state.renderBegin, this._state.inViewBegin)
    );
  }

  _calcViews() {
    this._state.views =
      Math.ceil(this._childrenSize.clientSize / this._minSize) + 1;
  }

  _getSlotSize() {
    return (
      this._childrenSize.headerSize +
      this._childrenSize.footerSize +
      this._childrenSize.stickyHeaderSize +
      this._childrenSize.stickyFooterSize
    );
  }

  _checkCurrentStatus(targetDirection: ScrollDirection) {
    const { offset, scrollDistance, listTotalSize } = this._state;
    if (
      targetDirection === ScrollDirection.FORWARD &&
      offset - scrollDistance <= 0
    ) {
      this._emitEvents[VirtualListEvent.SCROLL_TO_TOP]?.(this._list[0]);
    }
    if (
      targetDirection === ScrollDirection.BACKWARD &&
      Math.round(offset + scrollDistance) >=
        Math.round(
          listTotalSize + this._getSlotSize() - this._childrenSize.clientSize,
        )
    ) {
      this._emitEvents[VirtualListEvent.SCROLL_TO_BOTTOM]?.(
        this._list[this._list.length - 1],
      );
    }
  }

  _calcViewRange() {
    const offsetWithNoHeader =
      this._state.offset - this._childrenSize.headerSize;
    let start = this._state.inViewBegin;
    let offsetReduce = this._getVirtualSize2View();
    if (offsetWithNoHeader < 0) {
      this._updateRange(0);
      return;
    }

    if (this._direction === ScrollDirection.FORWARD) {
      if (offsetWithNoHeader >= offsetReduce) {
        return;
      }

      for (let i = start - 1; i >= 0; i -= 1) {
        const currentSize = this._getItemSize(this._list[i]?.[this._itemKey]);
        offsetReduce -= currentSize;
        if (
          offsetReduce <= offsetWithNoHeader &&
          offsetWithNoHeader < offsetReduce + currentSize
        ) {
          start = i;
          break;
        }
      }
    }

    if (this._direction === ScrollDirection.BACKWARD) {
      if (offsetWithNoHeader <= offsetReduce) {
        return;
      }
      for (let i = start; i <= this._list.length - 1; i += 1) {
        const currentSize = this._getItemSize(this._list[i]?.[this._itemKey]);

        if (
          offsetReduce <= offsetWithNoHeader &&
          offsetWithNoHeader < offsetReduce + currentSize
        ) {
          start = i;
          break;
        }
        offsetReduce += currentSize;
      }
    }

    if (start !== this._state.inViewBegin) {
      this._updateRange(start);
    }
  }

  // 计算渲染内容的范围
  _calcRenderRange() {
    const { inViewBegin, inViewEnd, renderBegin, bufferTop, bufferBottom } =
      this._state;
    const oldRenderBegin = renderBegin;

    let newRenderBegin = inViewBegin;
    let newRenderEnd = inViewEnd;

    newRenderBegin = Math.max(0, newRenderBegin - bufferTop);
    newRenderEnd = Math.min(
      newRenderEnd + bufferBottom,
      this._list.length - 1 > 0 ? this._list.length - 1 : 0,
    );

    if (this._renderControl) {
      const { begin, end } = this._renderControl(newRenderBegin, newRenderEnd);
      newRenderBegin = begin;
      newRenderEnd = end;
    }

    this._state.renderBegin = newRenderBegin;
    this._state.renderEnd = newRenderEnd;
    if (newRenderBegin >= oldRenderBegin) {
      this._state.virtualSize += this._getRangeSize(
        newRenderBegin,
        oldRenderBegin,
      );
    } else {
      this._state.virtualSize -= this._getRangeSize(
        oldRenderBegin,
        newRenderBegin,
      );
      this._fixOffset = true;
    }

    this._renderList = this._list.slice(newRenderBegin, newRenderEnd + 1);
    this._emitEvents[VirtualListEvent.RENDER_LIST_CHANGE]?.(
      { renderBegin: newRenderBegin, renderEnd: newRenderEnd },
      this._renderList,
      this._bodyEl!,
    );
  }

  _updateRange(start: number) {
    this._state.inViewBegin = start;
    this._state.inViewEnd = Math.min(
      start + this._state.views,
      this._list.length - 1,
    );
    this._calcRenderRange();
  }

  /**------------------------  public methods - start --------------------- */
  scrollToOffset(targetOffset: number) {
    this._abortFixOffset = true;
    let offset = targetOffset;
    if (offset < 0) {
      offset = 0;
    } else if (offset > this._getTotalSize() - this._childrenSize.clientSize) {
      offset = this._getTotalSize() - this._childrenSize.clientSize;
    }
    let index = 0;
    let offsetReduce = 0;
    for (let i = 0; i < this._list.length; i += 1) {
      const currentSize = this._getItemSize(this._list[i]?.[this._itemKey]);
      if (offsetReduce + currentSize + this._childrenSize.headerSize > offset) {
        index = i;
        break;
      }
      offsetReduce += currentSize;
    }
    this._state.offset = offset;
    this._updateRange(index);
    this._state.renderBegin = Math.max(0, index - this._state.bufferTop);
    this._state.transformDistance =
      offsetReduce -
      offset -
      this._getRangeSize(this._state.renderBegin, this._state.inViewBegin);
    this._updateVirtualSize();
    this._updateBodyPosition();
  }

  scrollToIndex(index: number) {
    if (index < 0) {
      return;
    }

    if (index >= this._list.length - 1) {
      this.scrollToBottom();
      return;
    }

    let { top: lastOffset } = this._getItemPosByIndex(index);

    this.scrollToOffset(lastOffset);
    const fixToIndex = () => {
      const { top: offset } = this._getItemPosByIndex(index);
      this.scrollToOffset(offset);
      if (lastOffset !== offset) {
        lastOffset = offset;
        this._fixOffsetMethod = fixToIndex;
        return;
      }
      // 重置后如果不需要修正，将修正函数置空
      this._fixOffsetMethod = null;
    };
    this._fixOffsetMethod = fixToIndex;
    this._updateBodyPosition();
  }

  scrollIntoView(index: number) {
    const { top: targetMin, bottom: targetMax } =
      this._getItemPosByIndex(index);
    const offsetMin = this._getOffset();
    const offsetMax = this._getOffset() + this._childrenSize.clientSize;
    const currentSize = this._getItemSize(this._list[index]?.[this._itemKey]);
    if (
      targetMin < offsetMin &&
      offsetMin < targetMax &&
      currentSize < this._childrenSize.clientSize
    ) {
      this.scrollToOffset(targetMin);
      return;
    }
    if (
      targetMin + this._childrenSize.stickyHeaderSize < offsetMax &&
      offsetMax < targetMax + this._childrenSize.stickyHeaderSize &&
      currentSize < this._childrenSize.clientSize
    ) {
      this.scrollToOffset(
        targetMax -
          this._childrenSize.clientSize +
          this._childrenSize.stickyHeaderSize,
      );
      return;
    }

    if (targetMin + this._childrenSize.stickyHeaderSize >= offsetMax) {
      this.scrollToIndex(index);
      return;
    }

    if (targetMax <= offsetMin) {
      this.scrollToIndex(index);
      return;
    }
  }

  manualTopListChange(list: T[], isDelete = false) {
    this._calcListTotalSize();
    let changedListSize = 0;
    for (let i = 0; i < list.length; i++) {
      if (isDelete) {
        changedListSize += this._getItemSize(list[i][this._itemKey]);
      } else {
        changedListSize -= this._getItemSize(list[i][this._itemKey]);
      }
    }
    this._updateVirtualSize();
    if (isDelete) {
      this.scrollToOffset(this._state.offset - changedListSize);
    } else {
      this.scrollToOffset(this._state.offset + changedListSize);
      this._forceFixOffset = true;
      this._abortFixOffset = false;
    }
    this._calcViewRange();
  }

  scrollToTop() {
    this.scrollToOffset(0);
    this._checkCurrentStatus(ScrollDirection.FORWARD);

    const fixTopFn = () => {
      const directionKey = this._horizontal ? 'scrollLeft' : 'scrollTop';
      if (this._clientEl[directionKey] !== 0) {
        this.scrollToTop();
      }
      this._fixOffsetMethod = null;
    };
    this._fixOffsetMethod = fixTopFn;
    this._updateBodyPosition();
  }

  scrollToBottom() {
    this.scrollToOffset(this._getTotalSize() - this._childrenSize.clientSize);
    this._checkCurrentStatus(ScrollDirection.BACKWARD);

    const fixBottomFn = () => {
      if (
        Math.abs(
          Math.round(this._state.offset + this._childrenSize.clientSize) -
            Math.round(this._getTotalSize()),
        ) > 2
      ) {
        this.scrollToBottom();
      }
      this._fixOffsetMethod = null;
    };
    this._fixOffsetMethod = fixBottomFn;
    this._updateBodyPosition();
  }

  observerEl(el: HTMLElement) {
    if (!el) {
      console.error('[Virtual List] ', 'observer el is required');
      return;
    }
    if (!this._observerItemList.includes(el) && this._resizeObserver) {
      this._resizeObserver.observe(el);
      this._observerItemList.push(el);
    }
  }

  unObserverEl(el: HTMLElement) {
    if (!el) {
      console.error('[Virtual List] ', 'observer el is required');
      return;
    }
    if (this._observerItemList.includes(el) && this._resizeObserver) {
      this._resizeObserver.unobserve(el);
      this._observerItemList.splice(this._observerItemList.indexOf(el), 1);
    }
  }

  dispatchObservers(clearObserver = true) {
    if (!this._resizeObserver) return;
    for (let i = 0; i < this._observerItemList.length; i++) {
      this._resizeObserver.unobserve(this._observerItemList[i]);
    }
    if (clearObserver) this._resizeObserver = undefined;
    this._observerItemList = [];
  }

  reset() {
    this._state = getDefaultState();
    this._sizeMap.clear();
  }

  destroy() {
    this.dispatchObservers();
    this._detachEventsFn?.();
    this._sizeMap.clear();
  }

  scrollWithDelta(delta: number) {
    this._scroll(delta);
  }
  /**------------------------  public methods - end --------------------- */

  /**------------------------  public state - start --------------------- */
  get renderList() {
    return this._renderList || [];
  }

  get listClientEl() {
    return this._clientEl;
  }

  get childrenSize() {
    return this._childrenSize;
  }

  get listState() {
    return this._state;
  }

  get resizeObserver() {
    return this._resizeObserver;
  }

  get listTotalSize() {
    return this._getTotalSize();
  }
  /**------------------------  public state - end --------------------- */
}
