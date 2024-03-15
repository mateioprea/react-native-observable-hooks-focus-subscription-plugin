import type { MutableRefObject } from 'react';
import type { Observable, PartialObserver, Subscription } from 'rxjs';
import { useFocusSubscriptionInternal } from './use-focus-subscription-internal';
import { useIsomorphicFocusEffect } from './use-isomorphic-focus-effect';

/**
 * Same as [[useSubscription]] except the subscription is established
 * under `useFocusEffect`.
 *
 *
 * @template TInput Input value within Observable.
 *
 * @param input$ Input Observable.
 * @param observer Observer
 */
export function useFocusSubscription<TInput>(
  input$: Observable<TInput>,
  observer?: PartialObserver<TInput>
): MutableRefObject<Subscription | undefined>;
/**
 * @template TInput Input value within Observable.
 *
 * @param input$ Input Observable.
 * @param next Notify when a new value is emitted.
 * @param error Notify when a new error is thrown.
 * @param complete Notify when the Observable is complete.
 */
export function useFocusSubscription<TInput>(
  input$: Observable<TInput>,
  next?: ((value: TInput) => void) | null | undefined,
  error?: ((error: any) => void) | null | undefined,
  complete?: (() => void) | null | undefined
): MutableRefObject<Subscription | undefined>;
export function useFocusSubscription<TInput>(
  input$: Observable<TInput>,
  observerOrNext$?:
    | PartialObserver<TInput>
    | ((value: TInput) => void)
    | null
    | undefined,
  error?: ((error: any) => void) | null | undefined,
  complete?: (() => void) | null | undefined
): MutableRefObject<Subscription | undefined> {
  return useFocusSubscriptionInternal(useIsomorphicFocusEffect, [
    input$,
    observerOrNext$,
    error,
    complete,
  ]);
}
