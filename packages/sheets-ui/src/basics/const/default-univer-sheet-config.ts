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

export const DefaultRightMenuConfig = {
    InsertRow: true,
    InsertColumn: true,
    AddRowTop: false,
    AddRowBottom: false,
    AddColumnLeft: false,
    AddColumnRight: false,
    DeleteRow: true,
    DeleteColumn: true,
    HideRow: false,
    ShowRow: false,
    RowHeight: false,
    HideColumn: false,
    ShowColumn: false,
    ColumnWidth: false,
    DeleteCell: true,
    ClearContent: true,
    Matrix: false,
};

export const DefaultToolbarConfig = {
    undo: true,
    redo: true, // Undo redo
    paintFormat: true, // Format brush
    currencyFormat: true, // currency format
    percentageFormat: true, // Percentage format
    numberDecrease: true, // 'Decrease the number of decimal places'
    numberIncrease: true, // 'Increase the number of decimal places
    moreFormats: true, // 'More Formats'
    font: true, // 'font'
    fontSize: true, // 'Font size'
    bold: true, // 'Bold (Ctrl+B)'
    italic: true, // 'Italic (Ctrl+I)'
    strikethrough: true, // 'Strikethrough (Alt+Shift+5)'
    underline: true, // 'Underline (Alt+Shift+6)'
    textColor: true, // 'Text color'
    fillColor: true, // 'Cell color'
    border: true, // 'border'
    horizontalAlignMode: true, // 'Horizontal alignment'
    verticalAlignMode: true, // 'Vertical alignment'
    textWrapMode: true, // 'Wrap mode'
    textRotateMode: true, // 'Text Rotation Mode'
    mergeCell: true,
};

export const DefaultSheetContainerConfig = {
    outerLeft: false,
    outerRight: false,
    header: true,
    footer: true,
    innerLeft: false,
    innerRight: false,
    frozenHeaderLT: false,
    frozenHeaderRT: false,
    frozenHeaderLM: false,
    frozenContent: false,
    infoBar: true,
    toolbar: true,
    formulaBar: true,
    rightMenu: true,
    countBar: true,
    sheetBar: true,
};

export const DefaultSheetUIConfig = {
    layout: {
        sheetContainerConfig: DefaultSheetContainerConfig,
        rightMenuConfig: DefaultRightMenuConfig,
        toolbarConfig: DefaultToolbarConfig,
    },
};
