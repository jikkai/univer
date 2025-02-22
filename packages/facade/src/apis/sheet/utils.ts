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

import type { ICellData, ICellV, IObjectMatrixPrimitiveType, IRange, Nullable } from '@univerjs/core';
import {
    HorizontalAlign,
    isCellV,
    isFormulaString,
    isICellData,
    ObjectMatrix,
    Tools,
    VerticalAlign,
} from '@univerjs/core';

export type FHorizontalAlignment = 'left' | 'center' | 'normal';
export type FVerticalAlignment = 'top' | 'middle' | 'bottom';

export function transformFacadeHorizontalAlignment(value: FHorizontalAlignment): HorizontalAlign {
    switch (value) {
        case 'left':
            return HorizontalAlign.LEFT;
        case 'center':
            return HorizontalAlign.CENTER;
        case 'normal':
            return HorizontalAlign.RIGHT;
        default:
            throw new Error(`Invalid horizontal alignment: ${value}`);
    }
}

export function transformCoreHorizontalAlignment(value: HorizontalAlign): FHorizontalAlignment {
    switch (value) {
        case HorizontalAlign.LEFT:
            return 'left';
        case HorizontalAlign.CENTER:
            return 'center';
        case HorizontalAlign.RIGHT:
            return 'normal';
        default:
            throw new Error(`Invalid horizontal alignment: ${value}`);
    }
}

export function transformFacadeVerticalAlignment(value: FVerticalAlignment): VerticalAlign {
    switch (value) {
        case 'top':
            return VerticalAlign.TOP;
        case 'middle':
            return VerticalAlign.MIDDLE;
        case 'bottom':
            return VerticalAlign.BOTTOM;
        default:
            throw new Error(`Invalid vertical alignment: ${value}`);
    }
}

export function transformCoreVerticalAlignment(value: VerticalAlign): FVerticalAlignment {
    switch (value) {
        case VerticalAlign.TOP:
            return 'top';
        case VerticalAlign.MIDDLE:
            return 'middle';
        case VerticalAlign.BOTTOM:
            return 'bottom';
        default:
            throw new Error(`Invalid vertical alignment: ${value}`);
    }
}

/**
 * covert cell value to cell data
 * @param value
 * @returns
 */
export function covertCellValue(value: ICellV | ICellData): ICellData {
    if (isFormulaString(value)) {
        return {
            f: value as string,
        };
    }
    if (isCellV(value)) {
        return {
            v: value as Nullable<ICellV>,
        };
    }
    if (isICellData(value)) {
        return value;
    }

    // maybe {}
    return value as ICellData;
}

/**
 * covert cell value array or matrix to cell data
 * @param value
 * @param range
 * @returns
 */
export function covertCellValues(
    value: ICellV[][] | IObjectMatrixPrimitiveType<ICellV> | ICellData[][] | IObjectMatrixPrimitiveType<ICellData>,
    range: IRange
): IObjectMatrixPrimitiveType<ICellData> {
    const cellValue = new ObjectMatrix<ICellData>();
    const { startRow, startColumn, endRow, endColumn } = range;

    if (Tools.isArray(value)) {
        for (let r = 0; r <= endRow - startRow; r++) {
            for (let c = 0; c <= endColumn - startColumn; c++) {
                cellValue.setValue(r + startRow, c + startColumn, covertCellValue(value[r][c]));
            }
        }
    } else {
        const valueMatrix = new ObjectMatrix(value as IObjectMatrixPrimitiveType<ICellData | ICellV>);
        valueMatrix.forValue((r, c, v) => {
            cellValue.setValue(r, c, covertCellValue(v));
        });
    }

    return cellValue.getMatrix();
}
