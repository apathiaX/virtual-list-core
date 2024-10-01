import { Scrollbar, ScrollbarEvent } from 'virtual-list-core';
import { useEffect, useRef } from 'react';
import type { IScrollbarProps } from '../types';
import '../styles/scrollbar.css';

export const VirtualScrollbar = (props: IScrollbarProps) => {
  const {
    direction,
    clientSize,
    listSize,
    scrollFrom,
    bgColor,
    thumbClass,
    trickerClass,
    thumbStyle,
    trickerStyle,
    onScroll,
  } = props;
  const scrollbarIns = useRef<Scrollbar | null>(null);

  const thumbRef = useRef<HTMLDivElement | null>(null);
  const trickRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollbarIns.current = new Scrollbar(
      {
        thumbEl: thumbRef.current!,
        trickerEl: trickRef.current!,
        direction: direction,
        clientSize: clientSize,
        listSize: clientSize,
        scrollFrom: scrollFrom,
        bgColor: bgColor,
        thumbClass: thumbClass,
        trickerClass: trickerClass,
        thumbStyle: thumbStyle,
        trickerStyle: trickerStyle,
      },
      {
        [ScrollbarEvent.SCROLL]: (offsetRatio: number) => {
          onScroll?.(offsetRatio);
        },
      },
    );
    return () => {
      if (scrollbarIns.current) {
        scrollbarIns.current.destroy();
        scrollbarIns.current = null;
      }
    };
  }, [
    bgColor,
    clientSize,
    direction,
    onScroll,
    scrollFrom,
    thumbClass,
    thumbStyle,
    trickerClass,
    trickerStyle,
  ]);

  useEffect(() => {
    scrollbarIns.current?.updateClientSize(clientSize);
  }, [clientSize]);

  useEffect(() => {
    scrollbarIns.current?.updateListSize(listSize);
  }, [listSize]);

  useEffect(() => {
    scrollbarIns.current?.updateScrollFrom(scrollFrom);
  }, [scrollFrom]);

  return (
    <div
      className={`scrollbar-container ${trickerClass}`}
      ref={trickRef}
      style={trickerStyle}
    >
      <div
        className={`scrollbar-item ${thumbClass}`}
        ref={thumbRef}
        style={thumbStyle}
      ></div>
    </div>
  );
};
