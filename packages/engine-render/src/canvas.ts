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

import { getDevicePixelRatio } from './basics/draw';
import { createCanvasElement } from './basics/tools';
import { UniverRenderingContext } from './context';

interface ICanvasProps {
    width?: number;
    height?: number;
    pixelRatio?: number;
}

/**
 * View Renderer constructor. It is a wrapper around native canvas element.
 * Usually you don't need to use it manually.
 * @constructor
 * @abstract
 * @param {Object} props
 * @param {Number} props.width
 * @param {Number} props.height
 * @param {Number} props.pixelRatio
 */
export class Canvas {
    isCache = false;

    private _pixelRatio = 1;

    private _canvasEle: HTMLCanvasElement;

    private _context: UniverRenderingContext;

    private _width = 0;

    private _height = 0;

    constructor(props?: ICanvasProps) {
        props = props || {};

        this._canvasEle = createCanvasElement();
        // set inline styles
        this._canvasEle.style.padding = '0';
        this._canvasEle.style.margin = '0';
        this._canvasEle.style.border = '0';
        this._canvasEle.style.background = 'transparent';
        this._canvasEle.style.position = 'absolute';
        this._canvasEle.style.top = '0';
        this._canvasEle.style.left = '0';

        // support focus
        this._canvasEle.tabIndex = 1;
        this._canvasEle.style.touchAction = 'none';
        this._canvasEle.style.outline = '0';

        this._context = new UniverRenderingContext(this._canvasEle?.getContext('2d')!);

        this.setSize(props.width, props.height, props.pixelRatio);
    }

    getCanvasEle() {
        return this._canvasEle;
    }

    /**
     * get canvas context
     * @method
     * @returns {CanvasContext} context
     */
    getContext() {
        return this._context;
    }

    getPixelRatio() {
        return this._pixelRatio;
    }

    getWidth() {
        return this._width;
    }

    getHeight() {
        return this._height;
    }

    setSize(width?: number, height?: number, pixelRatioParam?: number) {
        // this.setWidth(width || 0);
        // this.setHeight(height || 0);
        this._pixelRatio = pixelRatioParam || getDevicePixelRatio();

        if (width) {
            this._canvasEle.width = width * this._pixelRatio;

            this._width = this._canvasEle.width / this._pixelRatio;

            this._canvasEle.style.width = `${this._width}px`;
        }

        if (height) {
            this._canvasEle.height = height * this._pixelRatio;

            this._height = this._canvasEle.height / this._pixelRatio;

            this._canvasEle.style.height = `${this._height}px`;
        }

        this.getContext().setTransform(this._pixelRatio, 0, 0, this._pixelRatio, 0, 0);
    }

    setPixelRatio(pixelRatio: number) {
        if (this._width === 0 || this._height === 0) {
            return;
        }
        if (pixelRatio < 1) {
            pixelRatio = 1;
        }
        this.setSize(this._width, this._height, pixelRatio);
    }

    dispose() {
        this.clear();
        this._canvasEle.remove();
    }

    clear() {
        const ctx = this.getContext();
        ctx.clearRect(0, 0, this._width * this._pixelRatio, this._height * this._pixelRatio);
    }

    /**
     * to data url
     * @method
     * @param {String} mimeType
     * @param {Number} quality between 0 and 1 for jpg mime types
     * @returns {String} data url string
     */
    toDataURL(mimeType: string, quality: number) {
        try {
            // If this call fails (due to browser bug, like in Firefox 3.6),
            // then revert to previous no-parameter image/png behavior
            return this._canvasEle.toDataURL(mimeType, quality);
        } catch (e) {
            try {
                return this._canvasEle.toDataURL();
            } catch (err: unknown) {
                const { message } = err as Error;
                console.error(
                    `Unable to get data URL. ${message} For more info read https://universheet.net/docs/Canvas.html.`
                );
                return '';
            }
        }
    }
}

export class SceneCanvas extends Canvas {
    constructor(props: ICanvasProps = { width: 0, height: 0 }) {
        super(props);
        this.setSize(props.width!, props.height!);
    }
}

export class HitCanvas extends Canvas {
    hitCanvas = true;

    constructor(props: ICanvasProps = { width: 0, height: 0 }) {
        super(props);
        this.setSize(props.width!, props.height!);
    }
}
