/**
 * Copyright 2023-present DreamNum Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Nullable } from '@univerjs/core';

import type { Vector2 } from '../basics/vector2';
import type { UniverRenderingContext } from '../context';
import type { ThinScene } from '../thin-scene';
import type { Rect } from './rect';

export interface IScrollBarProps {
    thumbMargin?: number;
    thumbLengthRatio?: number;
    thumbBackgroundColor?: string;
    thumbHoverBackgroundColor?: string;
    thumbActiveBackgroundColor?: string;
    barSize?: number;
    barBackgroundColor?: string;
    barBorder?: number;
    barBorderColor?: string;

    enableHorizontal?: boolean;
    enableVertical?: boolean;

    mainScene?: ThinScene;
}

export class BaseScrollBar {
    enableHorizontal: boolean = true;

    enableVertical: boolean = true;

    horizontalThumbWidth: number = 0;

    horizontalMinusMiniThumb: number = 0;

    horizontalBarWidth: number = 0;

    verticalThumbHeight: number = 0;

    verticalBarHeight: number = 0;

    verticalMinusMiniThumb: number = 0;

    horizonBarRect: Nullable<Rect>;

    horizonThumbRect: Nullable<Rect>;

    verticalBarRect: Nullable<Rect>;

    verticalThumbRect: Nullable<Rect>;

    placeholderBarRect: Nullable<Rect>;

    get limitX() {
        if (!this.horizonThumbRect?.visible) {
            return 0;
        }
        return this.horizontalBarWidth - this.horizontalThumbWidth;
    }

    get limitY() {
        if (!this.verticalThumbRect?.visible) {
            return 0;
        }
        return this.verticalBarHeight - this.verticalThumbHeight;
    }

    get ratioScrollX(): number {
        if (
            this.enableHorizontal === false ||
            this.horizontalThumbWidth === undefined ||
            this.horizontalBarWidth === undefined
        ) {
            return 1;
        }
        return (
            ((this.horizontalThumbWidth - this.horizontalMinusMiniThumb) * this.miniThumbRatioX) /
            this.horizontalBarWidth
        );
    }

    get ratioScrollY(): number {
        if (
            this.enableVertical === false ||
            this.verticalThumbHeight === undefined ||
            this.verticalBarHeight === undefined
        ) {
            return 1;
        }
        return (
            ((this.verticalThumbHeight - this.verticalMinusMiniThumb) * this.miniThumbRatioY) / this.verticalBarHeight
        );
    }

    get miniThumbRatioX() {
        const limit = this.horizontalBarWidth - this.horizontalThumbWidth;

        if (limit === 0) {
            return 0;
        }

        const actual = this.horizontalBarWidth - (this.horizontalThumbWidth - this.horizontalMinusMiniThumb);

        if (actual === 0) {
            return 0;
        }

        return limit / actual;
    }

    get miniThumbRatioY() {
        const limit = this.verticalBarHeight - this.verticalThumbHeight;

        if (limit === 0) {
            return 0;
        }

        const actual = this.verticalBarHeight - (this.verticalThumbHeight - this.verticalMinusMiniThumb);

        if (actual === 0) {
            return 0;
        }

        return limit / actual;
    }

    pick(coord: Vector2) {
        if (this.horizonThumbRect?.isHit(coord)) {
            return this.horizonThumbRect;
        }

        if (this.verticalThumbRect?.isHit(coord)) {
            return this.verticalThumbRect;
        }

        if (this.horizonBarRect?.isHit(coord)) {
            return this.horizonBarRect;
        }

        if (this.verticalBarRect?.isHit(coord)) {
            return this.verticalBarRect;
        }

        return null;
    }

    dispose() {
        this.horizonBarRect?.dispose();
        this.horizonThumbRect?.dispose();
        this.verticalBarRect?.dispose();
        this.verticalThumbRect?.dispose();
        this.placeholderBarRect?.dispose();
    }

    hasHorizonThumb() {
        return this.horizonThumbRect?.visible || false;
    }

    hasVerticalThumb() {
        return this.verticalThumbRect?.visible || false;
    }

    resize(
        parentWidth: Nullable<number> = 0,
        parentHeight: Nullable<number> = 0,
        contentWidth: number = 0,
        contentHeight: number = 0
    ) {}

    makeDirty(state: boolean) {}

    render(ctx: UniverRenderingContext, left: number = 0, top: number = 0) {}
}
