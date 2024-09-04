import { VirtualList, VirtualListEvent } from 'virtual-list-core';
import { IVirtualListVanillaOptions } from './types';
import { VirtualListNode } from './node';

export function createVirtualLst<T extends { id: string; text: string }>(
  options: IVirtualListVanillaOptions<T>,
  // callback:
) {
  let virtualListIns: VirtualList<T> | null = null;
  let virtualListNodeIns: VirtualListNode<T> | null = null;

  const createListClient = () => {
    if (options.clientClass) {
      const clientEls = document.querySelectorAll(`.${options.clientClass}`);
      if (clientEls && clientEls.length > 0) {
        return clientEls[0] as HTMLElement;
      }
    }
    const client = document.createElement('div');
    client.className = 'virt-list__client';
    client.style.width = '100%';
    client.style.height = '100%';
    client.style.position = 'relative';
    client.dataset.id = 'client';
    return client;
  };

  const createListBodyContainer = () => {
    let bodyContainerEl: HTMLElement | null = null;
    if (options.bodyContainerClass) {
      const bodyContainerEls = document.querySelectorAll(
        `.${options.bodyClass}`,
      );
      if (bodyContainerEls && bodyContainerEls.length > 0) {
        bodyContainerEl = bodyContainerEls[0] as HTMLElement;
      }
    }
    if (!bodyContainerEl) {
      bodyContainerEl = document.createElement('div');
    }
    bodyContainerEl.style.height = '100%';
    bodyContainerEl.style.width = '100%';
    if (!options.horizontal) {
      bodyContainerEl.style.overflowX = 'auto';
      bodyContainerEl.style.overflowY = 'hidden';
    } else {
      bodyContainerEl.style.overflowX = 'hidden';
      bodyContainerEl.style.overflowY = 'auto';
    }
    return bodyContainerEl;
  };

  const createListBody = () => {
    let bodyEl: HTMLElement | null = null;
    if (options.bodyClass) {
      const bodyEls = document.querySelectorAll(`.${options.bodyClass}`);
      if (bodyEls && bodyEls.length > 0) {
        bodyEl = bodyEls[0] as HTMLElement;
      }
    }
    if (!bodyEl) {
      bodyEl = document.createElement('div');
    }
    bodyEl.style.willChange = 'transform';
    const scrollDistance = virtualListIns
      ? virtualListIns.listState.transformDistance
      : 0;
    bodyEl.style.transform = options.horizontal
      ? `translate(${scrollDistance}px, 0)`
      : `translate(0, ${scrollDistance}px)`;
    return bodyEl;
  };

  const initContainer = () => {
    if (!options.containerClass) {
      console.error('containerClass is required');
      return null;
    }
    const containers = document.querySelectorAll(`.${options.containerClass}`);
    if (!containers || containers.length === 0) {
      console.error('containerEl is not found');
      return null;
    }
    return containers[0] as HTMLElement;
  };

  // const onRenderChange = (
  //   renderRange: { renderBegin: number; renderEnd: number },
  //   renderList: T[],
  //   el: HTMLElement | Element | null,
  // ) => {
  //   _render(renderList, el);

  //   if (!el?.childNodes || el?.childNodes.length === 0) {
  //     return;
  //   }

  //   for (let i = 0; i < el.childNodes.length; i++) {
  //     const node = el.childNodes[i] as HTMLElement;
  //     virtualListIns!.observerEl(node);
  //   }
  // };

  // const _render = (renderList: T[], clientEl: HTMLElement | Element | null) => {
  //   const html = renderList
  //     .map((item) => {
  //       return options.customRender
  //         ? options.customRender(item)
  //         : `<div data-id="${item.id}" class="${options.itemClass}">${item.text}</div>`;
  //     })
  //     .join('');
  //   if (clientEl) {
  //     clientEl.innerHTML = html;
  //   }
  // };

  const onRenderChange = (
    renderRange: { renderBegin: number; renderEnd: number },
    renderList: T[],
    el: HTMLElement | Element | null,
  ) => {
    virtualListNodeIns?.renderNode(renderList, renderRange);
  };

  const onRenderRangeUpdate = (begin: number, end: number) => {
    console.log('onRenderRangeUpdate', begin, end);
  };

  const onVirtualSizeUpdate = (virtualSize: number) => {
    console.log('onVirtualSizeUpdate', virtualSize);
  };

  const onViewRangeUpdate = (begin: number, end: number) => {
    console.log('onViewRangeUpdate', begin, end);
  };

  const onItemSizeUpdate = (id: string, size: number) => {
    console.log('onItemSizeUpdate', id, size);
  };

  const onTransformDistanceUpdate = (distance: number) => {
    console.log('onTransformDistanceUpdate', distance);
  };

  const onScroll = (offset: number) => {
    console.log('onScroll', offset);
  };

  const onScrollToTop = (firstItem: T) => {
    console.log('onScrollToTop', firstItem);
  };

  const onScrollToBottom = (lastItem: T) => {
    console.log('onScrollToBottom', lastItem);
  };

  const init = () => {
    // 初始化列表挂载容器
    const virtualListContainerEl: HTMLElement | null = initContainer();
    if (!virtualListContainerEl) {
      return;
    }
    // 初始化列表
    const virtualListClientEl: HTMLElement = createListClient();
    const virtualListBodyContainerEl: HTMLElement = createListBodyContainer();
    const virtualListBodyEl: HTMLElement = createListBody();
    virtualListBodyContainerEl.appendChild(virtualListBodyEl);
    virtualListClientEl.appendChild(virtualListBodyContainerEl);
    virtualListContainerEl.appendChild(virtualListClientEl);

    // 初始化虚拟列表实例
    virtualListIns = new VirtualList(
      {
        ...options,
        clientEl: virtualListClientEl,
        bodyEl: virtualListBodyEl,
      },
      {
        [VirtualListEvent.UPDATE_RENDER_RANGE]: onRenderRangeUpdate,
        [VirtualListEvent.UPDATE_VIRTUAL_SIZE]: onVirtualSizeUpdate,
        [VirtualListEvent.UPDATE_VIEW_RANGE]: onViewRangeUpdate,
        [VirtualListEvent.UPDATE_ITEM_SIZE]: onItemSizeUpdate,
        [VirtualListEvent.UPDATE_TRANSFORM_DISTANCE]: onTransformDistanceUpdate,
        [VirtualListEvent.SCROLL]: onScroll,
        [VirtualListEvent.SCROLL_TO_TOP]: onScrollToTop,
        [VirtualListEvent.SCROLL_TO_BOTTOM]: onScrollToBottom,
        [VirtualListEvent.RENDER_LIST_CHANGE]: onRenderChange,
      },
    );

    virtualListNodeIns = new VirtualListNode(
      virtualListBodyEl,
      options,
      virtualListIns,
    );
  };

  init();

  return virtualListIns;
}
