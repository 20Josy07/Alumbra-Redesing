import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

type ErrorEvents = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// We can't use the built-in EventEmitter typings because they don't
// support strongly-typed events.
interface TypedEventEmitter<T extends Record<string, (...args: any[]) => void>> {
  on<E extends keyof T>(event: E, listener: T[E]): this;
  off<E extends keyof T>(event: E, listener: T[E]): this;
  emit<E extends keyof T>(event: E, ...args: Parameters<T[E]>): boolean;
}

class ErrorEventEmitter extends (EventEmitter as new () => TypedEventEmitter<ErrorEvents>) {}

export const errorEmitter = new ErrorEventEmitter();
