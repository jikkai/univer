import { IFormulaData } from '@univer/base-formula-engine';
import {
    ACTION_NAMES,
    BaseActionExtension,
    BaseActionExtensionFactory,
    ContextBase,
    ICellData,
    ISetRangeDataActionData,
    isFormulaString,
    ISheetActionData,
    IUnitRange,
    ObjectMatrix,
    ObjectMatrixPrimitiveType,
    Plugin,
    Tools,
} from '@univer/core';
import { IActionData } from '@univer/core/src/Command/ActionBase';
import { FormulaPlugin } from '../../FormulaPlugin';

export class FormulaActionExtension extends BaseActionExtension<ISetRangeDataActionData, FormulaPlugin> {
    execute() {
        const engine = this._plugin.getFormulaEngine();
        const formulaData = Tools.deepClone(this._plugin.getFormulaController().getDataModel().getFormulaData());
        const unitId = this._plugin.getContext().getWorkBook().getUnitId();
        const sheetId = this.actionData.sheetId;
        const rangeData = this.actionData.rangeData;
        let cellValue = this.actionData.cellValue;

        const cellData: IFormulaData = formulaData[unitId][sheetId];

        // a range
        if (!isNaN(parseInt(Object.keys(cellValue)[0]))) {
            const rangeMatrix = new ObjectMatrix(cellValue as ObjectMatrixPrimitiveType<ICellData>);

            // update formula string
            rangeMatrix.forValue((r, c, cell) => {
                const formulaString = cell.v;
                if (cellData[r] && cellData[r]._array[c] && isFormulaString(formulaString)) {
                    cellData[r]._array[c].formula = formulaString;
                }
            });
        }
        // a cell
        else {
            const { startRow: r, startColumn: c } = rangeData;
            let cell: ICellData = cellValue;
            const formulaString = cell.v;
            if (cellData[r] && cellData[r]._array[c] && isFormulaString(formulaString)) {
                cellData[r]._array[c].formula = formulaString;
            }
        }

        console.log('formulaData=====', formulaData);

        const unitRange: IUnitRange[] = [
            {
                unitId,
                sheetId,
                rangeData,
            },
        ];
        engine.execute(unitId, formulaData, undefined, undefined, unitRange).then((sheetData) => {
            console.log('sheetData---', sheetData);
        });

        // const setNumfmtRangeDataAction = {
        //     actionName: ACTION_NAMES,
        //     sheetId: this.actionData.sheetId,
        //     rangeData: this.actionData.rangeData,
        //     cellValue: formulaMatrix.toJSON(),
        // };
        // this.push(setNumfmtRangeDataAction);
    }
}

export class FormulaActionExtensionFactory extends BaseActionExtensionFactory<ISetRangeDataActionData, FormulaPlugin> {
    get zIndex(): number {
        return 1;
    }

    get actionName(): ACTION_NAMES {
        return ACTION_NAMES.SET_RANGE_DATA_ACTION;
    }

    create(actionData: ISetRangeDataActionData, actionDataList: ISheetActionData[]): BaseActionExtension<ISetRangeDataActionData> {
        return new FormulaActionExtension(actionData, actionDataList, this._plugin);
    }

    check(actionData: ISetRangeDataActionData, actionDataList: IActionData[]): false | BaseActionExtension<ISetRangeDataActionData, Plugin<any, ContextBase>> {
        return false;
    }
}
