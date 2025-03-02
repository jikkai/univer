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

export default {
    ABS: {
        description: `Returns the absolute value of a number. The absolute value of a number is the number without its sign.`,
        abstract: `Returns the absolute value of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/abs-function-3420200f-5628-4e8c-99da-c99d7c87713c',
            },
        ],
        functionParameter: {
            number: { name: 'number', detail: 'The real number of which you want the absolute value.' },
        },
    },
    ACOS: {
        description: `Returns the arccosine, or inverse cosine, of a number. The arccosine is the angle whose cosine is number. The returned angle is given in radians in the range 0 (zero) to pi.`,
        abstract: `Returns the arccosine of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/acos-function-cb73173f-d089-4582-afa1-76e5524b5d5b',
            },
        ],
        functionParameter: {
            number: { name: 'number', detail: 'The cosine of the angle you want and must be from -1 to 1.' },
        },
    },
    ACOSH: {
        description: `Returns the inverse hyperbolic cosine of a number. The number must be greater than or equal to 1. The inverse hyperbolic cosine is the value whose hyperbolic cosine is number, so ACOSH(COSH(number)) equals number.`,
        abstract: `Returns the inverse hyperbolic cosine of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/acosh-function-e3992cc1-103f-4e72-9f04-624b9ef5ebfe',
            },
        ],
        functionParameter: {
            number: { name: 'number', detail: 'Any real number equal to or greater than 1.' },
        },
    },
    ACOT: {
        description: `Returns the principal value of the arccotangent, or inverse cotangent, of a number.`,
        abstract: `Returns the arccotangent of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/acot-function-dc7e5008-fe6b-402e-bdd6-2eea8383d905',
            },
        ],
        functionParameter: {
            number: {
                name: 'number',
                detail: 'Number is the cotangent of the angle you want. This must be a real number.',
            },
        },
    },
    ACOTH: {
        description: `Returns the hyperbolic arccotangent of a number`,
        abstract: `Returns the hyperbolic arccotangent of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/acoth-function-cc49480f-f684-4171-9fc5-73e4e852300f',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    AGGREGATE: {
        description: `Returns an aggregate in a list or database`,
        abstract: `Returns an aggregate in a list or database`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/aggregate-function-43b9278e-6aa7-4f17-92b6-e19993fa26df',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    ARABIC: {
        description: `Converts a Roman number to Arabic, as a number`,
        abstract: `Converts a Roman number to Arabic, as a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/arabic-function-9a8da418-c17b-4ef9-a657-9370a30a674f',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    ASIN: {
        description: `Returns the arcsine of a number`,
        abstract: `Returns the arcsine of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/asin-function-81fb95e5-6d6f-48c4-bc45-58f955c6d347',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    ASINH: {
        description: `Returns the inverse hyperbolic sine of a number`,
        abstract: `Returns the inverse hyperbolic sine of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/asinh-function-4e00475a-067a-43cf-926a-765b0249717c',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    ATAN: {
        description: `Returns the arctangent of a number`,
        abstract: `Returns the arctangent of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/atan-function-50746fa8-630a-406b-81d0-4a2aed395543',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    ATAN2: {
        description: `Returns the arctangent from x- and y-coordinates`,
        abstract: `Returns the arctangent from x- and y-coordinates`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/atan2-function-c04592ab-b9e3-4908-b428-c96b3a565033',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    ATANH: {
        description: `Returns the inverse hyperbolic tangent of a number`,
        abstract: `Returns the inverse hyperbolic tangent of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/atanh-function-3cd65768-0de7-4f1d-b312-d01c8c930d90',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    BASE: {
        description: `Converts a number into a text representation with the given radix (base)`,
        abstract: `Converts a number into a text representation with the given radix (base)`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/base-function-2ef61411-aee9-4f29-a811-1c42456c6342',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    CEILING: {
        description: `Rounds a number to the nearest integer or to the nearest multiple of significance`,
        abstract: `Rounds a number to the nearest integer or to the nearest multiple of significance`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/ceiling-function-0a5cd7c8-0720-4f0a-bd2c-c943e510899f',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    CEILING_MATH: {
        description: `Rounds a number up, to the nearest integer or to the nearest multiple of significance`,
        abstract: `Rounds a number up, to the nearest integer or to the nearest multiple of significance`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/ceiling-math-function-80f95d2f-b499-4eee-9f16-f795a8e306c8',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    CEILING_PRECISE: {
        description: `Rounds a number the nearest integer or to the nearest multiple of significance. Regardless of the sign of the number, the number is rounded up.`,
        abstract: `Rounds a number the nearest integer or to the nearest multiple of significance. Regardless of the sign of the number, the number is rounded up.`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/ceiling-precise-function-f366a774-527a-4c92-ba49-af0a196e66cb',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    COMBIN: {
        description: `Returns the number of combinations for a given number of objects`,
        abstract: `Returns the number of combinations for a given number of objects`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/combin-function-12a3f276-0a21-423a-8de6-06990aaf638a',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    COMBINA: {
        description: `Returns the number of combinations with repetitions for a given number of items`,
        abstract: `Returns the number of combinations with repetitions for a given number of items`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/combina-function-efb49eaa-4f4c-4cd2-8179-0ddfcf9d035d',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    COS: {
        description: `Returns the cosine of a number`,
        abstract: `Returns the cosine of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/cos-function-0fb808a5-95d6-4553-8148-22aebdce5f05',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    COSH: {
        description: `Returns the hyperbolic cosine of a number`,
        abstract: `Returns the hyperbolic cosine of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/cosh-function-e460d426-c471-43e8-9540-a57ff3b70555',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    COT: {
        description: `Returns the cotangent of an angle`,
        abstract: `Returns the cotangent of an angle`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/cot-function-c446f34d-6fe4-40dc-84f8-cf59e5f5e31a',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    COTH: {
        description: `Returns the hyperbolic cotangent of a number`,
        abstract: `Returns the hyperbolic cotangent of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/coth-function-2e0b4cb6-0ba0-403e-aed4-deaa71b49df5',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    CSC: {
        description: `Returns the cosecant of an angle`,
        abstract: `Returns the cosecant of an angle`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/csc-function-07379361-219a-4398-8675-07ddc4f135c1',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    CSCH: {
        description: `Returns the hyperbolic cosecant of an angle`,
        abstract: `Returns the hyperbolic cosecant of an angle`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/csch-function-f58f2c22-eb75-4dd6-84f4-a503527f8eeb',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    DECIMAL: {
        description: `Converts a text representation of a number in a given base into a decimal number`,
        abstract: `Converts a text representation of a number in a given base into a decimal number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/decimal-function-ee554665-6176-46ef-82de-0a283658da2e',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    DEGREES: {
        description: `Converts radians to degrees`,
        abstract: `Converts radians to degrees`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/degrees-function-4d6ec4db-e694-4b94-ace0-1cc3f61f9ba1',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    EVEN: {
        description: `Rounds a number up to the nearest even integer`,
        abstract: `Rounds a number up to the nearest even integer`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/even-function-197b5f06-c795-4c1e-8696-3c3b8a646cf9',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    EXP: {
        description: `Returns e raised to the power of a given number`,
        abstract: `Returns e raised to the power of a given number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/exp-function-c578f034-2c45-4c37-bc8c-329660a63abe',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    FACT: {
        description: `Returns the factorial of a number`,
        abstract: `Returns the factorial of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/fact-function-ca8588c2-15f2-41c0-8e8c-c11bd471a4f3',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    FACTDOUBLE: {
        description: `Returns the double factorial of a number`,
        abstract: `Returns the double factorial of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/factdouble-function-e67697ac-d214-48eb-b7b7-cce2589ecac8',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    FLOOR: {
        description: `Rounds a number down, toward zero`,
        abstract: `Rounds a number down, toward zero`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/floor-function-14bb497c-24f2-4e04-b327-b0b4de5a8886',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    FLOOR_MATH: {
        description: `Rounds a number down, to the nearest integer or to the nearest multiple of significance`,
        abstract: `Rounds a number down, to the nearest integer or to the nearest multiple of significance`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/floor-math-function-c302b599-fbdb-4177-ba19-2c2b1249a2f5',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    FLOOR_PRECISE: {
        description: `Rounds a number down to the nearest integer or to the nearest multiple of significance. Regardless of the sign of the number, the number is rounded down.`,
        abstract: `Rounds a number down to the nearest integer or to the nearest multiple of significance. Regardless of the sign of the number, the number is rounded down.`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/floor-precise-function-f769b468-1452-4617-8dc3-02f842a0702e',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    GCD: {
        description: `Returns the greatest common divisor`,
        abstract: `Returns the greatest common divisor`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/gcd-function-d5107a51-69e3-461f-8e4c-ddfc21b5073a',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    INT: {
        description: `Rounds a number down to the nearest integer`,
        abstract: `Rounds a number down to the nearest integer`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/int-function-a6c4af9e-356d-4369-ab6a-cb1fd9d343ef',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    ISO_CEILING: {
        description: `Returns a number that is rounded up to the nearest integer or to the nearest multiple of significance`,
        abstract: `Returns a number that is rounded up to the nearest integer or to the nearest multiple of significance`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/iso-ceiling-function-e587bb73-6cc2-4113-b664-ff5b09859a83',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    LCM: {
        description: `Returns the least common multiple`,
        abstract: `Returns the least common multiple`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/lcm-function-7152b67a-8bb5-4075-ae5c-06ede5563c94',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    LET: {
        description: `Assigns names to calculation results to allow storing intermediate calculations, values, or defining names inside a formula`,
        abstract: `Assigns names to calculation results to allow storing intermediate calculations, values, or defining names inside a formula`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/let-function-34842dd8-b92b-4d3f-b325-b8b8f9908999',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    LN: {
        description: `Returns the natural logarithm of a number`,
        abstract: `Returns the natural logarithm of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/ln-function-81fe1ed7-dac9-4acd-ba1d-07a142c6118f',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    LOG: {
        description: `Returns the logarithm of a number to a specified base`,
        abstract: `Returns the logarithm of a number to a specified base`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/log-function-4e82f196-1ca9-4747-8fb0-6c4a3abb3280',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    LOG10: {
        description: `Returns the base-10 logarithm of a number`,
        abstract: `Returns the base-10 logarithm of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/log10-function-c75b881b-49dd-44fb-b6f4-37e3486a0211',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    MDETERM: {
        description: `Returns the matrix determinant of an array`,
        abstract: `Returns the matrix determinant of an array`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/mdeterm-function-e7bfa857-3834-422b-b871-0ffd03717020',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    MINVERSE: {
        description: `Returns the matrix inverse of an array`,
        abstract: `Returns the matrix inverse of an array`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/minverse-function-11f55086-adde-4c9f-8eb9-59da2d72efc6',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    MMULT: {
        description: `Returns the matrix product of two arrays`,
        abstract: `Returns the matrix product of two arrays`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/mmult-function-40593ed7-a3cd-4b6b-b9a3-e4ad3c7245eb',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    MOD: {
        description: `Returns the remainder from division`,
        abstract: `Returns the remainder from division`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/mod-function-9b6cd169-b6ee-406a-a97b-edf2a9dc24f3',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    MROUND: {
        description: `Returns a number rounded to the desired multiple`,
        abstract: `Returns a number rounded to the desired multiple`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/mround-function-c299c3b0-15a5-426d-aa4b-d2d5b3baf427',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    MULTINOMIAL: {
        description: `Returns the multinomial of a set of numbers`,
        abstract: `Returns the multinomial of a set of numbers`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/multinomial-function-6fa6373c-6533-41a2-a45e-a56db1db1bf6',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    MUNIT: {
        description: `Returns the unit matrix or the specified dimension`,
        abstract: `Returns the unit matrix or the specified dimension`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/munit-function-c9fe916a-dc26-4105-997d-ba22799853a3',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    ODD: {
        description: `Rounds a number up to the nearest odd integer`,
        abstract: `Rounds a number up to the nearest odd integer`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/odd-function-deae64eb-e08a-4c88-8b40-6d0b42575c98',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    PI: {
        description: `Returns the value of pi`,
        abstract: `Returns the value of pi`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/pi-function-264199d0-a3ba-46b8-975a-c4a04608989b',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    POWER: {
        description: `Returns the result of a number raised to a power`,
        abstract: `Returns the result of a number raised to a power`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/power-function-d3f2908b-56f4-4c3f-895a-07fb519c362a',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    PRODUCT: {
        description: `Multiplies its arguments`,
        abstract: `Multiplies its arguments`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/product-function-8e6b5b24-90ee-4650-aeec-80982a0512ce',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    QUOTIENT: {
        description: `Returns the integer portion of a division`,
        abstract: `Returns the integer portion of a division`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/quotient-function-9f7bf099-2a18-4282-8fa4-65290cc99dee',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    RADIANS: {
        description: `Converts degrees to radians`,
        abstract: `Converts degrees to radians`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/radians-function-ac409508-3d48-45f5-ac02-1497c92de5bf',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    RAND: {
        description: `Returns a random number between 0 and 1`,
        abstract: `Returns a random number between 0 and 1`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/rand-function-4cbfa695-8869-4788-8d90-021ea9f5be73',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    RANDARRAY: {
        description: `Returns an array of random numbers between 0 and 1. However, you can specify the number of rows and columns to fill, minimum and maximum values, and whether to return whole numbers or decimal values.`,
        abstract: `Returns an array of random numbers between 0 and 1. However, you can specify the number of rows and columns to fill, minimum and maximum values, and whether to return whole numbers or decimal values.`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/randarray-function-21261e55-3bec-4885-86a6-8b0a47fd4d33',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    RANDBETWEEN: {
        description: `Returns a random number between the numbers you specify`,
        abstract: `Returns a random number between the numbers you specify`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/randbetween-function-4cc7f0d1-87dc-4eb7-987f-a469ab381685',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    ROMAN: {
        description: `Converts an Arabic numeral to Roman, as text`,
        abstract: `Converts an Arabic numeral to Roman, as text`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/roman-function-d6b0b99e-de46-4704-a518-b45a0f8b56f5',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    ROUND: {
        description: `Rounds a number to a specified number of digits`,
        abstract: `Rounds a number to a specified number of digits`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/round-function-c018c5d8-40fb-4053-90b1-b3e7f61a213c',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    ROUNDDOWN: {
        description: `Rounds a number down, toward zero`,
        abstract: `Rounds a number down, toward zero`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/rounddown-function-2ec94c73-241f-4b01-8c6f-17e6d7968f53',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    ROUNDUP: {
        description: `Rounds a number up, away from zero`,
        abstract: `Rounds a number up, away from zero`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/roundup-function-f8bc9b23-e795-47db-8703-db171d0c42a7',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    SEC: {
        description: `Returns the secant of an angle`,
        abstract: `Returns the secant of an angle`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/sec-function-ff224717-9c87-4170-9b58-d069ced6d5f7',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    SECH: {
        description: `Returns the hyperbolic secant of an angle`,
        abstract: `Returns the hyperbolic secant of an angle`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/sech-function-e05a789f-5ff7-4d7f-984a-5edb9b09556f',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    SERIESSUM: {
        description: `Returns the sum of a power series based on the formula`,
        abstract: `Returns the sum of a power series based on the formula`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/seriessum-function-a3ab25b5-1093-4f5b-b084-96c49087f637',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    SEQUENCE: {
        description: `Generates a list of sequential numbers in an array, such as 1, 2, 3, 4`,
        abstract: `Generates a list of sequential numbers in an array, such as 1, 2, 3, 4`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/sequence-function-57467a98-57e0-4817-9f14-2eb78519ca90',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    SIGN: {
        description: `Returns the sign of a number`,
        abstract: `Returns the sign of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/sign-function-109c932d-fcdc-4023-91f1-2dd0e916a1d8',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    SIN: {
        description: `Returns the sine of the given angle`,
        abstract: `Returns the sine of the given angle`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/sin-function-cf0e3432-8b9e-483c-bc55-a76651c95602',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    SINH: {
        description: `Returns the hyperbolic sine of a number`,
        abstract: `Returns the hyperbolic sine of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/sinh-function-1e4e8b9f-2b65-43fc-ab8a-0a37f4081fa7',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    SQRT: {
        description: `Returns a positive square root`,
        abstract: `Returns a positive square root`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/sqrt-function-654975c2-05c4-4831-9a24-2c65e4040fdf',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    SQRTPI: {
        description: `Returns the square root of (number * pi)`,
        abstract: `Returns the square root of (number * pi)`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/sqrtpi-function-1fb4e63f-9b51-46d6-ad68-b3e7a8b519b4',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    SUBTOTAL: {
        description: `Returns a subtotal in a list or database`,
        abstract: `Returns a subtotal in a list or database`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/subtotal-function-7b027003-f060-4ade-9040-e478765b9939',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    SUM: {
        description: `You can add individual values, cell references or ranges or a mix of all three.`,
        abstract: `Adds its arguments`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/sum-function-043e1c7d-7726-4e80-8f32-07b23e057f89',
            },
        ],
        functionParameter: {
            number1: {
                name: 'number1',
                detail: 'The first number you want to add. The number can be like 4, a cell reference like B6, or a cell range like B2:B8.',
            },
            number2: {
                name: 'number2',
                detail: 'This is the second number you want to add. You can specify up to 255 numbers in this way.',
            },
        },
    },
    SUMIF: {
        description: `Sum the values in a range that meet criteria that you specify.`,
        abstract: `Adds the cells specified by a given criteria`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/sumif-function-169b8c99-c05c-4483-a712-1697a653039b',
            },
        ],
        functionParameter: {
            range: {
                name: 'range',
                detail: 'The range of cells that you want evaluated by criteria.',
            },
            criteria: {
                name: 'criteria',
                detail: 'The criteria in the form of a number, expression, a cell reference, text, or a function that defines which cells will be added. Wildcard characters can be included - a question mark (?) to match any single character, an asterisk (*) to match any sequence of characters. If you want to find an actual question mark or asterisk, type a tilde (~) preceding the character.',
            },
            sum_range: {
                name: 'sum_range',
                detail: 'The actual cells to add, if you want to add cells other than those specified in the range argument. If the sum_range argument is omitted, Excel adds the cells that are specified in the range argument (the same cells to which the criteria is applied).',
            },
        },
    },
    SUMIFS: {
        description: `Adds the cells in a range that meet multiple criteria`,
        abstract: `Adds the cells in a range that meet multiple criteria`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/sumifs-function-c9e748f5-7ea7-455d-9406-611cebce642b',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    SUMPRODUCT: {
        description: `Returns the sum of the products of corresponding array components`,
        abstract: `Returns the sum of the products of corresponding array components`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/sumproduct-function-16753e75-9f68-4874-94ac-4d2145a2fd2e',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    SUMSQ: {
        description: `Returns the sum of the squares of the arguments`,
        abstract: `Returns the sum of the squares of the arguments`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/sumsq-function-e3313c02-51cc-4963-aae6-31442d9ec307',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    SUMX2MY2: {
        description: `Returns the sum of the difference of squares of corresponding values in two arrays`,
        abstract: `Returns the sum of the difference of squares of corresponding values in two arrays`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/sumx2my2-function-9e599cc5-5399-48e9-a5e0-e37812dfa3e9',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    SUMX2PY2: {
        description: `Returns the sum of the sum of squares of corresponding values in two arrays`,
        abstract: `Returns the sum of the sum of squares of corresponding values in two arrays`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/sumx2py2-function-826b60b4-0aa2-4e5e-81d2-be704d3d786f',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    SUMXMY2: {
        description: `Returns the sum of squares of differences of corresponding values in two arrays`,
        abstract: `Returns the sum of squares of differences of corresponding values in two arrays`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/sumxmy2-function-9d144ac1-4d79-43de-b524-e2ecee23b299',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    TAN: {
        description: `Returns the tangent of a number`,
        abstract: `Returns the tangent of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/tan-function-08851a40-179f-4052-b789-d7f699447401',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    TANH: {
        description: `Returns the hyperbolic tangent of a number`,
        abstract: `Returns the hyperbolic tangent of a number`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/tanh-function-017222f0-a0c3-4f69-9787-b3202295dc6c',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
    TRUNC: {
        description: `Truncates a number to an integer`,
        abstract: `Truncates a number to an integer`,
        links: [
            {
                title: 'Instruction',
                url: 'https://support.microsoft.com/en-us/office/trunc-function-8b86a64c-3127-43db-ba14-aa5ceb292721',
            },
        ],
        functionParameter: {
            number1: { name: 'number1', detail: 'first' },
            number2: { name: 'number2', detail: 'second' },
        },
    },
};
