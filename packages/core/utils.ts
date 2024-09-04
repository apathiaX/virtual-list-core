import { IVirtualListState } from './types';

export function getDefaultState(): IVirtualListState {
  return {
    views: 0,

    // 滚动距离
    offset: 0,
    // 不包含插槽的高度
    listTotalSize: 0,
    // 虚拟占位尺寸，是从0到renderBegin的尺寸
    virtualSize: 0,
    // 可视区的起始下标
    inViewBegin: 0,
    // 可视区的结束下标
    inViewEnd: 0,

    // buffer的起始下标
    renderBegin: 0,
    // buffer的结束下标
    renderEnd: 0,

    bufferTop: 0,
    bufferBottom: 0,

    transformDistance: 0,
    scrollDistance: 0,
  };
}
export function handleScroll(
  el: HTMLElement,
  scrollFn: (distance: number) => void,
  horizontal: boolean = false,
  smooth: boolean = true,
) {
  let startX = 0;
  let startY = 0;
  let preDelta = 0;
  let startTime = 0;
  let momentum = 0;

  function handleTouchStart(evt: TouchEvent) {
    document.body.style.overflow = 'hidden';
    const { pageX, pageY } = evt.touches[0];
    startX = pageX;
    startY = pageY;
    startTime = Date.now();
    momentum = 0; // Reset momentum on new touchstart
  }

  function easeOutCubic(x: number) {
    return 1 - Math.pow(1 - x, 3);
  }

  /** move 事件模拟平滑滚动 */
  function smoothScrollTo(targetDistance: number) {
    const duration = 500; // 滚动动画持续时间，单位为毫秒
    let startTime: null | number = null;
    let preDistance = 0;

    function scrollStep(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = easeOutCubic(progress);
      const scrollDistance = targetDistance * easeProgress;

      scrollFn(scrollDistance - preDistance);
      preDistance = scrollDistance;

      if (progress < 1) {
        requestAnimationFrame(scrollStep);
      }
    }

    requestAnimationFrame(scrollStep);
  }

  function handleTouchEnd() {
    document.body.style.overflow = 'scroll';
    preDelta = 0;

    if (!smooth) return;

    const acceleration = -0.005; // 减速率（像素/毫秒²）
    const distance = (momentum * momentum) / (2 * Math.abs(acceleration));

    smoothScrollTo(momentum > 0 ? distance : -distance);
  }

  function handleMobileScroll(evt: TouchEvent) {
    if (!startX || !startY) {
      return;
    }

    let moveEndX = evt.touches[0].pageX;
    let moveEndY = evt.touches[0].pageY;

    let diffX = moveEndX - startX;
    let diffY = moveEndY - startY;

    return {
      deltaX: -diffX,
      deltaY: -diffY,
    };
  }

  function onMobileScroll(evt: TouchEvent) {
    const mobileDelta = handleMobileScroll(evt);
    const deltaX = mobileDelta?.deltaX || 0;
    const deltaY = mobileDelta?.deltaY || 0;
    const timeDiff = Date.now() - startTime;

    const isPreventDefault = horizontal
      ? Math.abs(deltaY) < Math.abs(deltaX)
      : Math.abs(deltaX) < Math.abs(deltaY);
    if (isPreventDefault) {
      evt.preventDefault();
    }

    const delta = horizontal ? deltaX : deltaY;
    momentum = (delta - preDelta) / timeDiff;

    scrollFn(delta - preDelta);
    preDelta = delta;
    startTime = Date.now();
  }

  function onScroll(evt: WheelEvent) {
    evt.stopPropagation();
    // 沿主轴方向滚动时，阻止滚轮事件的默认行为，防止触发页面滚动
    // 沿副轴方向滚动时，不阻止滚轮事件的默认行为，保持页面滚动
    const isPreventDefault = horizontal
      ? Math.abs(evt.deltaY) < Math.abs(evt.deltaX)
      : Math.abs(evt.deltaX) < Math.abs(evt.deltaY);
    if (isPreventDefault) {
      evt.preventDefault();
    }

    const delta = horizontal ? evt.deltaX : evt.deltaY;
    scrollFn(delta);
  }

  function attachEvents() {
    el.addEventListener('wheel', onScroll);
    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchmove', onMobileScroll);
    el.addEventListener('touchend', handleTouchEnd);
  }

  function detachEvents() {
    el.removeEventListener('wheel', onScroll);
    el.removeEventListener('touchstart', handleTouchStart);
    el.removeEventListener('touchmove', onMobileScroll);
    el.removeEventListener('touchend', handleTouchEnd);
  }

  return {
    attachEvents,
    detachEvents,
  };
}

export function handleScrollbarEvents(
  thumbEl: HTMLElement,
  eventFn: {
    onThumbUp: (e: Event) => void;
    onThumbMove: (e: MouseEvent | TouchEvent) => void;
    onThumbDown: (e: MouseEvent | TouchEvent) => void;
  },
) {
  let onselectstartStore: null | typeof document.onselectstart = null;
  const { onThumbUp, onThumbMove, onThumbDown } = eventFn;

  const detachEvents = () => {
    window.removeEventListener('mousemove', onThumbMove);
    window.removeEventListener('touchmove', onThumbMove);
    window.removeEventListener('mouseup', onThumbUp);
    window.removeEventListener('touchend', onThumbUp);

    if (!thumbEl) return;

    onselectstartStore = document.onselectstart;
    document.onselectstart = () => false;

    thumbEl.addEventListener('touchmove', onThumbMove);
    thumbEl.addEventListener('touchend', onThumbUp);
  };

  const attachEvents = () => {
    window.addEventListener('mousemove', onThumbMove);
    window.addEventListener('touchmove', onThumbMove);
    window.addEventListener('mouseup', onThumbUp);
    window.addEventListener('touchend', onThumbUp);
    document.onselectstart = onselectstartStore;
    onselectstartStore = null;

    if (!thumbEl) return;

    thumbEl.removeEventListener('touchmove', onThumbMove);
    thumbEl.removeEventListener('touchend', onThumbMove);
  };

  return {
    attachEvents,
    detachEvents,
  };
}

export function applyStyles(
  element: HTMLElement,
  styles: Record<string, string | number>,
) {
  for (const property in styles) {
    if (styles.hasOwnProperty(property)) {
      element.style[property] = styles[property];
    }
  }
}
