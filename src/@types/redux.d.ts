import { Action, Reducer } from 'redux';
import { Dispatch } from 'react';

// reducer类型
export type ActionType<T> = Action<string> & { data: T };
export type ReducersType<T, U extends keyof T> = Reducer<T, ActionType<T[U]>>;
export type SelfReducersType<T> = Reducer<T, ActionType<T>>;
// 自定义获取reducer的hook
export type DispatchActionType<T> = Dispatch<ActionType<{[key in keyof T]?: T[key]}>>;

// 根配置
export interface InRootState {
}