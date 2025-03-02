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

import { AbsoluteRefType, RANGE_TYPE } from '../../types/interfaces/i-range';
import {
    deserializeRangeWithSheet,
    getAbsoluteRefTypeWithSingleString,
    getAbsoluteRefTypeWitString,
    serializeRange,
    serializeRangeToRefString,
} from '../reference';

describe('Test Reference', () => {
    it('getAbsoluteRefTypeWithSingleString', () => {
        expect(getAbsoluteRefTypeWithSingleString('A4')).toEqual(AbsoluteRefType.NONE);

        expect(getAbsoluteRefTypeWithSingleString('$A4')).toEqual(AbsoluteRefType.COLUMN);

        expect(getAbsoluteRefTypeWithSingleString('A$4')).toEqual(AbsoluteRefType.ROW);

        expect(getAbsoluteRefTypeWithSingleString('$A$4')).toEqual(AbsoluteRefType.ALL);
    });

    it('getAbsoluteRefTypeWitString', () => {
        expect(getAbsoluteRefTypeWitString('A5')).toStrictEqual({ startAbsoluteRefType: AbsoluteRefType.NONE });

        expect(getAbsoluteRefTypeWitString('A5:B10')).toStrictEqual({
            startAbsoluteRefType: AbsoluteRefType.NONE,
            endAbsoluteRefType: AbsoluteRefType.NONE,
        });

        expect(getAbsoluteRefTypeWitString('A5:B$10')).toStrictEqual({
            startAbsoluteRefType: AbsoluteRefType.NONE,
            endAbsoluteRefType: AbsoluteRefType.ROW,
        });

        expect(getAbsoluteRefTypeWitString('$A$5:$B$10')).toStrictEqual({
            startAbsoluteRefType: AbsoluteRefType.ALL,
            endAbsoluteRefType: AbsoluteRefType.ALL,
        });
    });

    it('serializeRange', () => {
        expect(
            serializeRange({
                startColumn: 0,
                endColumn: 10,
                startRow: 5,
                endRow: 10,
            })
        ).toEqual('A6:K11');

        expect(
            serializeRange({
                startColumn: 0,
                endColumn: 10,
                startRow: 5,
                endRow: 10,
                rangeType: RANGE_TYPE.COLUMN,
            })
        ).toEqual('A:K');

        expect(
            serializeRange({
                startColumn: 0,
                endColumn: 10,
                startRow: 5,
                endRow: 10,
                rangeType: RANGE_TYPE.ROW,
            })
        ).toEqual('6:11');

        expect(
            serializeRange({
                startColumn: 0,
                endColumn: 10,
                startRow: 5,
                endRow: 10,
                rangeType: RANGE_TYPE.ALL,
            })
        ).toEqual('6:11');
    });

    it('serializeRangeToRefString', () => {
        expect(
            serializeRangeToRefString({
                range: {
                    startColumn: 0,
                    endColumn: 10,
                    startRow: 5,
                    endRow: 10,
                    rangeType: RANGE_TYPE.COLUMN,
                },
                sheetName: 'sheet1',
                unitId: 'workbook1',
            })
        ).toEqual('[workbook1]sheet1!A:K');
    });

    it('deserializeRangeWithSheet', () => {
        expect(deserializeRangeWithSheet('[workbook1]sheet1!A5:B10')).toStrictEqual({
            range: {
                endAbsoluteRefType: 0,
                endColumn: 1,
                endRow: 9,
                startAbsoluteRefType: 0,
                startColumn: 0,
                startRow: 4,
            },
            sheetName: 'sheet1',
            unitId: 'workbook1',
        });

        expect(deserializeRangeWithSheet('[workbook2]sheet1!A5:B$10')).toStrictEqual({
            range: {
                endAbsoluteRefType: AbsoluteRefType.ROW,
                endColumn: 1,
                endRow: 9,
                startAbsoluteRefType: 0,
                startColumn: 0,
                startRow: 4,
            },
            sheetName: 'sheet1',
            unitId: 'workbook2',
        });

        expect(deserializeRangeWithSheet('[workbook2]sheet1!A:B')).toStrictEqual({
            range: {
                endAbsoluteRefType: AbsoluteRefType.NONE,
                endColumn: 1,
                endRow: NaN,
                startAbsoluteRefType: AbsoluteRefType.NONE,
                startColumn: 0,
                startRow: NaN,
            },
            sheetName: 'sheet1',
            unitId: 'workbook2',
        });

        expect(deserializeRangeWithSheet('[workbook2]sheet1!10:100')).toStrictEqual({
            range: {
                endAbsoluteRefType: AbsoluteRefType.NONE,
                endColumn: NaN,
                endRow: 99,
                startAbsoluteRefType: AbsoluteRefType.NONE,
                startColumn: NaN,
                startRow: 9,
            },
            sheetName: 'sheet1',
            unitId: 'workbook2',
        });

        expect(deserializeRangeWithSheet('10:100')).toStrictEqual({
            range: {
                endAbsoluteRefType: AbsoluteRefType.NONE,
                endColumn: NaN,
                endRow: 99,
                startAbsoluteRefType: AbsoluteRefType.NONE,
                startColumn: NaN,
                startRow: 9,
            },
            sheetName: '',
            unitId: '',
        });

        expect(deserializeRangeWithSheet(`[workbook2]'sheet-1'!10:100`)).toStrictEqual({
            range: {
                endAbsoluteRefType: AbsoluteRefType.NONE,
                endColumn: NaN,
                endRow: 99,
                startAbsoluteRefType: AbsoluteRefType.NONE,
                startColumn: NaN,
                startRow: 9,
            },
            sheetName: 'sheet-1',
            unitId: 'workbook2',
        });
    });
});
