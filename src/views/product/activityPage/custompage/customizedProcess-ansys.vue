<template>
  <div>
    <div class="layout-wrapper">
      <div class="layout-content">
        <a-form label-align="left" :colon="false" :label-col="formLabelCol">
          <div class="section-title">
            <div class="section-title-text">&nbsp;弯板计算</div>
          </div>
          <div style="width: 99%; float: left">
            <div>
              <section class="main-section">
                <div class="form-column-left">
                  <a-form-item label="模型类型：">
                    <a-input v-model:value="parameterTempList[0].defaultValue" style="width: 150px" disabled />
                  </a-form-item>
                  <a-form-item label="厚度：">
                    <a-input v-model:value="parameterTempList[1].defaultValue" style="width: 150px" disabled />
                  </a-form-item>
                  <a-form-item label="横板长度 L (m)：">
                    <a-input
                      v-model:value="parameterTempList[4].defaultValue"
                      style="width: 150px"
                      @input="
                        setSaveBtnEnable(
                          parameterTempList[4].inputOrOutput,
                          parameterTempList[4].parameterId,
                          parameterTempList[4].defaultValue,
                        )
                      "
                      @blur="changeInputVal(parameterTempList[4].id)" />
                  </a-form-item>
                  <a-form-item label="宽度 W (m)：">
                    <a-input
                      v-model:value="parameterTempList[5].defaultValue"
                      style="width: 150px"
                      @input="
                        setSaveBtnEnable(
                          parameterTempList[5].inputOrOutput,
                          parameterTempList[5].parameterId,
                          parameterTempList[5].defaultValue,
                        )
                      "
                      @blur="changeInputVal(parameterTempList[5].id)" />
                  </a-form-item>
                  <a-form-item label="竖板长度 L1 (m)：">
                    <a-input
                      v-model:value="parameterTempList[6].defaultValue"
                      style="width: 150px"
                      @input="
                        setSaveBtnEnable(
                          parameterTempList[6].inputOrOutput,
                          parameterTempList[6].parameterId,
                          parameterTempList[6].defaultValue,
                        )
                      "
                      @blur="changeInputVal(parameterTempList[6].id)" />
                  </a-form-item>
                  <a-form-item label="内拐角半径 R1 (m)：">
                    <a-input
                      v-model:value="parameterTempList[7].defaultValue"
                      style="width: 150px"
                      @input="
                        setSaveBtnEnable(
                          parameterTempList[7].inputOrOutput,
                          parameterTempList[7].parameterId,
                          parameterTempList[7].defaultValue,
                        )
                      "
                      @blur="changeInputVal(parameterTempList[7].id)" />
                  </a-form-item>
                  <a-form-item label="圆孔半径 R (m)：">
                    <a-input
                      v-model:value="parameterTempList[8].defaultValue"
                      style="width: 150px"
                      @input="
                        setSaveBtnEnable(
                          parameterTempList[8].inputOrOutput,
                          parameterTempList[8].parameterId,
                          parameterTempList[8].defaultValue,
                        )
                      "
                      @blur="changeInputVal(parameterTempList[8].id)" />
                  </a-form-item>
                  <a-form-item label="网格边长：">
                    <a-input
                      v-model:value="parameterTempList[9].defaultValue"
                      style="width: 150px"
                      @input="setSaveBtnEnable()" />
                  </a-form-item>
                  <a-form-item label="分析类型：">
                    <a-input v-model:value="parameterTempList[10].defaultValue" style="width: 150px" disabled />
                  </a-form-item>
                  <a-form-item label="加力位置1：">
                    <a-input v-model:value="parameterTempList[12].defaultValue" style="width: 150px" disabled />
                  </a-form-item>
                  <a-form-item label="加力大小：">
                    开始
                    <a-input
                      v-model:value="parameterTempList[13].defaultValue"
                      class="range-field__input"
                      @input="
                        setSaveBtnEnable(
                          parameterTempList[13].inputOrOutput,
                          parameterTempList[13].parameterId,
                          parameterTempList[13].defaultValue,
                        )
                      " />
                    ~ 结束
                    <a-input
                      v-model:value="parameterTempList[14].defaultValue"
                      class="range-field__input"
                      @input="
                        setSaveBtnEnable(
                          parameterTempList[14].inputOrOutput,
                          parameterTempList[14].parameterId,
                          parameterTempList[14].defaultValue,
                        )
                      " />
                  </a-form-item>
                  <a-form-item label="APDL模板文件：">
                    <a-input v-model:value="parameterTempList[21].defaultValue" style="width: 150px" disabled />
                    &nbsp;
                    <a style="color: blue" @click="selectInputFileUpload(parameterTempList[21])">
                      <u>浏览</u>
                    </a>
                    &nbsp;
                    <a
                      v-if="parameterTempList[21].defaultValue != null && parameterTempList[21].defaultValue != ''"
                      style="color: blue; font-weight: normal"
                      @click="downloadFileType(parameterTempList[21].defaultValue)">
                      <u>下载</u>
                    </a>
                  </a-form-item>
                  <a-form-item>
                    <a-button type="primary" :loading="loadingtype" @click="solve">
                      <template #icon><CalculatorOutlined /></template>
                      计算
                    </a-button>
                  </a-form-item>
                </div>
                <div class="form-column-right">
                  <a-form-item label="材料弹性模量 EX：">
                    <a-input
                      v-model:value="parameterTempList[2].defaultValue"
                      style="width: 150px"
                      @input="
                        setSaveBtnEnable(
                          parameterTempList[2].inputOrOutput,
                          parameterTempList[2].parameterId,
                          parameterTempList[2].defaultValue,
                        )
                      " />
                  </a-form-item>
                  <a-form-item label="泊松比 PRXY：">
                    <a-input
                      v-model:value="parameterTempList[3].defaultValue"
                      style="width: 150px"
                      @input="
                        setSaveBtnEnable(
                          parameterTempList[3].inputOrOutput,
                          parameterTempList[3].parameterId,
                          parameterTempList[3].defaultValue,
                        )
                      " />
                  </a-form-item>
                  <div ref="containerRef" class="three-container" />
                  <div style="margin-left: 100px">
                    <a-form-item label="" :label-col="formLabelColNarrow">
                      <a-input v-show="false" v-model:value="parameterTempList[11].defaultValue" style="width: 150px" />
                    </a-form-item>
                    <a-form-item label="固定位置：" :label-col="formLabelColNarrow">
                      <a-input v-model:value="parameterTempList[11].defaultValue" style="width: 150px" disabled />
                    </a-form-item>
                    <a-form-item label="加力位置2：" :label-col="formLabelColNarrow">
                      <a-input v-model:value="parameterTempList[15].defaultValue" style="width: 150px" disabled />
                    </a-form-item>
                    <a-form-item label="加力大小：" :label-col="formLabelColNarrow">
                      开始
                      <a-input
                        v-model:value="parameterTempList[16].defaultValue"
                        class="range-field__input"
                        @input="
                          setSaveBtnEnable(
                            parameterTempList[16].inputOrOutput,
                            parameterTempList[16].parameterId,
                            parameterTempList[16].defaultValue,
                          )
                        " />
                      ~ 结束
                      <a-input
                        v-model:value="parameterTempList[17].defaultValue"
                        class="range-field__input"
                        @input="
                          setSaveBtnEnable(
                            parameterTempList[17].inputOrOutput,
                            parameterTempList[17].parameterId,
                            parameterTempList[17].defaultValue,
                          )
                        " />
                    </a-form-item>
                    <a-form-item label="输出目录：" :label-col="formLabelColNarrow">
                      <a-input v-model:value="parameterTempList[22].defaultValue" style="width: 150px" disabled />
                    </a-form-item>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div style="margin: 20px">
            <ul class="harrangeUl">
              <li v-for="(picIndex, idx) in resultPicIndexes" :key="picIndex" class="harrangeLi">
                <img
                  v-if="getResultPicSrc(idx)"
                  style="cursor: pointer"
                  :src="getResultPicSrc(idx)"
                  width="300"
                  height="200"
                  @error="onResultPicError(idx)"
                  @click="viewPic(parameterTempList[picIndex].defaultValue)" />
                <div v-else class="pic-placeholder">暂无图片</div>
              </li>
            </ul>
          </div>
        </a-form>
      </div>
    </div>

    <!-- 文本框文件上传窗口 -->
    <a-modal v-model:visible="uploadInputFileModal" title="上传APDL模板文件" :mask-closable="false" :width="650">
      <div style="width: 100%; height: 80px">
        <a-upload
          :max-count="1"
          :multiple="false"
          accept=".*"
          :file-list="inputFileList"
          :custom-request="customRequestInputUpload"
          @remove="removeInputFileList">
          请选择附件：
          <a-button>
            <template #icon>
              <UploadOutlined />
            </template>
            上传文件
          </a-button>
        </a-upload>
        <br />
        <div style="float: left">
          <a-input v-model:value="fileid" placeholder="" style="width: 100px; float: left; display: none" allow-clear />
        </div>
      </div>
      <template #footer>
        <a-button type="primary" @click="addInputFileUpload">确定</a-button>
        <a-button @click="cancelInputFileUpload">取消</a-button>
      </template>
    </a-modal>

    <a-modal v-model:visible="showPicviewModel" :mask-closable="false" :width="600" :footer="null">
      <img :src="picUrl" style="max-width: 600px; max-height: 400px" />
      <div style="margin-top: 16px; text-align: right">
        <a-button type="primary" @click="showPicviewModel = false">关闭</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCustomPageTaskParamMap } from '@/views/product/activityPage/custompage/_shared/composables/useCustomPageTaskParamMap';
import { message } from 'ant-design-vue';
import { CalculatorOutlined, UploadOutlined } from '@ant-design/icons-vue';
import type { UploadFile } from 'ant-design-vue';
import * as Three from 'three';
import type { OrthographicCamera, Scene, Vector3, WebGLRenderer } from 'three';
import HttpRequestConfig from '@/httpRequest/config';
import { useUserStore } from '@/store/modules/user';
import { executeAnsysSimulate, isValid } from '@/api/flowData/flowData';
import { createDefaultAnsysParameterList } from './ansys/parameterDefaults';
import { loadAnsysPageParameters } from './ansys/loadPageParameters';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { downloadFileFromStream } from '@/utils/file';

defineOptions({ name: 'rx-customizedProcess-ansys1' });

interface ParameterItem {
  inputOrOutput?: string;
  ifSingleLine?: string;
  inputType?: string;
  parameterNum?: string;
  parameterId?: string;
  defaultValue?: string;
  pageId?: string;
  inputName?: string;
  id?: string | number;
  tableMap?: {
    colNums: number;
    rowData: Record<string, unknown>[];
  };
}

const props = withDefaults(
  defineProps<{
    width?: number;
    modalFlag?: boolean;
    pageid?: string;
    parameterTempList?: ParameterItem[];
  }>(),
  {
    width: 1000,
    modalFlag: false,
    pageid: '',
    parameterTempList: () => [],
  },
);

const emit = defineEmits<{
  setSaveBtnEnable: [value: boolean];
}>();

const userStore = useUserStore();
const route = useRoute();

const minioPreviewUrl = String(import.meta.env.VITE_MINIO_PREVIEW_URL ?? '').trim();
const resultPicIndexes = [18, 19, 20];
const resultPicLoadFailed = ref<boolean[]>([false, false, false]);

const labelWidth = 200;
const formLabelCol = { style: { width: `${labelWidth}px` } };
const formLabelColNarrow = { style: { width: `${labelWidth - 50}px` } };

let scene: Scene | undefined;
let mesh: unknown;
let animationFrameId: number | null = null;

const camera = ref<OrthographicCamera | null>(null);
const renderer = ref<WebGLRenderer | null>(null);

const containerRef = ref<HTMLDivElement | null>(null);

const uploadInputFileModal = ref(false);
const uploadFileInputId = ref<ParameterItem | string>('');
const uploadInputType = ref('');
const inputfileid = ref('');
const inputfilename = ref('');
const inputFileList = ref<UploadFile[]>([]);
const fileid = ref('');
const loadingtype = ref(false);
const showPicviewModel = ref(false);
const picUrl = ref('');

const selectRow = ref<Record<string, unknown> | null>(null);
const thLength = ref(0);

const bzVar = {
  gap: 0.1,
  bLen: 0.5,
  cLen: 0.2,
  aLen: 0.5,
};

function initCustomizedProcess_ansys1Data(): ParameterItem[] {
  return createDefaultAnsysParameterList(props.pageid);
}

function createInitialParameterList(): ParameterItem[] {
  if (!props.parameterTempList || props.parameterTempList.length <= 0) {
    return initCustomizedProcess_ansys1Data();
  }
  return props.parameterTempList.map(item => ({ ...item }));
}

const parameterTempList = ref<ParameterItem[]>(createInitialParameterList());
const { applyTaskParamMapToList, loadPageParametersIfNeeded, setupParameterWatch, mountWithTaskParamMap } =
  useCustomPageTaskParamMap({
    props,
    parameterTempList,
    loadPageParameters: loadAnsysPageParameters,
  });


function resolvePicUrl(url?: string | null) {
  const raw = String(url ?? '').trim();
  if (!raw) return '';

  if (/^https?:\/\//i.test(raw) || raw.startsWith('data:')) {
    return raw;
  }

  const fileIdMatch = raw.match(/^(\d+)(?:[:：].*)?$/);
  if (fileIdMatch) {
    return `${HttpRequestConfig.baseUrl}/system-service/fileManagerController/download.json?fileId=${fileIdMatch[1]}`;
  }

  if (/^\/Api\//i.test(raw)) {
    return `${HttpRequestConfig.baseUrl}${raw.replace(/^\/Api/i, '')}`;
  }

  if (raw.startsWith('/system-service/') || raw.startsWith('system-service/')) {
    const path = raw.startsWith('/') ? raw.slice(1) : raw;
    return `${HttpRequestConfig.baseUrl}/${path}`;
  }

  if (raw.startsWith('/')) {
    if (minioPreviewUrl) {
      return `${minioPreviewUrl.replace(/\/$/, '')}${raw}`;
    }
    return `${HttpRequestConfig.baseUrl}${raw}`;
  }

  if (minioPreviewUrl) {
    return `${minioPreviewUrl.replace(/\/$/, '')}/${raw.replace(/^\//, '')}`;
  }

  return raw;
}

function resetResultPicLoadState() {
  resultPicLoadFailed.value = [false, false, false];
}

function getResultPicSrc(idx: number) {
  if (resultPicLoadFailed.value[idx]) return '';
  const picIndex = resultPicIndexes[idx];
  return resolvePicUrl(parameterTempList.value[picIndex]?.defaultValue);
}

function onResultPicError(idx: number) {
  resultPicLoadFailed.value[idx] = true;
}


function makeShape() {
  const L = Number(parameterTempList.value[4].defaultValue);
  const W = Number(parameterTempList.value[5].defaultValue);
  const L1 = Number(parameterTempList.value[6].defaultValue);
  const R1 = Number(parameterTempList.value[7].defaultValue);
  const R = Number(parameterTempList.value[8].defaultValue);
  const shape = new Three.Shape();
  shape.moveTo(0, W / 2);
  shape.lineTo(L, W / 2);
  shape.lineTo(L, -W / 2 - L1);
  shape.arc(-W / 2, 0, W / 2, 0, Math.PI, true);
  shape.lineTo(L - W, -W / 2 - R1);
  shape.arc(-R1, 0, R1, 0, Math.PI / 2, false);
  shape.lineTo(0, -W / 2);
  shape.arc(0, W / 2, W / 2, -Math.PI / 2, Math.PI / 2, true);
  const cir1 = new Three.Path();
  cir1.moveTo(0, 0);
  cir1.absarc(0, 0, R, 0, Math.PI * 2, true);
  shape.holes.push(cir1);
  const cir2 = new Three.Path();
  cir2.moveTo(L - W / 2, -W / 2 - L1);
  cir2.absarc(L - W / 2, -W / 2 - L1, R, 0, Math.PI * 2, true);
  shape.holes.push(cir2);
  return shape;
}

function horBz(sx: number, sy: number, ex: number, ey: number) {
  const gap = bzVar.gap;
  const bLen = bzVar.bLen;
  const cLen = bzVar.cLen;
  const aLen = bzVar.aLen;
  const degree = Math.PI / 24;

  const geometry = new Three.BufferGeometry();
  const lineMaterial = new Three.LineBasicMaterial({
    color: '#333',
    linewidth: 3,
  });
  const pointsArray: Vector3[] = [];
  pointsArray.push(new Three.Vector3(sx, sy + gap, 0));
  pointsArray.push(new Three.Vector3(sx, sy + gap + bLen, 0));
  pointsArray.push(new Three.Vector3(sx, sy + gap + cLen, 0));
  pointsArray.push(new Three.Vector3(sx + aLen * Math.cos(degree), sy + gap + cLen + aLen * Math.sin(degree), 0));
  pointsArray.push(new Three.Vector3(sx, sy + gap + cLen, 0));
  pointsArray.push(new Three.Vector3(sx + aLen * Math.cos(degree), sy + gap + cLen - aLen * Math.sin(degree), 0));
  pointsArray.push(new Three.Vector3(sx, sy + gap + cLen, 0));
  pointsArray.push(new Three.Vector3(ex, sy + gap + cLen, 0));
  pointsArray.push(new Three.Vector3(ex, sy + gap + cLen, 0));
  pointsArray.push(new Three.Vector3(ex - aLen * Math.cos(degree), ey + gap + cLen + aLen * Math.sin(degree), 0));
  pointsArray.push(new Three.Vector3(ex, sy + gap + cLen, 0));
  pointsArray.push(new Three.Vector3(ex - aLen * Math.cos(degree), ey + gap + cLen - aLen * Math.sin(degree), 0));
  pointsArray.push(new Three.Vector3(ex, ey + gap, 0));
  pointsArray.push(new Three.Vector3(ex, ey + gap + bLen, 0));

  geometry.setFromPoints(pointsArray);
  return new Three.LineSegments(geometry, lineMaterial);
}

function verBz(sx: number, sy: number, ex: number, ey: number, ifShowBorderLine?: boolean) {
  const gap = bzVar.gap;
  const bLen = bzVar.bLen;
  const cLen = bzVar.cLen;
  const aLen = bzVar.aLen;
  const degree = Math.PI / 24;

  const geometry = new Three.BufferGeometry();
  const lineMaterial = new Three.LineBasicMaterial({
    color: '#333',
    linewidth: 3,
  });
  const pointsArray: Vector3[] = [];
  let showBorder = ifShowBorderLine;
  if (showBorder === undefined) {
    showBorder = true;
  }
  if (showBorder === true) {
    pointsArray.push(new Three.Vector3(sx + gap, sy, 0));
    pointsArray.push(new Three.Vector3(sx + gap + bLen, sy, 0));
  }
  pointsArray.push(new Three.Vector3(sx + gap + cLen, sy, 0));
  pointsArray.push(new Three.Vector3(sx + gap + cLen + aLen * Math.sin(degree), sy - aLen * Math.cos(degree), 0));
  pointsArray.push(new Three.Vector3(sx + gap + cLen, sy, 0));
  pointsArray.push(new Three.Vector3(sx + gap + cLen - aLen * Math.sin(degree), sy - aLen * Math.cos(degree), 0));
  pointsArray.push(new Three.Vector3(sx + gap + cLen, sy, 0));
  pointsArray.push(new Three.Vector3(ex + gap + cLen, ey, 0));
  pointsArray.push(new Three.Vector3(ex + gap + cLen, ey, 0));
  pointsArray.push(new Three.Vector3(ex + gap + cLen + aLen * Math.sin(degree), ey + aLen * Math.cos(degree), 0));
  pointsArray.push(new Three.Vector3(ex + gap + cLen, ey, 0));
  pointsArray.push(new Three.Vector3(ex + gap + cLen - aLen * Math.sin(degree), ey + aLen * Math.cos(degree), 0));
  if (showBorder === true) {
    pointsArray.push(new Three.Vector3(ex + gap, ey, 0));
    pointsArray.push(new Three.Vector3(ex + gap + bLen, ey, 0));
  }

  geometry.setFromPoints(pointsArray);
  return new Three.LineSegments(geometry, lineMaterial);
}

function radiusBz(cx: number, cy: number, r: number, deg: number) {
  let aLen = bzVar.aLen;
  const degree = Math.PI / 24;
  const geometry = new Three.BufferGeometry();
  const lineMaterial = new Three.LineBasicMaterial({
    color: '#333',
    linewidth: 3,
  });
  if (r <= aLen) {
    aLen = r - 0.1;
  }
  const pointsArray: Vector3[] = [];
  pointsArray.push(new Three.Vector3(cx, cy, 0));
  pointsArray.push(new Three.Vector3(cx + r * Math.cos(deg), cy + r * Math.sin(deg), 0));
  pointsArray.push(new Three.Vector3(cx + r * Math.cos(deg), cy + r * Math.sin(deg), 0));
  pointsArray.push(
    new Three.Vector3(
      cx + r * Math.cos(deg) - aLen * Math.cos(deg - degree),
      cy + r * Math.sin(deg) - aLen * Math.sin(deg - degree),
      0,
    ),
  );
  pointsArray.push(new Three.Vector3(cx + r * Math.cos(deg), cy + r * Math.sin(deg), 0));
  pointsArray.push(
    new Three.Vector3(
      cx + r * Math.cos(deg) - aLen * Math.cos(deg + degree),
      cy + r * Math.sin(deg) - aLen * Math.sin(deg + degree),
      0,
    ),
  );

  geometry.setFromPoints(pointsArray);
  return new Three.LineSegments(geometry, lineMaterial);
}

function makeTextSprite(msg: string) {
  const fontsize = 14;
  const fontface = 'Arial';
  const borderThickness = 1;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    return new Three.Sprite(new Three.SpriteMaterial());
  }
  context.font = `Normal ${fontsize}px ${fontface}`;
  const metrics = context.measureText(msg);
  context.lineWidth = borderThickness;
  context.fillStyle = 'rgba(45 45, 45, 1.0)';
  context.fillText(msg, borderThickness, fontsize + borderThickness);
  const texture = new Three.Texture(canvas);
  texture.needsUpdate = true;
  const spriteMaterial = new Three.SpriteMaterial({
    map: texture,
  });
  const sprite = new Three.Sprite(spriteMaterial);
  sprite.scale.set(5, 3, 1.0);
  return sprite;
}

function init() {
  const L = Number(parameterTempList.value[4].defaultValue);
  const W = Number(parameterTempList.value[5].defaultValue);
  const L1 = Number(parameterTempList.value[6].defaultValue);
  const R1 = Number(parameterTempList.value[7].defaultValue);
  const R = Number(parameterTempList.value[8].defaultValue);

  const container = containerRef.value;
  if (!container) {
    return;
  }

  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild!);
  }

  if (renderer.value) {
    renderer.value.dispose();
    renderer.value = null;
  }

  scene = new Three.Scene();
  scene.background = new Three.Color(0xffffff);

  const helper = new Three.GridHelper(10, 20, 0xcccccc, 0xeeeeee);
  helper.rotation.x = Math.PI / 2;
  scene.add(helper);

  const shape = makeShape();
  const extrudeSettings = {
    steps: 1,
    depth: Number(parameterTempList.value[1].defaultValue),
    bevelEnabled: false,
    bevelThickness: 0,
    bevelSize: 1,
    bevelOffset: 0,
    bevelSegments: 1,
  };
  const geometry = new Three.ExtrudeGeometry(shape, extrudeSettings);
  new Three.Mesh(
    geometry,
    new Three.MeshPhongMaterial({
      color: 0xffff00,
    }),
  );
  const edges = new Three.EdgesGeometry(geometry);
  const edgesMaterial = new Three.LineBasicMaterial({
    color: 0x000000,
  });
  const offsetX = -(L - W / 2) / 2;
  const offsetY = (W / 2 + L1) / 2;
  const line = new Three.LineSegments(edges, edgesMaterial);
  line.position.set(offsetX, offsetY, 0);
  scene.add(line);

  const bzL = horBz(0, W / 2, L, W / 2);
  bzL.position.set(offsetX, offsetY, 0);
  scene.add(bzL);
  const valL = makeTextSprite(`L = ${L}`);
  valL.position.set(L / 2 - 0.5, W / 2 + bzVar.gap + bzVar.cLen + 0.5, 0);
  scene.add(valL);

  const bzW = verBz(W / 2, W / 2, W / 2, -W / 2, false);
  bzW.position.set(offsetX, offsetY, 0);
  scene.add(bzW);
  const valW = makeTextSprite(`W = ${W}`);
  valW.position.set(W / 2 + 0.3, 0.5 / 2, 0);
  scene.add(valW);

  const bzL1 = verBz(L, -W / 2, L, -W / 2 - L1, true);
  bzL1.position.set(offsetX, offsetY, 0);
  scene.add(bzL1);
  const valL1 = makeTextSprite(`L1 = ${L1}`);
  valL1.position.set(L + 0.3, -(W / 2 + L1) / 2, 0);
  scene.add(valL1);

  const bzR1 = radiusBz(L - W - R1, -W / 2 - R1, R1, Math.PI / 4);
  bzR1.position.set(offsetX, offsetY, 0);
  scene.add(bzR1);
  const valR1 = makeTextSprite(`R1 = ${R1}`);
  valR1.position.set((L - W / 2) / 2, -(W / 2 + L1) / 2, 0);
  scene.add(valR1);

  const bzR = radiusBz(0, 0, R, (Math.PI * 3) / 4);
  bzR.position.set(-(L - W / 2) / 2, (W / 2 + L1) / 2, 0);
  scene.add(bzR);
  const bzR2 = radiusBz(0, 0, R, -Math.PI / 4);
  bzR2.position.set(-(L - W / 2) / 2, (W / 2 + L1) / 2, 0);
  scene.add(bzR2);
  const val2R = makeTextSprite('2R');
  val2R.position.set(-0.2, 0.2, 0);
  scene.add(val2R);

  const bzRr = radiusBz(L - W / 2, -W / 2 - L1, R, (Math.PI * 3) / 4);
  bzRr.position.set(-(L - W / 2) / 2, (W / 2 + L1) / 2, 0);
  scene.add(bzRr);
  const bzR2r = radiusBz(L - W / 2, -W / 2 - L1, R, -Math.PI / 4);
  bzR2r.position.set(-(L - W / 2) / 2, (W / 2 + L1) / 2, 0);
  scene.add(bzR2r);
  const val2Rr = makeTextSprite('2R');
  val2Rr.position.set(L - W / 2 - 0.2, -W / 2 - L1 + 0.2, 0);
  scene.add(val2Rr);

  const ratio = 0.05;
  const width1 = container.clientWidth * ratio;
  const height1 = container.clientHeight * ratio;
  const k = width1 / height1;
  let max = L + W / 2 + 0.6;
  if (max < L1 + W * 1.5 + 0.6) {
    max = L1 + W * 1.5 + 0.6;
  }
  const s = max / 2;

  camera.value = new Three.OrthographicCamera(-s * k, s * k, s, -s, 1, 100);
  camera.value.position.set(0, 0, 10);
  camera.value.lookAt(scene.position);

  renderer.value = new Three.WebGLRenderer({ antialias: true });
  renderer.value.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.value.domElement);
}

function animate() {
  animationFrameId = requestAnimationFrame(animate);
  if (renderer.value && camera.value && scene) {
    renderer.value.render(scene, camera.value);
  }
}

function setSaveBtnEnable(inputOrOutput?: string, parameterId?: string, parameterValue?: string) {
  emit('setSaveBtnEnable', true);
  if (inputOrOutput === undefined || inputOrOutput === '1') {
    return;
  }
  if (parameterId === undefined || parameterId === null || Number(parameterId) <= 0) {
    return;
  }
  if (parameterValue === undefined || parameterValue === null) {
    return;
  }
  parameterTempList.value.forEach(item => {
    if (item.ifSingleLine !== 't') {
      if (item.parameterId === parameterId) {
        item.defaultValue = parameterValue;
      }
    } else if (item.tableMap && item.tableMap.colNums > 0) {
      const colNums = item.tableMap.colNums;
      item.tableMap.rowData.forEach(row => {
        for (let i = 0; i < colNums; i++) {
          if (row[`cellParameterId${i}`] === parameterId) {
            row[`p${i}`] = parameterValue;
          }
        }
      });
    }
  });
}

function changeInputVal(_itemid?: string | number) {
  scene = undefined;
  mesh = undefined;
  setSaveBtnEnable();
  init();
}

async function solve() {
  const templatefile = parameterTempList.value[21].defaultValue;
  if (isValid(templatefile) === false) {
    message.info('请指定模板文件');
    return;
  }
  setSaveBtnEnable();
  loadingtype.value = true;
  const data: Record<string, unknown> = {
    userid: userStore.getUser.id,
    templatefile,
    data: parameterTempList.value,
  };
  try {
    const response: any = await executeAnsysSimulate(data);
    loadingtype.value = false;
    if (response === undefined || response.code !== '0') {
      message.info('执行失败，服务器异常');
      return;
    }
    if (response.data.result === false) {
      message.info(response.data.msg);
      return;
    }
    parameterTempList.value[18].defaultValue = response.data.pic1;
    parameterTempList.value[19].defaultValue = response.data.pic2;
    parameterTempList.value[20].defaultValue = response.data.pic3;
    parameterTempList.value[22].defaultValue = response.data.outputdir;
    resetResultPicLoadState();
  } catch {
    loadingtype.value = false;
    message.info('执行失败，服务器异常');
  }
}

function viewPic(url?: string) {
  picUrl.value = resolvePicUrl(url);
  if (!picUrl.value) return;
  showPicviewModel.value = true;
}

async function customRequestInputUpload(options: {
  file: File | Blob | string;
  onSuccess?: (body: unknown, file?: File) => void;
  onError?: (e: Error) => void;
}) {
  const { file, onSuccess, onError } = options;
  if (!(file instanceof File)) {
    onError?.(new Error('invalid file'));
    return;
  }
  try {
    const uploadRes = await AdminApiSystemUploadFile.uploadFile({
      file,
      userId: userStore.getUser.id as number,
      confidentialLevel: 1,
    });
    const uploadData = uploadRes?.data as Record<string, unknown> | undefined;
    if (uploadData?.code == 0) {
      inputfileid.value = String(uploadData.id ?? '');
      inputfilename.value = String(uploadData.oldFileName ?? file.name ?? '');
      onSuccess?.(uploadData, file);
      message.success('上传成功');
    } else {
      message.error('上传失败');
      onError?.(new Error('upload failed'));
    }
  } catch {
    message.error('上传失败');
    onError?.(new Error('upload failed'));
  }
}

function addInputFileUpload() {
  if (uploadInputType.value === 'input') {
    parameterTempList.value[21].defaultValue = `${inputfileid.value}:${inputfilename.value}`;
  } else if (selectRow.value) {
    selectRow.value[`p${thLength.value - 1}`] = `${inputfileid.value}:${inputfilename.value}`;
  }
  uploadInputFileModal.value = false;
  setSaveBtnEnable();
}

function removeInputFileList() {
  inputFileList.value = [];
  inputfileid.value = '';
  inputfilename.value = '';
}

function cancelInputFileUpload() {
  inputFileList.value = [];
  uploadInputFileModal.value = false;
}

async function downloadFileType(fileidStr?: string | null) {
  if (fileidStr == null) {
    return;
  }
  let fid = fileidStr;
  let fileName = 'download';
  if (fileidStr.includes(':')) {
    const fileStr = fileidStr.split(':');
    fid = fileStr[0];
    fileName = fileStr.slice(1).join(':') || 'download';
  }
  try {
    const res = await AdminApiSystemUploadFile.downloadEpcFile({ fileId: fid } as any);
    const stream = (res as any)?.data !== undefined ? (res as any).data : res;
    downloadFileFromStream(stream, fileName);
  } catch {
    window.location.href = `${HttpRequestConfig.baseUrl}/system-service/fileManagerController/download.json?fileId=${fid}`;
  }
}

function selectInputFileUpload(init: ParameterItem) {
  inputFileList.value = [];
  inputfileid.value = '';
  inputfilename.value = '';
  uploadInputType.value = 'input';
  uploadFileInputId.value = init;
  uploadInputFileModal.value = true;
}

function cleanupThree() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  if (renderer.value) {
    renderer.value.dispose();
    if (renderer.value.domElement?.parentNode) {
      renderer.value.domElement.parentNode.removeChild(renderer.value.domElement);
    }
    renderer.value = null;
  }
  camera.value = null;
  scene = undefined;
  mesh = undefined;
}

function getCurrentSaveParamValues() {
  return parameterTempList.value
    .filter(item => String(item.parameterNum ?? '').trim())
    .map(item => ({
      paramKey: String(item.parameterNum),
      paramName: String(item.inputName ?? item.parameterNum),
      paramValue: String(item.defaultValue ?? ''),
    }));
}

defineExpose({
  getCurrentSaveParamValues,
});

onMounted(async () => {
  await loadPageParametersIfNeeded();
  init();
  animate();
});

onBeforeUnmount(() => {
  cleanupThree();
});
</script>

<style scoped>
.layout-wrapper {
  padding: 0 10px;
  background-color: #ffffff;
}

.section-title {
  border-bottom: 1px silver solid;
  font-weight: 600;
  padding-left: 10px;
  width: 100px;
}

.section-title-text {
  float: left;
  font-weight: 700;
  margin-bottom: 10px;
}

.main-section {
  width: 100%;
  min-height: calc(100vh - 400px);
  background-color: #ffffff;
  padding-top: 20px;
  margin-left: 15px;
}

.form-column-left {
  width: 430px;
  height: 100%;
  float: left;
}

.form-column-right {
  width: 500px;
  height: 100%;
  float: left;
}

.three-container {
  width: 500px;
  height: 335px;
  margin-bottom: 20px;
  border: 1px solid #eee;
}

.harrangeUl {
  margin: 0 0 0 0px;
  text-align: center;
  width: 920px;
}

.harrangeLi {
  margin-right: 10px;
  float: left;
  width: 300px;
}

.range-field__input {
  width: 72px !important;
  flex: 0 0 72px;
}

.pic-placeholder {
  width: 300px;
  height: 200px;
  line-height: 200px;
  border: 1px dashed #d9d9d9;
  color: rgba(0, 0, 0, 0.45);
  background: #fafafa;
}
</style>
