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
import { Disposable } from '@univerjs/core';

import { ErrorType } from '../basics/error-type';
import type { IFunctionNames } from '../basics/function';
import type { FunctionVariantType, NodeValueType } from '../engine/reference-object/base-reference-object';
import type { ArrayValueObject } from '../engine/value-object/array-value-object';
import { type BaseValueObject, ErrorValueObject } from '../engine/value-object/base-value-object';
import type { PrimitiveValueType } from '../engine/value-object/primitive-object';

export class BaseFunction extends Disposable {
    private _unitId: Nullable<string>;
    private _subUnitId: Nullable<string>;
    private _row: number = -1;
    private _column: number = -1;

    constructor(private _name: IFunctionNames) {
        super();
    }

    get name() {
        return this._name;
    }

    get unitId() {
        return this._unitId;
    }

    get subUnitId() {
        return this._subUnitId;
    }

    get row() {
        return this._row;
    }

    get column() {
        return this._column;
    }

    isAsync() {
        return false;
    }

    isAddress() {
        return false;
    }

    isCustom() {
        return false;
    }

    setRefInfo(unitId: string, subUnitId: string, row: number, column: number) {
        this._unitId = unitId;
        this._subUnitId = subUnitId;
        this._row = row;
        this._column = column;
    }

    calculateCustom(
        ...arg: Array<PrimitiveValueType | PrimitiveValueType[][]>
    ): PrimitiveValueType | PrimitiveValueType[][] {
        return null;
    }

    calculate(...arg: BaseValueObject[]): NodeValueType {
        return ErrorValueObject.create(ErrorType.VALUE);
    }

    checkArrayType(variant: FunctionVariantType) {
        return variant.isReferenceObject() || (variant.isValueObject() && (variant as BaseValueObject).isArray());
    }

    /**
     * Starting with 1
     * For instance, The column number (starting with 1 for the left-most column of table_array) that contains the return value.
     * https://support.microsoft.com/en-us/office/vlookup-function-0bbc8083-26fe-4963-8ab8-93a18ad188a1
     * @param indexNum
     * @returns
     */
    getIndexNumValue(indexNum: BaseValueObject) {
        if (indexNum.isArray()) {
            indexNum = (indexNum as ArrayValueObject).getFirstCell();
        }

        if (indexNum.isBoolean()) {
            const colIndexNumV = indexNum.getValue() as boolean;
            if (colIndexNumV === false) {
                return new ErrorValueObject(ErrorType.VALUE);
            }

            return 1;
        }
        if (indexNum.isString()) {
            const colIndexNumV = Number(indexNum.getValue() as string);
            if (isNaN(colIndexNumV)) {
                return new ErrorValueObject(ErrorType.REF);
            }
        } else if (indexNum.isNumber()) {
            const colIndexNumV = indexNum.getValue() as number;
            return colIndexNumV;
        }

        return new ErrorValueObject(ErrorType.VALUE);
    }

    /**
     * A logical value that specifies 1/TRUE , 0/FALSE, default 1
     * For instance range_lookup, A logical value that specifies whether you want VLOOKUP to find an approximate or an exact match
     * Approximate match - 1/TRUE
     * Exact match - 0/FALSE
     * https://support.microsoft.com/en-us/office/vlookup-function-0bbc8083-26fe-4963-8ab8-93a18ad188a1
     * For instance A1, A logical value that specifies what type of reference is contained in the cell ref_text.
     * If a1 is TRUE or omitted, ref_text is interpreted as an A1-style reference.
     * If a1 is FALSE, ref_text is interpreted as an R1C1-style reference.
     * https://support.microsoft.com/zh-cn/office/indirect-%E5%87%BD%E6%95%B0-474b3a3a-8a26-4f44-b491-92b6306fa261
     * @param logicValueObject
     * @returns
     */
    getZeroOrOneByOneDefault(logicValueObject?: BaseValueObject) {
        if (logicValueObject == null) {
            return 1;
        }

        let logicValue = 1;

        if (logicValueObject.isArray()) {
            logicValueObject = (logicValueObject as ArrayValueObject).getFirstCell();
        }

        if (logicValueObject.isBoolean()) {
            const logicV = logicValueObject.getValue() as boolean;
            if (logicV === false) {
                logicValue = 0;
            }
        } else if (logicValueObject.isString()) {
            return;
        } else if (logicValueObject.isNumber()) {
            const logicV = logicValueObject.getValue() as number;
            if (logicV === 0) {
                logicValue = 0;
            }
        }

        return logicValue;
    }
}
