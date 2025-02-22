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

import { describe, expect, it } from 'vitest';

import { moveMatrixArray, ObjectMatrix } from '../object-matrix';

describe('test ObjectMatrix', () => {
    const getPrimitiveObj = () => ({
        1: { 1: '123', 2: '222', 3: '333' },
        2: { 1: '111', 2: '121', 3: '313' },
    });

    it('test deleteValue', () => {
        const matrix = new ObjectMatrix(getPrimitiveObj());
        matrix.realDeleteValue(1, 1);
        expect(matrix.getValue(1, 1)).toBe(undefined);
        expect(matrix.getSizeOf()).toBe(2);
        matrix.realDeleteValue(1, 2);
        matrix.realDeleteValue(1, 3);
        expect(matrix.getValue(1, 2)).toBe(undefined);
        expect(matrix.getValue(1, 3)).toBe(undefined);
        expect(matrix.getRow(1)).toBe(undefined);
        expect(matrix.getSizeOf()).toBe(1);
    });

    it('test forValue', () => {
        const matrix = new ObjectMatrix(getPrimitiveObj());
        matrix.realDeleteValue(1, 1);
        matrix.realDeleteValue(1, 2);
        matrix.realDeleteValue(1, 3);

        const rowList: number[] = [];
        const colList: number[] = [];
        matrix.forValue((row, col, value) => {
            rowList.push(row);
            colList.push(col);
        });

        expect(rowList).toEqual([2, 2, 2]);
        expect(colList).toEqual([1, 2, 3]);
    });

    it('test moveMatrixArray', () => {
        const primitiveObject = getPrimitiveObj();
        moveMatrixArray(0, 1, 2, primitiveObject);
        expect(primitiveObject).toStrictEqual({
            0: { 1: '123', 2: '222', 3: '333' },
            2: { 1: '111', 2: '121', 3: '313' },
        });
    });
    it('test moveMatrixArray', () => {
        const primitiveObject = getPrimitiveObj();
        moveMatrixArray(2, 1, 0, primitiveObject);
        expect(primitiveObject).toStrictEqual({
            0: { 1: '111', 2: '121', 3: '313' },
            2: { 1: '123', 2: '222', 3: '333' },
        });
    });
});
