/*
 * Copyright (c) 2022-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { h } from 'preact';

export type ClickHandler<T extends EventTarget = HTMLButtonElement> = h.JSX.MouseEventHandler<T>;
export type ChangeHandler<T extends EventTarget = HTMLInputElement> = h.JSX.TargetedEvent<T>;
export type BlurHandler = (value: string | number | boolean, event: FocusEvent) => void;

type E<T extends EventTarget> = h.JSX.TargetedEvent<T> & { target: T };

export type SubmitEvent = h.JSX.TargetedEvent<HTMLFormElement, Event>;
export type ClickEvent<T extends EventTarget = HTMLButtonElement> = E<T>;
export type ChangeEvent<T extends EventTarget = HTMLFormElement> = h.JSX.TargetedEvent<T, Event>;
export type FocusEvent<T extends EventTarget = HTMLElement> = h.JSX.TargetedFocusEvent<T>;
