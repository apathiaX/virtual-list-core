import { getDefaultState, handleScroll } from './utils';
import {
  type IVirtualListCallBack,
  type IVirtualListState,
  type IVirtualListChildrenSize,
  type IVirtualListOptions,
  VirtualListEvent,
  ScrollDirection,
} from './types';

export class VirtualList<T> {
  private clientEl!: HTMLElement;
  private bodyEl!: HTMLElement;

  private list: T[] = [];
  private fixed: boolean = false;
  private minSize: number = 40;
  private horizontal: boolean = false;
  private sizeMap: Map<string, number> = new Map();
  private _renderList: T[] = [];
  private resizeObserver: ResizeObserver | undefined = undefined;
  private observerItemList: HTMLElement[] = [];
  private emitEvents: IVirtualListCallBack<T> = {};
  private detachEventsFn: (() => void) | undefined = undefined;
  private direction: ScrollDirection = ScrollDirection.BACKWARD;
  private itemKey: string = 'id';
  private renderControl?: (
    begin: number,
    end: number,
  ) => { begin: number; end: number };
  private abortFixOffset = false;

  private state: IVirtualListState = getDefaultState();
  private childrenSize: IVirtualListChildrenSize = {
    clientSize: 0,
    headerSize: 0,
    footerSize: 0,
    stickyHeaderSize: 0,
    stickyFooterSize: 0,
  };

  constructor(
    options: IVirtualListOptions<T>,
    callback?: IVirtualListCallBack<T>,
  ) {
    this.emitEvents = callback || {};
    this._init(options);
  }

  _initElement(options: IVirtualListOptions<T>) {
    const { containerEl, clientEl, bodyEl } = options;
    if (!containerEl) {
      console.error('containerEl are required');
      return;
    }
    if (!clientEl) {
      console.error('clientEl are required');
      return;
    }
    if (!bodyEl) {
      console.error('bodyEl are required');
      return;
    }
    this.clientEl = clientEl;
    this.bodyEl = bodyEl;
    this.observerEl(this.clientEl);
  }

  _initEvent() {
    // 初始化滚动事件
    const { detachEvents, attachEvents } = handleScroll(
      this.clientEl as HTMLElement,
      this._scroll,
      this.horizontal,
      true,
    );
    attachEvents();
    this.detachEventsFn = detachEvents;
  }

  _initState(options: IVirtualListOptions<T>) {
    this.list = options.list;
    this.fixed = !!options.fixed;
    this.minSize = options.minSize || 40;
    this.state.bufferTop = options.bufferTop || options.buffer || 0;
    this.state.bufferBottom = options.bufferBottom || options.buffer || 0;
    this.itemKey = options.itemKey || 'id';
    this.renderControl = options.renderControl;
    this.resizeObserver = this._createObserver();
  }

  _init(options: IVirtualListOptions<T>) {
    this._initState(options);

    this._initElement(options);

    this._initEvent();
  }

  render() {
    this.calcListTotalSize();
    this.calcViews();
    this._updateRange(this.state.inViewBegin);
    this._calcViewRange();
    this.updateTotalVirtualSize();
    this._calcRenderRange();
  }

  getItemSize(id: string) {
    if (this.fixed) {
      return this.minSize;
    }
    return this.sizeMap.get(id) ?? this.minSize;
  }

  setItemSize(id: string, size: number) {
    this.sizeMap.set(id, size);
  }

  deleteItemSize(id: string) {
    this.sizeMap.delete(id);
  }

  getItemPosByIndex(index: number) {
    if (this.fixed) {
      return {
        top: this.minSize * index,
        current: this.minSize,
        bottom: this.minSize * (index + 1),
      };
    }

    const { itemKey } = this;
    let topReduce = this.childrenSize.headerSize;
    for (let i = 0; i <= index - 1; i += 1) {
      const currentSize = this.getItemSize((this.list[i] as any)?.[itemKey]);
      topReduce += currentSize;
    }
    const current = this.getItemSize((this.list[index] as any)?.[itemKey]);
    return {
      top: topReduce,
      current,
      bottom: topReduce + current,
    };
  }

  scrollToOffset(targetOffset: number) {
    // 拖动滚动条时，改成增量计算的方式
    this.abortFixOffset = true;
    let offset = targetOffset;
    if (offset < 0) {
      offset = 0;
    } else if (offset > this.getTotalSize() - this.childrenSize.clientSize) {
      offset = this.getTotalSize() - this.childrenSize.clientSize;
    }
    // 找到当前offset小于当前 offset 的最大的index
    let index = 0;
    let offsetReduce = 0;
    for (let i = 0; i < this.list.length; i += 1) {
      const currentSize = this.getItemSize(
        (this.list[i] as any)?.[this.itemKey],
      );
      if (offsetReduce + currentSize + this.childrenSize.headerSize > offset) {
        index = i;
        break;
      }
      offsetReduce += currentSize;
    }
    this.state.offset = offset;
    this._updateRange(index);
    // 需要计算一下 renderBegin 不然计算不准
    this.state.renderBegin = Math.max(0, index - this.state.bufferTop);
    // 实际的滚动距离 = 目标可视区域展示的第一个元素的偏移量 + 渲染列表第一个元素到可视区域第一个元素的距离
    this.state.transformDistance =
      offsetReduce -
      offset -
      this.getRangeSize(this.state.renderBegin, this.state.inViewBegin);
    this.updateTotalVirtualSize();
  }

  scrollToIndex(index: number) {
    if (index < 0) {
      return;
    }

    // 如果要去的位置大于长度，那么就直接调用去底部的方法
    if (index >= this.list.length - 1) {
      this.scrollToBottom();
      return;
    }

    let { top: lastOffset } = this.getItemPosByIndex(index);

    this.scrollToOffset(lastOffset);
    const fixToIndex = () => {
      const { top: offset } = this.getItemPosByIndex(index);
      this.scrollToOffset(offset);
      if (lastOffset !== offset) {
        lastOffset = offset;
        // fixTaskFn = fixToIndex;
        return;
      }
      // 重置后如果不需要修正，将修正函数置空
      // fixTaskFn = null;
    };
    // fixTaskFn = fixToIndex;
  }

  getOffset() {
    return this.state.offset > 0 ? this.state.offset : 0;
  }

  scrollIntoView(index: number) {
    const { top: targetMin, bottom: targetMax } = this.getItemPosByIndex(index);
    const offsetMin = this.getOffset();
    const offsetMax = this.getOffset() + this.childrenSize.clientSize;
    const currentSize = this.getItemSize(this.list[index]?.[this.itemKey]);
    if (
      targetMin < offsetMin &&
      offsetMin < targetMax &&
      currentSize < this.childrenSize.clientSize
    ) {
      // 如果目标元素上方看不到，底部看得到，那么滚动到顶部部看得到就行了
      this.scrollToOffset(targetMin);
      return;
    }
    if (
      targetMin + this.childrenSize.stickyHeaderSize < offsetMax &&
      offsetMax < targetMax + this.childrenSize.stickyHeaderSize &&
      currentSize < this.childrenSize.clientSize
    ) {
      // 如果目标元素上方看得到，底部看不到，那么滚动到底部看得到就行了
      this.scrollToOffset(
        targetMax -
          this.childrenSize.clientSize +
          this.childrenSize.stickyHeaderSize,
      );
      return;
    }

    // 屏幕下方
    if (targetMin + this.childrenSize.stickyHeaderSize >= offsetMax) {
      this.scrollToIndex(index);
      return;
    }

    // 屏幕上方
    if (targetMax <= offsetMin) {
      this.scrollToIndex(index);
      return;
    }

    // 在中间就不动了
  }

  deletedList2Top(deletedList: T[]) {
    this.calcListTotalSize();
    let deletedListSize = 0;
    deletedList.forEach((item) => {
      deletedListSize += this.getItemSize(item[this.itemKey]);
    });
    this.updateTotalVirtualSize();
    this.scrollToOffset(this.state.offset - deletedListSize);
    this._calcViewRange();
  }

  addedList2Top(addedList: T[]) {
    this.calcListTotalSize();
    let addedListSize = 0;
    addedList.forEach((item) => {
      addedListSize += this.getItemSize(item[this.itemKey]);
    });
    this.updateTotalVirtualSize();
    this.scrollToOffset(this.state.offset + addedListSize);
    // forceFixOffset = true;
    // abortFixOffset = false;
    this._calcViewRange();
  }

  _createObserver() {
    if (typeof ResizeObserver === 'undefined') {
      console.error('ResizeObserver is not supported');
      return;
    }
    return new ResizeObserver((entries) => {
      let diff = 0;
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).dataset.id;
        if (id) {
          const oldSize = this.getItemSize(id);
          let newSize = 0;
          // https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver
          if (entry.borderBoxSize) {
            const contentBoxSize = Array.isArray(entry.borderBoxSize)
              ? entry.borderBoxSize[0]
              : entry.borderBoxSize;
            newSize = this.horizontal
              ? contentBoxSize.inlineSize
              : contentBoxSize.blockSize;
          } else {
            newSize = this.horizontal
              ? entry.contentRect.width
              : entry.contentRect.height;
          }

          if (newSize === 0) {
            continue;
          }

          if (id === 'client') {
            this.childrenSize.clientSize = newSize;
            this.handleClientResize();
          } else if (id === 'header') {
            this.childrenSize.headerSize = newSize;
          } else if (id === 'footer') {
            this.childrenSize.footerSize = newSize;
          } else if (id === 'stickyHeader') {
            this.childrenSize.stickyHeaderSize = newSize;
          } else if (id === 'stickyFooter') {
            this.childrenSize.stickyFooterSize = newSize;
          } else if (oldSize !== newSize) {
            this.setItemSize(id, newSize);
            diff += newSize - oldSize;
            this.emitEvents[VirtualListEvent.UPDATE_ITEM_SIZE]?.(id, newSize);
          }
        }

        this.state.listTotalSize += diff;

        this.calcListTotalSize();
      }
    });
  }

  updateBodyPosition() {
    this.bodyEl.style.transform = this.horizontal
      ? `translate(${this.state.transformDistance}px, 0)`
      : `translate(0, ${this.state.transformDistance}px)`;
  }

  scrollToTop() {
    this.scrollToOffset(0);
    this.checkCurrentStatus(ScrollDirection.FORWARD);

    const fixTopFn = () => {
      const directionKey = this.horizontal ? 'scrollLeft' : 'scrollTop';
      // 因为纠正滚动条会有误差，所以这里需要再次纠正
      if (this.clientEl[directionKey] !== 0) {
        this.scrollToTop();
      }
      // fixTaskFn = null;
    };
    // fixTaskFn = fixTopFn;
  }

  scrollToBottom() {
    this.scrollToOffset(this.getTotalSize() - this.childrenSize.clientSize);
    this.checkCurrentStatus(ScrollDirection.BACKWARD);

    const fixBottomFn = () => {
      if (
        Math.abs(
          Math.round(this.state.offset + this.childrenSize.clientSize) -
            Math.round(this.getTotalSize()),
        ) > 2
      ) {
        this.scrollToBottom();
      }
      // fixTaskFn = null;
    };
    // fixTaskFn = fixBottomFn;
  }

  dispatchObservers() {
    if (!this.resizeObserver) return;
    for (let i = 0; i < this.observerItemList.length; i++) {
      this.resizeObserver.unobserve(this.observerItemList[i]);
    }
  }

  observerEl(el: HTMLElement) {
    if (!el) {
      console.error('el is required');
      return;
    }
    if (!this.observerItemList.includes(el) && this.resizeObserver) {
      this.resizeObserver.observe(el);
      this.observerItemList.push(el);
    }
  }

  getTotalSize() {
    return (
      this.state.listTotalSize +
      this.childrenSize.headerSize +
      this.childrenSize.footerSize +
      this.childrenSize.stickyHeaderSize +
      this.childrenSize.stickyFooterSize
    );
  }

  handleClientResize() {
    this.calcViews();
    this._updateRange(this.state.inViewBegin);
  }

  calcListTotalSize() {
    if (this.fixed) {
      this.state.listTotalSize = this.minSize * this.list.length;
      return;
    }
    let re = 0;
    for (let i = 0; i <= this.list.length - 1; i += 1) {
      re += this.getItemSize((this.list[i] as any)?.[this.itemKey]);
    }
    this.state.listTotalSize = re;
  }

  updateTotalVirtualSize() {
    let offset = 0;
    for (let i = 0; i < this.state.inViewBegin; i++) {
      offset += this.getItemSize((this.list[i] as any)?.[this.itemKey]);
    }
    this.state.virtualSize = offset;
  }

  _scroll = (delta: number, withRaf = true) => {
    if (this.getTotalSize() - this.childrenSize.clientSize < 0) return;
    this.direction =
      delta < 0 ? ScrollDirection.FORWARD : ScrollDirection.BACKWARD;
    let offset = this.state.offset + delta;

    if (offset >= this.getTotalSize() - this.childrenSize.clientSize) {
      offset = this.getTotalSize() - this.childrenSize.clientSize;
    } else if (offset <= 0) {
      offset = 0;
    }

    if (offset === this.state.offset) {
      return;
    }

    this.state.offset = offset;

    this.emitEvents[VirtualListEvent.SCROLL]?.(this.state.offset);

    this._calcViewRange();

    if (withRaf) {
      requestAnimationFrame(() => {
        this.state.transformDistance =
          this.state.virtualSize - this.state.offset;
        this.updateBodyPosition();
      });
    } else {
      this.state.transformDistance = this.state.virtualSize - this.state.offset;
      this.updateBodyPosition();
    }

    this.emitEvents[VirtualListEvent.UPDATE_TRANSFORM_DISTANCE]?.(
      this.state.transformDistance,
    );
    this.checkCurrentStatus(this.direction);
  };

  getRangeSize(range1: number, range2: number) {
    const start = Math.min(range1, range2);
    const end = Math.max(range1, range2);
    let re = 0;
    for (let i = start; i < end; i += 1) {
      re += this.getItemSize((this.list[i] as any)?.[this.itemKey]);
    }
    return re;
  }

  getVirtualSize2View() {
    return (
      this.state.virtualSize +
      this.getRangeSize(this.state.renderBegin, this.state.inViewBegin)
    );
  }

  calcViews() {
    this.state.views =
      Math.ceil(this.childrenSize.clientSize / this.minSize) + 1;
  }

  getSlotSize() {
    return (
      this.childrenSize.headerSize +
      this.childrenSize.footerSize +
      this.childrenSize.stickyHeaderSize +
      this.childrenSize.stickyFooterSize
    );
  }

  checkCurrentStatus(targetDirection: ScrollDirection) {
    const { offset, scrollDistance, listTotalSize } = this.state;
    if (
      targetDirection === ScrollDirection.FORWARD &&
      offset - scrollDistance <= 0
    ) {
      this.emitEvents[VirtualListEvent.SCROLL_TO_TOP]?.(this.list[0]);
    }
    if (
      targetDirection === 'backward' &&
      Math.round(offset + scrollDistance) >=
        Math.round(
          listTotalSize + this.getSlotSize() - this.childrenSize.clientSize,
        )
    ) {
      this.emitEvents[VirtualListEvent.SCROLL_TO_BOTTOM]?.(
        this.list[this.list.length - 1],
      );
    }
  }

  reset() {
    this.state = getDefaultState();
    this.sizeMap.clear();
  }

  // 结算可视区域的范围
  _calcViewRange() {
    const offsetWithNoHeader = this.state.offset - this.childrenSize.headerSize;
    let start = this.state.inViewBegin;
    let offsetReduce = this.getVirtualSize2View();
    if (offsetWithNoHeader < 0) {
      this._updateRange(0);
      return;
    }

    if (this.direction === 'forward') {
      if (offsetWithNoHeader >= offsetReduce) {
        return;
      }

      for (let i = start - 1; i >= 0; i -= 1) {
        const currentSize = this.getItemSize(
          (this.list[i] as any)?.[this.itemKey],
        );
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

    if (this.direction === 'backward') {
      if (offsetWithNoHeader <= offsetReduce) {
        return;
      }
      for (let i = start; i <= this.list.length - 1; i += 1) {
        const currentSize = this.getItemSize(
          (this.list[i] as any)?.[this.itemKey],
        );

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

    // 节流
    if (start !== this.state.inViewBegin) {
      this._updateRange(start);
    }
  }

  // 计算渲染内容的范围
  _calcRenderRange() {
    const { inViewBegin, inViewEnd, renderBegin, bufferTop, bufferBottom } =
      this.state;
    const oldRenderBegin = renderBegin;

    let newRenderBegin = inViewBegin;
    let newRenderEnd = inViewEnd;

    newRenderBegin = Math.max(0, newRenderBegin - bufferTop);
    newRenderEnd = Math.min(
      newRenderEnd + bufferBottom,
      this.list.length - 1 > 0 ? this.list.length - 1 : 0,
    );

    if (this.renderControl) {
      const { begin, end } = this.renderControl(newRenderBegin, newRenderEnd);
      newRenderBegin = begin;
      newRenderEnd = end;
    }

    this.state.renderBegin = newRenderBegin;
    this.state.renderEnd = newRenderEnd;
    if (newRenderBegin > renderBegin) {
      this.state.virtualSize += this.getRangeSize(
        newRenderBegin,
        oldRenderBegin,
      );
    } else {
      this.state.virtualSize -= this.getRangeSize(
        oldRenderBegin,
        newRenderBegin,
      );
    }

    this._renderList = this.list.slice(newRenderBegin, newRenderEnd + 1);
    this.emitEvents[VirtualListEvent.RENDER_LIST_CHANGE]?.(
      this._renderList,
      this.bodyEl!,
    );
  }

  _updateRange(start: number) {
    this.state.inViewBegin = start;
    this.state.inViewEnd = Math.min(
      start + this.state.views,
      this.list.length - 1,
    );
    this._calcRenderRange();
  }

  _destroy() {
    this.dispatchObservers();
    this.detachEventsFn?.();
  }

  get renderList() {
    return this._renderList || [];
  }

  get listClientEl() {
    return this.clientEl;
  }

  get listState() {
    return this.state;
  }
}
