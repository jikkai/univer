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

/* eslint-disable no-magic-numbers */

import type { DocumentDataModel, EventState, Nullable } from '@univerjs/core';
import {
    DOCS_FORMULA_BAR_EDITOR_UNIT_ID_KEY,
    IConfigService,
    IUniverInstanceService,
    LifecycleStages,
    OnLifecycle,
    RxDisposable,
} from '@univerjs/core';
import type { IRender, IWheelEvent, RenderManagerService, Scene } from '@univerjs/engine-render';
import { Documents, EVENT_TYPE, IRenderManagerService, Layer, ScrollBar, Viewport } from '@univerjs/engine-render';
import { Inject } from '@wendellhu/redi';
import { BehaviorSubject, takeUntil } from 'rxjs';

import {
    DOCS_COMPONENT_DEFAULT_Z_INDEX,
    DOCS_COMPONENT_HEADER_LAYER_INDEX,
    DOCS_COMPONENT_MAIN_LAYER_INDEX,
    DOCS_VIEW_KEY,
    VIEWPORT_KEY,
} from '../basics/docs-view-key';
import { DocViewModelManagerService } from '../services/doc-view-model-manager.service';

@OnLifecycle(LifecycleStages.Ready, DocCanvasView)
export class DocCanvasView extends RxDisposable {
    private _scene!: Scene;

    private _currentDocumentModel!: DocumentDataModel;

    private _loadedMap = new Set();

    private readonly _fps$ = new BehaviorSubject<string>('');

    readonly fps$ = this._fps$.asObservable();

    constructor(
        @IRenderManagerService private readonly _renderManagerService: RenderManagerService,
        @IConfigService private readonly _configService: IConfigService,
        @IUniverInstanceService private readonly _currentUniverService: IUniverInstanceService,
        @Inject(DocViewModelManagerService) private readonly _docViewModelManagerService: DocViewModelManagerService
    ) {
        super();
        this._initialize();
    }

    private _initialize() {
        this._currentUniverService.currentDoc$.pipe(takeUntil(this.dispose$)).subscribe((documentModel) => {
            if (documentModel == null) {
                return;
            }

            this._currentDocumentModel = documentModel;

            const unitId = documentModel.getUnitId();
            // Build the view model and notify the skeleton manager to create the skeleton.
            this._docViewModelManagerService.setCurrent(unitId);

            if (!this._loadedMap.has(unitId)) {
                this._addNewRender();
                this._loadedMap.add(unitId);
            }
        });
    }

    override dispose(): void {
        this._fps$.complete();
    }

    private _addNewRender() {
        const documentModel = this._currentDocumentModel;

        const unitId = documentModel.getUnitId();

        const container = documentModel.getContainer();

        const parentRenderUnitId = documentModel.getParentRenderUnitId();

        if (container != null && parentRenderUnitId != null) {
            throw new Error('container or parentRenderUnitId can only exist one');
        }

        if (container == null && parentRenderUnitId != null) {
            this._renderManagerService.createRenderWithParent(unitId, parentRenderUnitId);
        } else {
            this._renderManagerService.createRender(unitId);
        }

        const currentRender = this._renderManagerService.getRenderById(unitId);

        if (currentRender == null) {
            return;
        }

        const { scene, engine } = currentRender;

        scene.openTransformer();

        this._scene = scene;

        const viewMain = new Viewport(VIEWPORT_KEY.VIEW_MAIN, scene, {
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            isWheelPreventDefaultX: true,
        });

        scene.attachControl();

        scene.on(EVENT_TYPE.wheel, (evt: unknown, state: EventState) => {
            const e = evt as IWheelEvent;

            if (e.ctrlKey) {
                const deltaFactor = Math.abs(e.deltaX);
                let scrollNum = deltaFactor < 40 ? 0.2 : deltaFactor < 80 ? 0.4 : 0.2;
                scrollNum *= e.deltaY > 0 ? -1 : 1;
                if (scene.scaleX < 1) {
                    scrollNum /= 2;
                }

                if (scene.scaleX + scrollNum > 4) {
                    scene.scale(4, 4);
                } else if (scene.scaleX + scrollNum < 0.1) {
                    scene.scale(0.1, 0.1);
                } else {
                    // const value = e.deltaY > 0 ? 0.1 : -0.1;
                    // scene.scaleBy(scrollNum, scrollNum);
                    e.preventDefault();
                }
            } else {
                viewMain.onMouseWheel(e, state);
            }
        });

        const hasScroll = this._configService.getConfig('hasScroll') as Nullable<boolean>;
        // TODO: @JOCS, do not show scroll bar when initialize formula editor, any better way?
        if (hasScroll !== false && unitId !== DOCS_FORMULA_BAR_EDITOR_UNIT_ID_KEY) {
            new ScrollBar(viewMain);
        }

        scene.addLayer(
            new Layer(scene, [], DOCS_COMPONENT_MAIN_LAYER_INDEX),
            new Layer(scene, [], DOCS_COMPONENT_HEADER_LAYER_INDEX)
        );

        // this._viewLoader(scene);

        this._addComponent(currentRender);

        const should = this._currentDocumentModel.getShouldRenderLoopImmediately();

        if (should) {
            engine.runRenderLoop(() => {
                scene.render();
                this._fps$.next(Math.round(engine.getFps()).toString());
            });
        }

        this._renderManagerService.setCurrent(unitId);
    }

    private _addComponent(currentRender: IRender) {
        const scene = this._scene;
        const documentModel = this._currentDocumentModel;
        const documents = new Documents(DOCS_VIEW_KEY.MAIN, undefined, {
            pageMarginLeft: documentModel.documentStyle.marginLeft || 0,
            pageMarginTop: documentModel.documentStyle.marginTop || 0,
        });

        documents.zIndex = DOCS_COMPONENT_DEFAULT_Z_INDEX;

        currentRender.mainComponent = documents;
        currentRender.components.set(DOCS_VIEW_KEY.MAIN, documents);

        scene.addObjects([documents], DOCS_COMPONENT_MAIN_LAYER_INDEX);

        // scene.enableLayerCache(DOCS_COMPONENT_MAIN_LAYER_INDEX);
    }
}
