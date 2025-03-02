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

import type {
    IBorderStyleData,
    ICellData,
    IColumnData,
    IDocumentData,
    IDocumentRenderConfig,
    IObjectArrayPrimitiveType,
    IPaddingData,
    IRange,
    IRowData,
    ISelectionCellWithCoord,
    IStyleBase,
    IStyleData,
    ITextRotation,
    ITextStyle,
    IWorksheetData,
    LocaleService,
    Nullable,
    Styles,
    TextDirection,
    Worksheet,
} from '@univerjs/core';
import {
    BooleanNumber,
    CellValueType,
    DEFAULT_EMPTY_DOCUMENT_VALUE,
    DocumentDataModel,
    getColorStyle,
    HorizontalAlign,
    isEmptyCell,
    isNullCell,
    ObjectMatrix,
    searchArray,
    Tools,
    VerticalAlign,
    WrapStrategy,
} from '@univerjs/core';

import { BORDER_TYPE, COLOR_BLACK_RGB, MAXIMUM_ROW_HEIGHT } from '../../basics/const';
import { getRotateOffsetAndFarthestHypotenuse } from '../../basics/draw';
import type { IDocumentSkeletonColumn } from '../../basics/i-document-skeleton-cached';
import {
    degToRad,
    getCellByIndex,
    getCellInfoInMergeData,
    getCellPositionByIndex,
    getFontStyleString,
    hasUnMergedCellInRow,
    isRectIntersect,
    mergeInfoOffset,
} from '../../basics/tools';
import type { IBoundRectNoAngle, IViewportBound } from '../../basics/vector2';
import { columnIterator } from '../docs/common/tools';
import { DocumentSkeleton } from '../docs/doc-skeleton';
import { DocumentViewModel } from '../docs/view-model/document-view-model';
import { Skeleton } from '../skeleton';
import type { BorderCache, IFontCacheItem, IStylesCache } from './interfaces';

/**
 * Obtain the height and width of a cell's text, taking into account scenarios with rotated text.
 * @param documentSkeleton Data of the document's ViewModel
 * @param angleInDegree The rotation angle of an Excel cell, it's **degree**
 * @returns
 */
export function getDocsSkeletonPageSize(documentSkeleton: DocumentSkeleton, angleInDegree: number = 0) {
    const skeletonData = documentSkeleton?.getSkeletonData();
    const angle = degToRad(angleInDegree);

    if (!skeletonData) {
        return;
    }
    const { pages } = skeletonData;
    const lastPage = pages[pages.length - 1];

    if (angle === 0) {
        const { width, height } = lastPage;

        return { width, height };
    }

    let allRotatedWidth = 0;
    let allRotatedHeight = 0;

    const widthArray: Array<{ rotatedWidth: number; spaceWidth: number }> = [];

    columnIterator([lastPage], (column: IDocumentSkeletonColumn) => {
        const { lines, width: columnWidth, spaceWidth } = column;

        const { rotatedHeight, rotatedWidth } = getRotateOffsetAndFarthestHypotenuse(lines, columnWidth, angle);

        allRotatedHeight += rotatedHeight;

        widthArray.push({ rotatedWidth, spaceWidth });
    });

    const widthCount = widthArray.length;

    for (let i = 0; i < widthCount; i++) {
        const { rotatedWidth } = widthArray[i];

        if (i === 0) {
            allRotatedWidth += rotatedWidth;
        }
    }

    return {
        width: allRotatedWidth,
        height: allRotatedHeight,
    };
}

export interface IRowAutoHeightInfo {
    row: number;
    autoHeight?: number;
}

interface ICellOtherConfig {
    /**
     * textRotation
     */
    textRotation?: ITextRotation;
    /** *
     * textDirection
     */
    textDirection?: Nullable<TextDirection>;
    /**
     * horizontalAlignment
     */
    horizontalAlign?: HorizontalAlign;
    /**
     * verticalAlignment
     */
    verticalAlign?: VerticalAlign;
    /**
     * wrapStrategy
     */
    wrapStrategy?: WrapStrategy;
    /**
     * padding
     */
    paddingData?: IPaddingData;
}

interface IRowColumnSegment {
    startRow: number;
    endRow: number;
    startColumn: number;
    endColumn: number;
}

export interface IDocumentLayoutObject {
    documentModel: Nullable<DocumentDataModel>;
    fontString: string;
    textRotation: ITextRotation;
    wrapStrategy: WrapStrategy;
    verticalAlign: VerticalAlign;
    horizontalAlign: HorizontalAlign;
    paddingData: IPaddingData;
    fill?: Nullable<string>;
}

const VERTICAL_ROTATE_ANGLE = 90;

const DEFAULT_PADDING_DATA = {
    t: 0,
    b: 0,
    l: 2,
    r: 2,
};

export class SpreadsheetSkeleton extends Skeleton {
    private _rowHeightAccumulation: number[] = [];

    private _rowTotalHeight: number = 0;

    private _columnWidthAccumulation: number[] = [];

    private _columnTotalWidth: number = 0;

    private _rowHeaderWidth = 0;

    private _columnHeaderHeight = 0;

    private _rowColumnSegment: IRowColumnSegment = {
        startRow: -1,
        endRow: -1,
        startColumn: -1,
        endColumn: -1,
    };

    private _dataMergeCache: IRange[] = [];

    // private _dataMergeCacheAll: ObjectMatrix<IRange>;

    private _overflowCache: ObjectMatrix<IRange> = new ObjectMatrix();

    private _stylesCache: IStylesCache = {
        background: {},
        backgroundPositions: new ObjectMatrix<ISelectionCellWithCoord>(),
        font: {},
        border: new ObjectMatrix<BorderCache>(),
    };

    private _renderedCellCache = new ObjectMatrix<boolean>();

    private _showGridlines: BooleanNumber = BooleanNumber.TRUE;

    private _marginTop: number = 0;

    private _marginLeft: number = 0;

    constructor(
        private _worksheet: Worksheet | undefined,
        private _config: IWorksheetData,
        private _cellData: ObjectMatrix<Nullable<ICellData>>,
        private _styles: Styles,
        _localeService: LocaleService
    ) {
        super(_localeService);

        this.updateLayout();
        // this.updateDataMerge();
    }

    get rowHeightAccumulation() {
        return this._rowHeightAccumulation;
    }

    get rowTotalHeight() {
        return this._rowTotalHeight;
    }

    get columnWidthAccumulation() {
        return this._columnWidthAccumulation;
    }

    get columnTotalWidth() {
        return this._columnTotalWidth;
    }

    get rowHeaderWidth() {
        return this._rowHeaderWidth;
    }

    get columnHeaderHeight() {
        return this._columnHeaderHeight;
    }

    get rowColumnSegment() {
        return this._rowColumnSegment;
    }

    get dataMergeCache() {
        return this._dataMergeCache;
    }

    get stylesCache() {
        return this._stylesCache;
    }

    get overflowCache() {
        return this._overflowCache;
    }

    get showGridlines() {
        return this._showGridlines;
    }

    get mergeData() {
        return this._config.mergeData;
    }

    get rowHeaderWidthAndMarginLeft() {
        return this.rowHeaderWidth + this._marginLeft;
    }

    get columnHeaderHeightAndMarginTop() {
        return this.columnHeaderHeight + this._marginTop;
    }

    // get dataMergeCacheAll() {
    //     return this._dataMergeCacheAll;
    // }

    /**
     * @deprecated
     * @param config
     * @param cellData
     * @param styles
     * @param LocaleService
     * @returns
     */
    static create(
        worksheet: Worksheet | undefined,
        config: IWorksheetData,
        cellData: ObjectMatrix<Nullable<ICellData>>,
        styles: Styles,
        LocaleService: LocaleService
    ) {
        return new SpreadsheetSkeleton(worksheet, config, cellData, styles, LocaleService);
    }

    /**
     * @deprecated should never expose a property that is provided by another module!
     * @returns
     */
    getWorksheetConfig() {
        return this._config;
    }

    /**
     * @deprecated should never expose a property that is provided by another module!
     * @returns
     */
    getCellData() {
        return this._cellData;
    }

    /**
     * @deprecated should never expose a property that is provided by another module!
     * @returns
     */
    getsStyles() {
        return this._styles;
    }

    setOverflowCache(value: ObjectMatrix<IRange>) {
        this._overflowCache = value;
    }

    setMarginLeft(left: number) {
        this._marginLeft = left;
    }

    setMarginTop(top: number) {
        this._marginTop = top;
    }

    calculateSegment(bounds?: IViewportBound) {
        if (!this._config) {
            return;
        }

        this.updateLayout();

        if (!this._rowHeightAccumulation || !this._columnWidthAccumulation) {
            return;
        }

        if (bounds != null) {
            this._rowColumnSegment = this.getRowColumnSegment(bounds);
        }

        return true;
    }

    calculateWithoutClearingCache(bounds?: IViewportBound) {
        if (!this.calculateSegment(bounds)) {
            return;
        }

        const { mergeData } = this._config;

        this._dataMergeCache = mergeData && this._getMergeCells(mergeData, this._rowColumnSegment);

        this._calculateStylesCache();

        return this;
    }

    calculate(bounds?: IViewportBound) {
        this._resetCache();

        this.calculateWithoutClearingCache(bounds);

        return this;
    }

    calculateAutoHeightInRange(ranges: Nullable<IRange[]>) {
        if (!Tools.isArray(ranges)) {
            return [];
        }

        const results: IRowAutoHeightInfo[] = [];
        const { mergeData, rowData } = this._config;
        const rowObjectArray = rowData;

        for (const range of ranges) {
            const { startRow, endRow, startColumn, endColumn } = range;

            for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                // If the row has already been calculated, it does not need to be calculated
                if (results.some(({ row }) => row === rowIndex)) {
                    continue;
                }

                // The row sets isAutoHeight to false, and there is no need to calculate the automatic row height for the row.
                if (rowObjectArray[rowIndex]?.isAutoHeight === false) {
                    continue;
                }

                const hasUnMergedCell = hasUnMergedCellInRow(rowIndex, startColumn, endColumn, mergeData);

                if (hasUnMergedCell) {
                    const autoHeight = this._calculateRowAutoHeight(rowIndex);

                    results.push({
                        row: rowIndex,
                        autoHeight,
                    });
                }
            }
        }

        return results;
    }

    private _calculateRowAutoHeight(rowNum: number): number {
        const { columnCount, columnData, mergeData, defaultRowHeight } = this._config;
        const data = columnData;
        let height = defaultRowHeight;

        const worksheet = this._worksheet;
        if (!worksheet) {
            return height;
        }

        for (let i = 0; i < columnCount; i++) {
            // When calculating the automatic height of a row, if a cell is in a merged cell,
            // skip the cell directly, which currently follows the logic of Excel
            const { isMerged, isMergedMainCell } = getCellInfoInMergeData(rowNum, i, mergeData);

            if (isMerged || isMergedMainCell) {
                continue;
            }
            const cell = worksheet.getCell(rowNum, i);
            const modelObject = cell && this._getCellDocumentModel(cell);
            if (modelObject == null) {
                continue;
            }

            const { documentModel, textRotation, wrapStrategy } = modelObject;
            if (documentModel == null) {
                continue;
            }

            const documentViewModel = new DocumentViewModel(documentModel);

            let { a: angle } = textRotation as ITextRotation;
            const { v: isVertical = BooleanNumber.FALSE } = textRotation as ITextRotation;

            if (isVertical === BooleanNumber.TRUE) {
                angle = VERTICAL_ROTATE_ANGLE;
            }

            const colWidth = data[i]?.w;
            if (typeof colWidth === 'number' && wrapStrategy === WrapStrategy.WRAP) {
                documentModel.updateDocumentDataPageSize(colWidth);
            }

            const documentSkeleton = DocumentSkeleton.create(documentViewModel, this._localService);
            documentSkeleton.calculate();

            const { height: h = 0 } = getDocsSkeletonPageSize(documentSkeleton, angle) ?? {};

            height = Math.max(height, h);
        }

        return Math.min(height, MAXIMUM_ROW_HEIGHT);
    }

    updateLayout() {
        if (!this.dirty) {
            return;
        }
        const {
            rowData,
            columnData,
            defaultRowHeight,
            defaultColumnWidth,
            rowCount,
            columnCount,
            rowHeader,
            columnHeader,
            showGridlines,
        } = this._config;
        const { rowTotalHeight, rowHeightAccumulation } = this._generateRowMatrixCache(
            rowCount,
            rowData,
            defaultRowHeight
        );
        const { columnTotalWidth, columnWidthAccumulation } = this._generateColumnMatrixCache(
            columnCount,
            columnData,
            defaultColumnWidth
        );

        this._rowHeaderWidth = rowHeader.hidden !== BooleanNumber.TRUE ? rowHeader.width : 0;
        this._columnHeaderHeight = columnHeader.hidden !== BooleanNumber.TRUE ? columnHeader.height : 0;

        this._rowTotalHeight = rowTotalHeight;
        this._rowHeightAccumulation = rowHeightAccumulation;
        this._columnTotalWidth = columnTotalWidth;
        this._columnWidthAccumulation = columnWidthAccumulation;
        this._showGridlines = showGridlines;

        this.makeDirty(false);

        return this;
    }

    // updateDataMerge() {
    //     const { mergeData } = this._config;
    //     this._dataMergeCacheAll = mergeData && this._getMergeCells(mergeData);
    // }

    getRowColumnSegment(bounds?: IViewportBound) {
        return this._getBounding(this._rowHeightAccumulation, this._columnWidthAccumulation, bounds?.viewBound);
    }

    getRowColumnSegmentByViewBound(bound?: IBoundRectNoAngle) {
        return this._getBounding(this._rowHeightAccumulation, this._columnWidthAccumulation, bound);
    }

    getMergeBounding(startRow: number, startColumn: number, endRow: number, endColumn: number) {
        const mergeData = this._config.mergeData;
        if (!mergeData) {
            return {
                startRow,
                startColumn,
                endRow,
                endColumn,
            };
        }

        let isSearching = true;
        const searchedMarge = new ObjectMatrix<boolean>();

        // the loop breaks when there are not merged cells intersect with the current range
        // NOTE: what about the performance issue?
        while (isSearching) {
            isSearching = false;

            for (let i = 0; i < mergeData.length; i++) {
                const {
                    startRow: mainStartRow,
                    startColumn: mainStartColumn,
                    endRow: mainEndRow,
                    endColumn: mainEndColumn,
                } = mergeData[i];

                if (searchedMarge.getValue(mainStartRow, mainStartColumn)) {
                    continue;
                }

                const rect1 = {
                    left: startColumn,
                    top: startRow,
                    right: endColumn,
                    bottom: endRow,
                };

                const rect2 = {
                    left: mainStartColumn,
                    top: mainStartRow,
                    right: mainEndColumn,
                    bottom: mainEndRow,
                };

                if (isRectIntersect(rect1, rect2)) {
                    startRow = Math.min(startRow, mainStartRow);
                    startColumn = Math.min(startColumn, mainStartColumn);
                    endRow = Math.max(endRow, mainEndRow);
                    endColumn = Math.max(endColumn, mainEndColumn);
                    searchedMarge.setValue(mainStartRow, mainStartColumn, true);
                    isSearching = true;
                }
            }
        }

        return {
            startRow,
            startColumn,
            endRow,
            endColumn,
        };
    }

    appendToOverflowCache(row: number, column: number, startColumn: number, endColumn: number) {
        this._overflowCache.setValue(row, column, {
            startRow: row,
            endRow: row,
            startColumn,
            endColumn,
        });
    }

    getColumnCount() {
        return this._columnWidthAccumulation.length;
    }

    getRowCount() {
        return this._rowHeightAccumulation.length;
    }

    getOverflowPosition(
        contentSize: { width: number; height: number },
        horizontalAlign: HorizontalAlign,
        row: number,
        column: number,
        columnCount: number
    ) {
        const { width: contentWidth } = contentSize;

        let startColumn = column;
        let endColumn = column;

        // console.log('documentSkeleton', cell?.v, column, endColumn, row, column, columnCount, contentWidth);

        if (horizontalAlign === HorizontalAlign.CENTER) {
            startColumn = this._getOverflowBound(row, column, 0, contentWidth / 2, horizontalAlign);
            endColumn = this._getOverflowBound(row, column, columnCount - 1, contentWidth / 2, horizontalAlign);
        } else if (horizontalAlign === HorizontalAlign.RIGHT) {
            startColumn = this._getOverflowBound(row, column, 0, contentWidth);
        } else {
            endColumn = this._getOverflowBound(row, column, columnCount - 1, contentWidth);
        }

        return {
            startColumn,
            endColumn,
        };
    }

    getNoMergeCellPositionByIndex(rowIndex: number, columnIndex: number) {
        const {
            rowHeightAccumulation,
            columnWidthAccumulation,
            rowHeaderWidthAndMarginLeft,
            columnHeaderHeightAndMarginTop,
        } = this;

        const rowCount = this.getRowCount();

        const columnCount = this.getColumnCount();

        if (rowIndex >= rowCount || rowIndex < 0 || columnIndex >= columnCount || columnIndex < 0) {
            return {
                startY: -100,
                endY: -100,
                startX: -100,
                endX: -100,
            };
        }

        let { startY, endY, startX, endX } = getCellPositionByIndex(
            rowIndex,
            columnIndex,
            rowHeightAccumulation,
            columnWidthAccumulation
        );

        startY += columnHeaderHeightAndMarginTop;
        endY += columnHeaderHeightAndMarginTop;
        startX += rowHeaderWidthAndMarginLeft;
        endX += rowHeaderWidthAndMarginLeft;

        return {
            startY,
            endY,
            startX,
            endX,
        };
    }

    getNoMergeCellPositionByIndexWithNoHeader(rowIndex: number, columnIndex: number) {
        const { rowHeightAccumulation, columnWidthAccumulation } = this;

        const { startY, endY, startX, endX } = getCellPositionByIndex(
            rowIndex,
            columnIndex,
            rowHeightAccumulation,
            columnWidthAccumulation
        );

        return {
            startY,
            endY,
            startX,
            endX,
        };
    }

    /**
     *
     * @param offsetX HTML coordinate system, mouse position x.
     * @param offsetY HTML coordinate system, mouse position y.
     * @param scaleX render scene scale x-axis, scene.getAncestorScale
     * @param scaleY render scene scale y-axis, scene.getAncestorScale
     * @param scrollXY  render viewport scroll {x, y}, scene.getScrollXYByRelativeCoords, scene.getScrollXY
     * @returns Selection data with coordinates
     */
    calculateCellIndexByPosition(
        offsetX: number,
        offsetY: number,
        scaleX: number,
        scaleY: number,
        scrollXY: { x: number; y: number }
    ): Nullable<ISelectionCellWithCoord> {
        const { row, column } = this.getCellPositionByOffset(offsetX, offsetY, scaleX, scaleY, scrollXY);

        return this.getCellByIndex(row, column);
    }

    /**
     *
     * @param offsetX HTML coordinate system, mouse position x.
     * @param offsetY HTML coordinate system, mouse position y.
     * @param scaleX render scene scale x-axis, scene.getAncestorScale
     * @param scaleY render scene scale y-axis, scene.getAncestorScale
     * @param scrollXY  render viewport scroll {x, y}, scene.getScrollXYByRelativeCoords, scene.getScrollXY
     * @returns Hit cell coordinates
     */
    getCellPositionByOffset(
        offsetX: number,
        offsetY: number,
        scaleX: number,
        scaleY: number,
        scrollXY: { x: number; y: number }
    ) {
        const row = this.getRowPositionByOffsetY(offsetY, scaleY, scrollXY);

        const column = this.getColumnPositionByOffsetX(offsetX, scaleX, scrollXY);

        return {
            row,
            column,
        };
    }

    /**
     *
     * @param offsetX scaled offset x
     * @param scaleX scale x
     * @param scrollXY
     * @returns
     */

    getColumnPositionByOffsetX(offsetX: number, scaleX: number, scrollXY: { x: number; y: number }) {
        offsetX = this.getTransformOffsetX(offsetX, scaleX, scrollXY);

        const { columnWidthAccumulation } = this;

        let column = searchArray(columnWidthAccumulation, offsetX);

        if (column === Infinity) {
            column = columnWidthAccumulation.length - 1;
        } else if (column === -1) {
            column = 0;
        }

        // if (column === -1) {
        //     const columnLength = columnWidthAccumulation.length - 1;
        //     const lastColumnValue = columnWidthAccumulation[columnLength];
        //     if (lastColumnValue <= offsetX) {
        //         column = columnWidthAccumulation.length - 1;
        //     } else {
        //         column = 0;
        //     }
        // }

        return column;
    }

    /**
     *
     * @param offsetY scaled offset y
     * @param scaleY scale y
     * @param scrollXY
     * @returns
     */
    getRowPositionByOffsetY(offsetY: number, scaleY: number, scrollXY: { x: number; y: number }) {
        const { rowHeightAccumulation } = this;

        offsetY = this.getTransformOffsetY(offsetY, scaleY, scrollXY);

        let row = searchArray(rowHeightAccumulation, offsetY);

        if (row === Infinity) {
            row = rowHeightAccumulation.length - 1;
        } else if (row === -1) {
            row = 0;
        }

        // if (row === -1) {
        //     const rowLength = rowHeightAccumulation.length - 1;
        //     const lastRowValue = rowHeightAccumulation[rowLength];
        //     if (lastRowValue <= offsetY) {
        //         row = rowHeightAccumulation.length - 1;
        //     } else {
        //         row = 0;
        //     }
        // }

        return row;
    }

    getTransformOffsetX(offsetX: number, scaleX: number, scrollXY: { x: number; y: number }) {
        const { x: scrollX } = scrollXY;

        // so we should map physical positions to ideal positions
        offsetX = offsetX / scaleX + scrollX - this.rowHeaderWidthAndMarginLeft;

        return offsetX;
    }

    getTransformOffsetY(offsetY: number, scaleY: number, scrollXY: { x: number; y: number }) {
        const { y: scrollY } = scrollXY;

        // these values are not affected by zooming (ideal positions)
        offsetY = offsetY / scaleY + scrollY - this.columnHeaderHeightAndMarginTop;

        return offsetY;
    }

    getOffsetByPositionX(column: number): number {
        const { columnWidthAccumulation, rowHeaderWidthAndMarginLeft } = this;

        const lastColumnIndex = columnWidthAccumulation.length - 1;
        const columnValue = columnWidthAccumulation[column];
        if (columnValue != null) {
            return columnValue + rowHeaderWidthAndMarginLeft;
        }

        if (column < 0) {
            return rowHeaderWidthAndMarginLeft;
        }

        return columnWidthAccumulation[lastColumnIndex] + rowHeaderWidthAndMarginLeft;
    }

    getOffsetByPositionY(row: number) {
        const { rowHeightAccumulation, columnHeaderHeightAndMarginTop } = this;
        const lastRowIndex = rowHeightAccumulation.length - 1;
        const rowValue = rowHeightAccumulation[row];
        if (rowValue != null) {
            return rowValue + columnHeaderHeightAndMarginTop;
        }

        if (row < 0) {
            return columnHeaderHeightAndMarginTop;
        }

        return rowHeightAccumulation[lastRowIndex] + columnHeaderHeightAndMarginTop;
    }

    /**
     * Return cell information corresponding to the current coordinates, including the merged cell object.
     * @param row Specified Row Coordinate
     * @param column Specified Column Coordinate
     * @param scaleX render scene scale x-axis, current Horizontal Scale, scene.getAncestorScale
     * @param scaleY render scene scale y-axis, current Vertical Scale, scene.getAncestorScale
     */
    getCellByIndex(row: number, column: number): ISelectionCellWithCoord {
        const {
            rowHeightAccumulation,
            columnWidthAccumulation,
            rowHeaderWidthAndMarginLeft,
            columnHeaderHeightAndMarginTop,
        } = this;

        const primary = getCellByIndex(
            row,
            column,
            rowHeightAccumulation,
            columnWidthAccumulation,
            this._config.mergeData
        );
        const { isMerged, isMergedMainCell } = primary;
        let { startY, endY, startX, endX, mergeInfo } = primary;

        startY += columnHeaderHeightAndMarginTop;
        endY += columnHeaderHeightAndMarginTop;
        startX += rowHeaderWidthAndMarginLeft;
        endX += rowHeaderWidthAndMarginLeft;

        mergeInfo = mergeInfoOffset(mergeInfo, rowHeaderWidthAndMarginLeft, columnHeaderHeightAndMarginTop);

        return {
            actualRow: row,
            actualColumn: column,
            startY,
            endY,
            startX,
            endX,
            isMerged,
            isMergedMainCell,
            mergeInfo,
        };
    }

    getCellByIndexWithNoHeader(row: number, column: number) {
        const { rowHeightAccumulation, columnWidthAccumulation } = this;

        const primary = getCellByIndex(
            row,
            column,
            rowHeightAccumulation,
            columnWidthAccumulation,
            this._config.mergeData
        );
        const { isMerged, isMergedMainCell } = primary;
        const { startY, endY, startX, endX, mergeInfo } = primary;

        const newMergeInfo = mergeInfoOffset(mergeInfo, 0, 0);

        return {
            actualRow: row,
            actualColumn: column,
            startY,
            endY,
            startX,
            endX,
            isMerged,
            isMergedMainCell,
            mergeInfo: newMergeInfo,
        };
    }

    // convert canvas content position to physical position in screen
    convertTransformToOffsetX(offsetX: number, scaleX: number, scrollXY: { x: number; y: number }) {
        const { x: scrollX } = scrollXY;

        offsetX = (offsetX - scrollX) * scaleX;

        return offsetX;
    }

    // convert canvas content position to physical position in screen
    convertTransformToOffsetY(offsetY: number, scaleY: number, scrollXY: { x: number; y: number }) {
        const { y: scrollY } = scrollXY;

        offsetY = (offsetY - scrollY) * scaleY;

        return offsetY;
    }

    getSelectionBounding(startRow: number, startColumn: number, endRow: number, endColumn: number) {
        return this.getMergeBounding(startRow, startColumn, endRow, endColumn);
    }

    // Only used for cell edit, and no need to rotate text when edit cell content!
    getBlankCellDocumentModel(cell: Nullable<ICellData>): IDocumentLayoutObject {
        const documentModelObject = this._getCellDocumentModel(cell, undefined, undefined, true);

        if (documentModelObject != null) {
            if (documentModelObject.documentModel == null) {
                documentModelObject.documentModel = this._getDocumentDataByStyle('', {}, {});
            }
            return documentModelObject;
        }

        const content = '';

        let fontString = 'document';

        const textRotation: ITextRotation = { a: 0, v: BooleanNumber.FALSE };
        const horizontalAlign: HorizontalAlign = HorizontalAlign.UNSPECIFIED;
        const verticalAlign: VerticalAlign = VerticalAlign.UNSPECIFIED;
        const wrapStrategy: WrapStrategy = WrapStrategy.UNSPECIFIED;
        const paddingData: IPaddingData = DEFAULT_PADDING_DATA;

        fontString = getFontStyleString({}, this._localService).fontCache;

        const documentModel = this._getDocumentDataByStyle(content, {}, {});

        return {
            documentModel,
            fontString,
            textRotation,
            wrapStrategy,
            verticalAlign,
            horizontalAlign,
            paddingData,
        };
    }

    // Only used for cell edit, and no need to rotate text when edit cell content!
    getCellDocumentModelWithFormula(cell: ICellData) {
        return this._getCellDocumentModel(cell, true, true, true);
    }

    private _getCellDocumentModel(
        cell: Nullable<ICellData>,
        isDeepClone: boolean = false,
        formulaFirst: boolean = false,
        ignoreTextRotation: boolean = false
    ): Nullable<IDocumentLayoutObject> {
        const style = this._styles.getStyleByCell(cell);

        if (!cell) {
            return;
        }

        let documentModel: Nullable<DocumentDataModel>;
        let fontString = 'document';
        const cellOtherConfig = this._getOtherStyle(style) as ICellOtherConfig;

        const textRotation: ITextRotation = ignoreTextRotation
            ? { a: 0, v: BooleanNumber.FALSE }
            : cellOtherConfig.textRotation || { a: 0, v: BooleanNumber.FALSE };
        const horizontalAlign: HorizontalAlign = cellOtherConfig.horizontalAlign || HorizontalAlign.UNSPECIFIED;
        const verticalAlign: VerticalAlign = cellOtherConfig.verticalAlign || VerticalAlign.UNSPECIFIED;
        const wrapStrategy: WrapStrategy = cellOtherConfig.wrapStrategy || WrapStrategy.UNSPECIFIED;
        const paddingData: IPaddingData = cellOtherConfig.paddingData || DEFAULT_PADDING_DATA;

        if (cell.f && formulaFirst) {
            documentModel = this._getDocumentDataByStyle(cell.f.toString(), {}, {});
        } else if (cell.p) {
            const { a: angle = 0, v: isVertical = BooleanNumber.FALSE } = textRotation;
            let centerAngle = 0;
            let vertexAngle = angle;
            if (isVertical === BooleanNumber.TRUE) {
                centerAngle = VERTICAL_ROTATE_ANGLE;
                vertexAngle = VERTICAL_ROTATE_ANGLE;
            }
            documentModel = this._updateConfigAndGetDocumentModel(
                isDeepClone ? Tools.deepClone(cell.p) : cell.p,
                horizontalAlign,
                {
                    horizontalAlign,
                    verticalAlign,
                    centerAngle,
                    vertexAngle,
                    wrapStrategy,
                }
            );
        } else if (cell.v != null) {
            const textStyle = this._getFontFormat(style);
            fontString = getFontStyleString(textStyle, this._localService).fontCache;

            documentModel = this._getDocumentDataByStyle(cell.v.toString(), textStyle, {
                ...cellOtherConfig,
                textRotation,
            });
        }

        /**
         * the alignment mode is returned with respect to the offset of the sheet cell,
         * because the document needs to render the layout for cells and
         * support alignment across multiple cells (e.g., horizontal alignment of long text in overflow mode).
         * The alignment mode of the document itself cannot meet this requirement,
         * so an additional renderConfig needs to be added during the rendering of the document component.
         * This means that there are two coexisting alignment modes.
         * In certain cases, such as in an editor, conflicts may arise,
         * requiring only one alignment mode to be retained.
         * By removing the relevant configurations in renderConfig,
         * the alignment mode of the sheet cell can be modified.
         * The alternative alignment mode is applied to paragraphs within the document.
         */
        return {
            documentModel,
            fontString,
            textRotation,
            wrapStrategy,
            verticalAlign,
            horizontalAlign,
            paddingData,
            fill: style?.bg?.rgb,
        };
    }

    getDecomposedOffset(offsetX: number, offsetY: number) {
        let column = searchArray(this._columnWidthAccumulation, offsetX);
        let columnOffset = 0;
        if (column === -1 || column === 0) {
            column = 0;
            columnOffset = offsetX;
        } else {
            columnOffset = offsetX - this._columnWidthAccumulation[column - 1];
        }

        let row = searchArray(this._rowHeightAccumulation, offsetY);
        let rowOffset = 0;
        if (row === -1 || row === 0) {
            row = 0;
            rowOffset = offsetY;
        } else {
            rowOffset = offsetY - this._rowHeightAccumulation[row - 1];
        }
        return {
            row,
            column,
            columnOffset,
            rowOffset,
        };
    }

    /**
     * Calculate the overflow of cell text. If there is no value on either side of the cell,
     * the text content of this cell can be drawn to both sides, not limited by the cell's width.
     * Overflow on the left or right is aligned according to the text's horizontal alignment.
     */
    private _calculateOverflowCell(row: number, column: number, docsConfig: IFontCacheItem) {
        // wrap and angle handler
        const { documentSkeleton, angle = 0, horizontalAlign, wrapStrategy } = docsConfig;

        const cell = this.getCellData().getValue(row, column);

        const { t: cellValueType = CellValueType.STRING } = cell || {};

        /**
         * Numerical and Boolean values are not displayed with overflow.
         */
        if (
            (wrapStrategy === WrapStrategy.OVERFLOW || wrapStrategy === WrapStrategy.UNSPECIFIED) &&
            cellValueType !== CellValueType.NUMBER &&
            cellValueType !== CellValueType.BOOLEAN &&
            horizontalAlign !== HorizontalAlign.JUSTIFIED
        ) {
            // Merged cells do not support overflow.
            if (this.intersectMergeRange(row, column)) {
                return true;
            }

            let contentSize = getDocsSkeletonPageSize(documentSkeleton, angle);

            if (!contentSize) {
                return true;
            }

            if (angle !== 0) {
                const { startY, endY, startX, endX } = getCellByIndex(
                    row,
                    column,
                    this.rowHeightAccumulation,
                    this.columnWidthAccumulation,
                    this.mergeData
                );
                const cellWidth = endX - startX;
                const cellHeight = endY - startY;

                if (contentSize.height > cellHeight) {
                    contentSize = {
                        width: cellHeight / Math.tan(Math.abs(angle)) + cellWidth,
                        height: cellHeight,
                    };
                    // if (angle > 0) {
                    //     horizontalAlign = HorizontalAlign.LEFT;
                    // } else {
                    //     horizontalAlign = HorizontalAlign.RIGHT;
                    // }
                }
            }

            const position = this.getOverflowPosition(contentSize, horizontalAlign, row, column, this.getColumnCount());

            const { startColumn, endColumn } = position;

            this.appendToOverflowCache(row, column, startColumn, endColumn);
        } else if (wrapStrategy === WrapStrategy.WRAP && angle !== 0) {
            // Merged cells do not support overflow.
            if (this.intersectMergeRange(row, column)) {
                return true;
            }

            const { startY, endY } = getCellByIndex(
                row,
                column,
                this.rowHeightAccumulation,
                this.columnWidthAccumulation,
                this.mergeData
            );

            const cellHeight = endY - startY;
            documentSkeleton.getViewModel().getDataModel().updateDocumentDataPageSize(cellHeight);
            documentSkeleton.calculate();
            const contentSize = getDocsSkeletonPageSize(documentSkeleton, angle);

            if (!contentSize) {
                return true;
            }

            const { startColumn, endColumn } = this.getOverflowPosition(
                contentSize,
                horizontalAlign,
                row,
                column,
                this.getColumnCount()
            );

            this.appendToOverflowCache(row, column, startColumn, endColumn);
        }
    }

    /**
     *
     * @param rowHeightAccumulation Row layout information
     * @param columnWidthAccumulation Column layout information
     * @param bounds The range of the visible area of the canvas
     * @returns The range cell index of the canvas visible area
     */
    protected _getBounding(
        rowHeightAccumulation: number[],
        columnWidthAccumulation: number[],
        viewBound?: IBoundRectNoAngle
    ) {
        const rhaLength = rowHeightAccumulation.length;
        const cwaLength = columnWidthAccumulation.length;

        if (!viewBound) {
            return {
                startRow: 0,
                endRow: rhaLength - 1,
                startColumn: 0,
                endColumn: cwaLength - 1,
            };
        }

        let dataset_row_st = -1;
        let dataset_row_ed = -1;
        let dataset_col_st = -1;
        let dataset_col_ed = -1;

        const row_st = searchArray(rowHeightAccumulation, viewBound.top - this.columnHeaderHeightAndMarginTop);
        const row_ed = searchArray(rowHeightAccumulation, viewBound.bottom - this.columnHeaderHeightAndMarginTop);

        if (row_st === -1 && row_ed === 0) {
            dataset_row_st = -1;
            dataset_row_ed = -1;
        } else {
            if (row_st === -1) {
                dataset_row_st = 0;
            } else {
                dataset_row_st = row_st;
            }

            if (row_ed === Infinity) {
                dataset_row_ed = rhaLength - 1;
            } else if (row_ed >= rhaLength) {
                dataset_row_ed = rhaLength - 1;
            } else {
                dataset_row_ed = row_ed;
            }
        }

        const col_st = searchArray(columnWidthAccumulation, viewBound.left - this.rowHeaderWidthAndMarginLeft);
        const col_ed = searchArray(columnWidthAccumulation, viewBound.right - this.rowHeaderWidthAndMarginLeft);

        if (col_st === -1 && col_ed === 0) {
            dataset_col_st = -1;
            dataset_col_ed = -1;
        } else {
            if (col_st === -1) {
                dataset_col_st = 0;
            } else {
                dataset_col_st = col_st;
            }

            if (col_ed === Infinity) {
                dataset_col_ed = cwaLength - 1;
            } else if (col_ed >= cwaLength) {
                dataset_col_ed = cwaLength - 1;
            } else {
                dataset_col_ed = col_ed;
            }
        }

        return {
            startRow: dataset_row_st,
            endRow: dataset_row_ed,
            startColumn: dataset_col_st,
            endColumn: dataset_col_ed,
        };
    }

    private _generateRowMatrixCache(
        rowCount: number,
        rowData: IObjectArrayPrimitiveType<Partial<IRowData>>,
        defaultRowHeight: number
    ) {
        let rowTotalHeight = 0;
        const rowHeightAccumulation: number[] = [];
        const data = rowData;
        for (let r = 0; r < rowCount; r++) {
            let rowHeight = defaultRowHeight;

            if (data[r] != null) {
                const rowDataItem = data[r];

                if (!rowDataItem) {
                    continue;
                }
                const { h = defaultRowHeight, ah, isAutoHeight } = rowDataItem;
                if ((isAutoHeight == null || !!isAutoHeight) && typeof ah === 'number') {
                    rowHeight = ah;
                } else {
                    rowHeight = h;
                }

                if (rowDataItem.hd === BooleanNumber.TRUE) {
                    rowHeight = 0;
                }
            }

            rowTotalHeight += rowHeight;

            rowHeightAccumulation.push(rowTotalHeight); // 行的临时长度分布
        }

        return {
            rowTotalHeight,
            rowHeightAccumulation,
        };
    }

    private _generateColumnMatrixCache(
        colCount: number,
        columnData: IObjectArrayPrimitiveType<Partial<IColumnData>>,
        defaultColumnWidth: number
    ) {
        let columnTotalWidth = 0;
        const columnWidthAccumulation: number[] = [];

        const data = columnData;

        for (let c = 0; c < colCount; c++) {
            let columnWidth = defaultColumnWidth;

            if (data[c] != null) {
                const columnDataItem = data[c];

                if (!columnDataItem) {
                    continue;
                }

                if (columnDataItem.w != null) {
                    columnWidth = columnDataItem.w;
                }

                if (columnDataItem.hd === BooleanNumber.TRUE) {
                    columnWidth = 0;
                }
            }

            columnTotalWidth += columnWidth;

            columnWidthAccumulation.push(columnTotalWidth); // 列的临时长度分布
        }

        return {
            columnTotalWidth,
            columnWidthAccumulation,
        };
    }

    private _getOverflowBound(
        row: number,
        startColumn: number,
        endColumn: number,
        contentWidth: number,
        horizontalAlign = HorizontalAlign.LEFT
    ) {
        let cumWidth = 0;
        if (startColumn > endColumn) {
            const columnCount = this._columnWidthAccumulation.length - 1;
            for (let i = startColumn; i >= endColumn; i--) {
                const column = i;
                const cell = this._worksheet?.getCell(row, column);
                if ((!isEmptyCell(cell) && column !== startColumn) || this.intersectMergeRange(row, column)) {
                    if (column === startColumn) {
                        return column;
                    }
                    return column + 1 > columnCount ? columnCount : column + 1;
                }
                const { startX, endX } = getCellPositionByIndex(
                    row,
                    column,
                    this.rowHeightAccumulation,
                    this.columnWidthAccumulation
                );

                // For center alignment, the current cell's width needs to be divided in half for comparison.
                if (horizontalAlign === HorizontalAlign.CENTER && column === startColumn) {
                    cumWidth += (endX - startX) / 2;
                } else {
                    cumWidth += endX - startX;
                }

                if (contentWidth < cumWidth) {
                    return column;
                }
            }
            return startColumn;
        }
        for (let i = startColumn; i <= endColumn; i++) {
            const column = i;
            const cell = this._worksheet?.getCell(row, column);
            if ((!isEmptyCell(cell) && column !== startColumn) || this.intersectMergeRange(row, column)) {
                if (column === startColumn) {
                    return column;
                }

                return column - 1 < 0 ? 0 : column - 1;
            }
            const { startX, endX } = getCellPositionByIndex(
                row,
                column,
                this.rowHeightAccumulation,
                this.columnWidthAccumulation
            );

            if (horizontalAlign === HorizontalAlign.CENTER && column === startColumn) {
                cumWidth += (endX - startX) / 2;
            } else {
                cumWidth += endX - startX;
            }

            if (contentWidth < cumWidth) {
                return column;
            }
        }
        return endColumn;
    }

    intersectMergeRange(row: number, column: number) {
        const dataMergeCache = this.dataMergeCache;
        for (const dataCache of dataMergeCache) {
            const {
                startRow: startRowMargeIndex,
                endRow: endRowMargeIndex,
                startColumn: startColumnMargeIndex,
                endColumn: endColumnMargeIndex,
            } = dataCache;
            if (
                row >= startRowMargeIndex &&
                row <= endRowMargeIndex &&
                column >= startColumnMargeIndex &&
                column <= endColumnMargeIndex
            ) {
                return true;
            }
        }
        // dataMergeCache?.forEach((r, dataMergeRow) => {
        //     dataMergeRow?.forEach((c, dataCache) => {

        //     });
        // });
        return false;
    }

    // private _getMergeRangeCache() {
    //     const dataMergeCache = this.dataMergeCache;
    //     const mergeRangeCache = new ObjectMatrix<ObjectMatrix<boolean>>();
    //     dataMergeCache?.forEach((r, dataMergeRow) => {
    //         dataMergeRow?.forEach((c, dataCache) => {
    //             const { startRow: startRowMargeIndex, endRow: endRowMargeIndex, startColumn: startColumnMargeIndex, endColumn: endColumnMargeIndex } = dataCache;
    //             const endObject = new ObjectMatrix<boolean>();
    //             endObject.setValue(endRowMargeIndex, endColumnMargeIndex, true);
    //             mergeRangeCache.setValue(startRowMargeIndex, startColumnMargeIndex, endObject);
    //         });
    //     });
    //     return mergeRangeCache;
    // }

    // eslint-disable-next-line max-lines-per-function
    private _calculateStylesCache() {
        const dataMergeCache = this._dataMergeCache;
        const rowColumnSegment = this._rowColumnSegment;
        const columnWidthAccumulation = this.columnWidthAccumulation;
        const { startRow, endRow, startColumn, endColumn } = rowColumnSegment;

        if (endColumn === -1 || endRow === -1) {
            return;
        }

        for (const data of dataMergeCache) {
            this._setCellCache(data.startRow, data.startColumn, false);
        }

        for (let r = startRow; r <= endRow; r++) {
            for (let c = startColumn; c <= endColumn; c++) {
                this._setCellCache(r, c, false);
            }

            // 针对溢出的情况计算文本长度，可视范围左侧列
            for (let c = 0; c < startColumn; c++) {
                this._setCellCache(r, c, true);
            }

            if (endColumn === 0) {
                continue;
            }

            // 针对溢出的情况计算文本长度，可视范围右侧列
            for (let c = endColumn + 1; c < columnWidthAccumulation.length; c++) {
                this._setCellCache(r, c, true);
            }
        }

        // this.calculateOverflow();
    }

    private _resetCache() {
        this._stylesCache = {
            background: {},
            backgroundPositions: new ObjectMatrix<ISelectionCellWithCoord>(),
            font: {},
            border: new ObjectMatrix<BorderCache>(),
        };

        this._renderedCellCache = new ObjectMatrix<boolean>();

        this._overflowCache.reset();
    }

    private _makeDocumentSkeletonDirty(r: number, c: number) {
        if (this._stylesCache.font == null) {
            return;
        }
        const keys = Object.keys(this._stylesCache.font);
        for (const fontString of keys) {
            const fontCache = this._stylesCache.font![fontString];
            if (fontCache != null && fontCache.getValue(r, c)) {
                fontCache.getValue(r, c).documentSkeleton.makeDirty(true);
                return;
            }
        }
    }

    private _setCellCache(r: number, c: number, skipBackgroundAndBorder: boolean) {
        const needsRendering = this._renderedCellCache.getValue(r, c);

        if (r === -1 || c === -1) {
            return true;
        }

        if (needsRendering === false) {
            this._makeDocumentSkeletonDirty(r, c);
            return true;
        }

        if (!this._worksheet) {
            return true;
        }

        const hidden = this._worksheet.getColVisible(c) === false || this._worksheet.getRowVisible(r) === false;
        if (hidden) {
            return true;
        }

        const cell = this._worksheet.getCell(r, c);
        if (!cell) {
            return true;
        }

        const cache = this._stylesCache;

        // style supports inline styles
        // const style = styles && styles.get(cell.s);
        // const style = getStyle(styles, cell);
        const style = this._styles.getStyleByCell(cell);

        if (!skipBackgroundAndBorder && style && style.bg && style.bg.rgb) {
            const rgb = style.bg.rgb;
            if (!cache.background![rgb]) {
                cache.background![rgb] = new ObjectMatrix();
            }
            const bgCache = cache.background![rgb];

            bgCache.setValue(r, c, rgb);

            const cellInfo = this.getCellByIndexWithNoHeader(r, c);

            cache.backgroundPositions?.setValue(r, c, cellInfo);
        }

        if (!skipBackgroundAndBorder && style && style.bd) {
            this._setBorderProps(r, c, BORDER_TYPE.TOP, style, cache);
            this._setBorderProps(r, c, BORDER_TYPE.BOTTOM, style, cache);
            this._setBorderProps(r, c, BORDER_TYPE.LEFT, style, cache);
            this._setBorderProps(r, c, BORDER_TYPE.RIGHT, style, cache);

            this._setBorderProps(r, c, BORDER_TYPE.TL_BR, style, cache);
            this._setBorderProps(r, c, BORDER_TYPE.TL_BC, style, cache);
            this._setBorderProps(r, c, BORDER_TYPE.TL_MR, style, cache);
            this._setBorderProps(r, c, BORDER_TYPE.BL_TR, style, cache);
            this._setBorderProps(r, c, BORDER_TYPE.ML_TR, style, cache);
            this._setBorderProps(r, c, BORDER_TYPE.BC_TR, style, cache);
        }

        if (needsRendering === true) {
            this._makeDocumentSkeletonDirty(r, c);
            return true;
        }

        if (isNullCell(cell)) {
            return;
        }

        const modelObject = cell && this._getCellDocumentModel(cell);

        if (modelObject == null) {
            return;
        }

        const { documentModel, fontString, textRotation, wrapStrategy, verticalAlign, horizontalAlign } = modelObject;

        if (documentModel == null) {
            return;
        }

        const documentViewModel = new DocumentViewModel(documentModel);

        if (!cache.font![fontString]) {
            cache.font![fontString] = new ObjectMatrix();
        }

        const fontCache = cache.font![fontString];

        let { a: angle } = textRotation as ITextRotation;

        const { v: isVertical = BooleanNumber.FALSE } = textRotation as ITextRotation;
        if (isVertical === BooleanNumber.TRUE) {
            angle = VERTICAL_ROTATE_ANGLE;
        }

        if (documentViewModel) {
            const documentSkeleton = DocumentSkeleton.create(documentViewModel, this._localService);
            documentSkeleton.calculate();

            const config = {
                documentSkeleton,
                angle,
                verticalAlign,
                horizontalAlign,
                wrapStrategy,
            };

            fontCache.setValue(r, c, config);

            this._calculateOverflowCell(r, c, config);
        }

        if (!skipBackgroundAndBorder) {
            this._renderedCellCache.setValue(r, c, false);
        } else {
            this._renderedCellCache.setValue(r, c, true);
        }
    }

    private _updateConfigAndGetDocumentModel(
        documentData: IDocumentData,
        horizontalAlign: HorizontalAlign,
        renderConfig?: IDocumentRenderConfig
    ) {
        if (!renderConfig) {
            return;
        }

        if (!documentData.body?.dataStream) {
            return;
        }

        if (!documentData.documentStyle) {
            documentData.documentStyle = {};
        }
        documentData.documentStyle.renderConfig = renderConfig;

        const paragraphs = documentData.body.paragraphs || [];

        for (const paragraph of paragraphs) {
            if (!paragraph.paragraphStyle) {
                paragraph.paragraphStyle = {};
            }

            paragraph.paragraphStyle.horizontalAlign = horizontalAlign;
        }

        return new DocumentDataModel(documentData);
    }

    private _getDocumentDataByStyle(content: string, textStyle: ITextStyle, config: ICellOtherConfig) {
        const contentLength = content.length;
        const {
            textRotation = { a: 0, v: BooleanNumber.FALSE },
            paddingData = {
                t: 2,
                r: 2,
                b: 0,
                l: 2,
            },
            horizontalAlign = HorizontalAlign.UNSPECIFIED,
            verticalAlign = VerticalAlign.UNSPECIFIED,
            wrapStrategy = WrapStrategy.UNSPECIFIED,
        } = config;

        const { a: angle = 0, v: isVertical = BooleanNumber.FALSE } = textRotation;
        const { t: marginTop, r: marginRight, b: marginBottom, l: marginLeft } = paddingData || {};

        let centerAngle = 0;
        let vertexAngle = angle;
        if (isVertical === BooleanNumber.TRUE) {
            centerAngle = VERTICAL_ROTATE_ANGLE;
            vertexAngle = VERTICAL_ROTATE_ANGLE;
        }
        const documentData: IDocumentData = {
            id: 'd',
            body: {
                dataStream: `${content}${DEFAULT_EMPTY_DOCUMENT_VALUE}`,
                textRuns: [
                    {
                        ts: textStyle,
                        st: 0,
                        ed: contentLength,
                    },
                ],
                paragraphs: [
                    {
                        startIndex: contentLength,
                        paragraphStyle: {
                            horizontalAlign,
                        },
                    },
                ],
            },
            documentStyle: {
                pageSize: {
                    width: Infinity,
                    height: Infinity,
                },
                marginTop,
                marginBottom,
                marginRight,
                marginLeft,
                renderConfig: {
                    horizontalAlign,
                    verticalAlign,
                    centerAngle,
                    vertexAngle,
                    wrapStrategy,
                },
            },
        };

        return new DocumentDataModel(documentData);
    }

    private _setBorderProps(r: number, c: number, type: BORDER_TYPE, style: IStyleData, cache: IStylesCache) {
        const props: Nullable<IBorderStyleData> = style.bd?.[type];
        if (!props || !cache.border) {
            return true;
        }
        const rgb = getColorStyle(props.cl) || COLOR_BLACK_RGB;

        const borderCache = cache.border;

        if (!borderCache.getValue(r, c)) {
            borderCache.setValue(r, c, { [type]: {} });
        }

        borderCache.getValue(r, c)![type] = {
            type,
            style: props.s,
            color: rgb,
        };
    }

    private _getFontFormat(format?: Nullable<IStyleData>): IStyleBase {
        if (!format) {
            return {};
        }
        const { ff, fs, it, bl, ul, st, ol, cl } = format;
        const style: IStyleBase = {};
        ff && (style.ff = ff);
        fs && (style.fs = fs);
        it && (style.it = it);
        bl && (style.bl = bl);
        ul && (style.ul = ul);
        st && (style.st = st);
        ol && (style.ol = ol);
        cl && (style.cl = cl);
        return style;
    }

    private _getOtherStyle(format?: Nullable<IStyleData>) {
        if (!format) {
            return {};
        }

        const {
            tr: textRotation,

            td: textDirection,

            ht: horizontalAlign,

            vt: verticalAlign,

            tb: wrapStrategy,

            pd: paddingData,
        } = format;

        return {
            textRotation,
            textDirection,
            horizontalAlign,
            verticalAlign,
            wrapStrategy,
            paddingData,
        };
    }

    /**
     * Cache the merged cells on the current screen to improve computational performance.
     * @param mergeData all marge data
     * @param rowColumnSegment current screen range, include row and column
     * @returns
     */
    private _getMergeCells(mergeData: IRange[], rowColumnSegment?: IRowColumnSegment) {
        // const rowColumnSegment = this._rowColumnSegment;
        const endColumnLast = this.columnWidthAccumulation.length - 1;
        if (!rowColumnSegment) {
            const endRow = this.rowHeightAccumulation.length - 1;
            rowColumnSegment = { startRow: 0, startColumn: 0, endRow, endColumn: endColumnLast };
        } else {
            rowColumnSegment = {
                startRow: rowColumnSegment.startRow,
                endRow: rowColumnSegment.endRow,
                endColumn: endColumnLast,
                startColumn: 0,
            };
        }
        const { startRow, startColumn, endRow, endColumn } = rowColumnSegment;
        const cacheDataMerge: IRange[] = [];
        for (let i = 0; i < mergeData.length; i++) {
            const {
                startRow: mergeStartRow,
                endRow: mergeEndRow,
                startColumn: mergeStartColumn,
                endColumn: mergeEndColumn,
            } = mergeData[i];
            for (let r = startRow; r <= endRow; r++) {
                let isBreak = false;
                for (let c = startColumn; c <= endColumn; c++) {
                    if (r >= mergeStartRow && r <= mergeEndRow && c >= mergeStartColumn && c <= mergeEndColumn) {
                        cacheDataMerge.push({
                            startRow: mergeStartRow,
                            endRow: mergeEndRow,
                            startColumn: mergeStartColumn,
                            endColumn: mergeEndColumn,
                        });
                        isBreak = true;
                        break;
                    }
                }
                if (isBreak) {
                    break;
                }
            }
        }
        return cacheDataMerge;
    }
}
