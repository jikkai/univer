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

import { LocaleType, LogLevel, Univer } from '@univerjs/core';
import { defaultTheme } from '@univerjs/design';
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { UniverFindReplacePlugin } from '@univerjs/find-replace';
import type { IUniverRPCMainThreadConfig } from '@univerjs/rpc';
import { UniverRPCMainThreadPlugin } from '@univerjs/rpc';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula';
import { UniverSheetsNumfmtPlugin } from '@univerjs/sheets-numfmt';
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui';
import { UniverSheetsZenEditorPlugin } from '@univerjs/sheets-zen-editor';
import { UniverUIPlugin } from '@univerjs/ui';

import { DEFAULT_WORKBOOK_DATA_DEMO } from '../data';
import { DebuggerPlugin } from '../plugins/debugger';
import { locales } from './locales';

const LOAD_LAZY_PLUGINS_TIMEOUT = 5_000;
// univer
const univer = new Univer({
    theme: defaultTheme,
    locale: LocaleType.ZH_CN,
    locales,
    logLevel: LogLevel.VERBOSE,
});

// core plugins
univer.registerPlugin(UniverDocsPlugin, {
    hasScroll: false,
});
univer.registerPlugin(UniverRenderEnginePlugin);
univer.registerPlugin(UniverUIPlugin, {
    container: 'app',
    header: true,
    toolbar: true,
    footer: true,
});
univer.registerPlugin(UniverFindReplacePlugin);

univer.registerPlugin(UniverDocsUIPlugin);

univer.registerPlugin(UniverSheetsPlugin, {
    notExecuteFormula: true,
});
univer.registerPlugin(UniverSheetsUIPlugin);

// sheet feature plugins

univer.registerPlugin(UniverSheetsNumfmtPlugin);
univer.registerPlugin(DebuggerPlugin);
univer.registerPlugin(UniverSheetsZenEditorPlugin);
univer.registerPlugin(UniverFormulaEnginePlugin, {
    notExecuteFormula: true,
});
univer.registerPlugin(UniverSheetsFormulaPlugin);
univer.registerPlugin(UniverRPCMainThreadPlugin, {
    workerURL: './worker.js',
} as IUniverRPCMainThreadConfig);

// create univer sheet instance
univer.createUniverSheet(DEFAULT_WORKBOOK_DATA_DEMO);

declare global {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Window {
        univer?: Univer;
    }
}

setTimeout(() => {
    import('./lazy').then((lazy) => {
        const plugin = lazy.default();
        univer.registerPlugin(plugin[0], plugin[1]);
    });
}, LOAD_LAZY_PLUGINS_TIMEOUT);

window.univer = univer;
