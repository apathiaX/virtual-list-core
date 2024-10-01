import {
  useEffect,
  useRef,
  type CSSProperties,
  type RefObject,
  type ReactNode,
} from 'react';
import { useVirtualList } from '../hooks/useVirtualList';
import type { IObserverItemProps, IVirtualListProps } from '../types';
import { VirtualScrollbar } from './Scrollbar';
import '../styles/index.css';
import { ScrollbarDirection } from 'virtual-list-core';

export const ObserverItem = (props: IObserverItemProps) => {
  const { id, resizeObserver, customRender } = props;

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      resizeObserver?.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        resizeObserver?.unobserve(currentObserverRef);
      }
    };
  }, [resizeObserver]);

  return (
    <div ref={observerRef} data-id={id}>
      {customRender()}
    </div>
  );
};

export const VirtualList = (props: IVirtualListProps<Record<string, any>>) => {
  const {
    header,
    footer,
    content,
    scrollbar,
    stickyHeader,
    stickyFooter,
    horizontal,
    headerClass,
    headerStyle,
    footerClass,
    footerStyle,
    stickyFooterClass,
    stickyFooterStyle,
    stickyHeaderClass,
    stickyHeaderStyle,
    disableScrollbar,
    scrollbarBgColor,
    scrollbarThumbClass,
    scrollbarThumbStyle,
    scrollbarTrickerClass,
    scrollbarTrickerStyle,
  } = props;

  const {
    clientRefEl,
    listRefEl,
    headerRefEl,
    footerRefEl,
    stickyHeaderRefEl,
    stickyFooterRefEl,
    offset,
    clientSize,
    listTotalSize,
    headerSize,
    footerSize,
    renderList,
    virtualListIns,
    onScrollBarScroll,
  } = useVirtualList(props);

  const renderChild = (options: {
    childRef: RefObject<HTMLDivElement>;
    childClass: string | undefined;
    childStyle: CSSProperties | undefined;
    child: (() => ReactNode) | undefined;
  }) => {
    const { child, childRef, childClass, childStyle } = options;
    return child ? (
      <div ref={childRef} className={childClass} style={childStyle}>
        {child()}
      </div>
    ) : null;
  };

  const renderContent = () => {
    return (
      <div className="list-body__content">
        {renderList.map((item, index) => {
          return (
            <ObserverItem
              id={item.id}
              key={item.id}
              resizeObserver={
                virtualListIns
                  ? virtualListIns.current?.resizeObserver
                  : undefined
              }
              customRender={() => content?.(item, index)}
            ></ObserverItem>
          );
        })}
      </div>
    );
  };

  const renderScrollbar = () => {
    if (disableScrollbar) return null;
    if (scrollbar) return scrollbar();

    return (
      <VirtualScrollbar
        direction={
          horizontal
            ? ScrollbarDirection.HORIZONTAL
            : ScrollbarDirection.VERTICAL
        }
        listSize={listTotalSize + headerSize + footerSize}
        scrollFrom={
          offset / (listTotalSize + headerSize + footerSize - clientSize)
        }
        clientSize={clientSize}
        bgColor={scrollbarBgColor}
        thumbClass={scrollbarThumbClass}
        thumbStyle={scrollbarThumbStyle}
        trickerClass={scrollbarTrickerClass}
        trickerStyle={scrollbarTrickerStyle}
        onScroll={onScrollBarScroll}
      />
    );
  };

  return (
    <div className="virtual-list__client" ref={clientRefEl} data-id="client">
      <div className="list-body__container">
        {renderChild({
          childRef: stickyHeaderRefEl,
          childClass: `virtual-list__sticky-header ${stickyHeaderClass}`,
          childStyle: stickyHeaderStyle,
          child: stickyHeader,
        })}
        <div className="list-body" ref={listRefEl}>
          {renderChild({
            childRef: headerRefEl,
            childClass: headerClass,
            childStyle: headerStyle,
            child: header,
          })}
          <div className="list-body__content">{renderContent()}</div>
          {renderChild({
            childRef: footerRefEl,
            childClass: footerClass,
            childStyle: footerStyle,
            child: footer,
          })}
        </div>
        {renderChild({
          childRef: stickyFooterRefEl,
          childClass: `virtual-list__sticky-footer ${stickyFooterClass}`,
          childStyle: stickyFooterStyle,
          child: stickyFooter,
        })}
      </div>
      {renderScrollbar()}
    </div>
  );
};
