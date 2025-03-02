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

import { Address } from './address';
import { FUNCTION_NAMES_LOOKUP } from './function-names';
import { Indirect } from './indirect';
import { Offset } from './offset';
import { Vlookup } from './vlookup';

export const functionLookup = [
    [Address, FUNCTION_NAMES_LOOKUP.ADDRESS],
    [Indirect, FUNCTION_NAMES_LOOKUP.INDIRECT],
    [Offset, FUNCTION_NAMES_LOOKUP.OFFSET],
    [Vlookup, FUNCTION_NAMES_LOOKUP.VLOOKUP],
];
