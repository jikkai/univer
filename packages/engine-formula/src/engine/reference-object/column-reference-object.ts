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

import type { IRange } from '@univerjs/core';
import { deserializeRangeWithSheet } from '@univerjs/core';

import { ErrorType } from '../../basics/error-type';
import { ErrorValueObject } from '../value-object/base-value-object';
import { BaseReferenceObject } from './base-reference-object';

export class ColumnReferenceObject extends BaseReferenceObject {
    constructor(token: string) {
        super(token);
        const grid = deserializeRangeWithSheet(token);
        this.setForcedUnitIdDirect(grid.unitId);
        this.setForcedSheetName(grid.sheetName);
        const range: IRange = {
            startColumn: grid.range.startColumn,
            startRow: NaN,
            endColumn: -1,
            endRow: NaN,
        };
        this.setRangeData(range);
    }

    override isColumn() {
        return true;
    }

    override unionBy(referenceObject: BaseReferenceObject) {
        if (!referenceObject.isColumn()) {
            return ErrorValueObject.create(ErrorType.REF);
        }

        const columnReferenceObject = referenceObject as ColumnReferenceObject;
        if (
            columnReferenceObject.getForcedSheetName() !== undefined &&
            columnReferenceObject.getForcedSheetName() !== ''
        ) {
            return ErrorValueObject.create(ErrorType.REF);
        }

        const currentRangeData = this.getRangeData();

        // if (currentRangeData.endColumn !== -1) {
        //     return ErrorValueObject.create(ErrorType.REF);
        // }

        const newColumn = columnReferenceObject.getRangeData().startColumn;

        const column = currentRangeData.startColumn;

        if (newColumn > column) {
            currentRangeData.endColumn = newColumn;
        } else {
            currentRangeData.startColumn = newColumn;
            currentRangeData.endColumn = column;
        }

        return this;
    }
}
