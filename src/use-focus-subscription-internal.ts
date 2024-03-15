import { type MutableRefObject, useCallback, useEffect, useRef } from 'react';
import type { Observable, PartialObserver, Subscription } from 'rxjs';
import { useIsomorphicFocusEffect } from './use-isomorphic-focus-effect';

interface Observer<T> {
  next?: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;
}

type Args<TInput> = [
  Observable<TInput>, // inputs$
  PartialObserver<TInput> | ((value: TInput) => void) | null | undefined,
  ((error: any) => void) | null | undefined,
  (() => void) | null | undefined,
];

const toObserver = <T>(args: Args<T>): Observer<T> =>
  (args[1] as PartialObserver<T>)?.next
    ? (args[1] as Observer<T>)
    : {
        next: args[1] as Observer<T>['next'],
        error: args[2] as Observer<T>['error'],
        complete: args[3] as Observer<T>['complete'],
      };

/**
 *
 * @template TInput Input value within Observable.
 *
 * @param useCustomEffect useEffect or useLayoutEffect
 * @param args collected arguments
 */
export function useFocusSubscriptionInternal<TInput>(
  useCustomEffect: typeof useEffect,
  args: Args<TInput>
): MutableRefObject<Subscription | undefined> {
  const argsRef = useRef(args);
  const observerRef = useRef<Observer<TInput>>();
  const subscriptionRef = useRef<Subscription>();

  // Update the latest observable and callbacks
  // synchronously after render being committed
  useIsomorphicFocusEffect(() => {
    argsRef.current = args;
    observerRef.current = toObserver(args);
  });

  useCustomEffect(
    useCallback(() => {
      // keep in closure for checking staleness
      const input$ = argsRef.current[0];

      /* istanbul ignore if: Just in case the layoutEffect order is agnostic */
      if (!observerRef.current) {
        observerRef.current = toObserver(argsRef.current);
      }

      const subscription = input$.subscribe({
        next: (value) => {
          if (input$ === argsRef.current[0]) {
            observerRef.current!.next?.(value);
          }
          // else: stale observable
        },
        error: (error) => {
          if (input$ === argsRef.current[0]) {
            observerRef.current!.error
              ? observerRef.current!.error(error)
              : console.error(error);
          }
          // else: stale observable
        },
        complete: () => {
          if (input$ === argsRef.current[0]) {
            observerRef.current!.complete?.();
          }
          // else: stale observable
        },
      });

      subscriptionRef.current = subscription;

      return () => {
        subscription.unsubscribe();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [args[0]])
  );

  return subscriptionRef;
}
