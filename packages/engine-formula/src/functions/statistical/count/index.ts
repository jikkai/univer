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

import type { ArrayValueObject } from '../../../engine/value-object/array-value-object';
import type { BaseValueObject } from '../../../engine/value-object/base-value-object';
import { NumberValueObject } from '../../../engine/value-object/primitive-object';
import { BaseFunction } from '../../base-function';

export class Count extends BaseFunction {
    override calculate(...variants: BaseValueObject[]) {
        let accumulatorAll: BaseValueObject = new NumberValueObject(0);
        for (let i = 0; i < variants.length; i++) {
            let variant = variants[i];

            if (variant.isError()) {
                continue;
            }

            if (variant.isArray()) {
                variant = (variant as ArrayValueObject).count();
                accumulatorAll = accumulatorAll.plus(variant as BaseValueObject);
            } else {
                if (!variant.isNull() && !variant.isString()) {
                    accumulatorAll = accumulatorAll.plus(new NumberValueObject(1));
                }
            }
        }

        return accumulatorAll;
    }
}
