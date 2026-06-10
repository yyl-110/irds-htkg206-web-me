import type { CustomPageParameterLoader } from '../_shared/utils/createParameterLoader';
import { createParameterLoader, wrapExistingParameterLoader } from '../_shared/utils/createParameterLoader';

/** 自定义页 key → 参数加载（默认列表 + task-param-map 合并） */
export const CUSTOM_PAGE_PARAMETER_LOADERS: Partial<Record<string, CustomPageParameterLoader>> = {
  'customized-process-ansys': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadAnsysPageParameters } = await import('../ansys/loadPageParameters');
    return loadAnsysPageParameters(pageId, saved);
  }),
  'customized-process-jsinvoke': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadJsinvokePageParameters } = await import('../jsinvoke/loadPageParameters');
    return loadJsinvokePageParameters(pageId, saved);
  }),

  'customized-process-page0': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage0PageParameters } = await import('../page0/loadPageParameters');
    return loadPage0PageParameters(pageId, saved);
  }),
  'customized-process-page0-1': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage0_1PageParameters } = await import('../page0-1/loadPageParameters');
    return loadPage0_1PageParameters(pageId, saved);
  }),
  'customized-process-page0-2': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage1_1_1_1PageParameters } = await import('../page0-2/loadPageParameters');
    return loadPage1_1_1_1PageParameters(pageId, saved);
  }),
  'customized-process-page0-3': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage0_3PageParameters } = await import('../page0-3/loadPageParameters');
    return loadPage0_3PageParameters(pageId, saved);
  }),
  'customized-process-page0-4': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage0_5PageParameters } = await import('../page0-5/loadPageParameters');
    return loadPage0_5PageParameters(pageId, saved);
  }),
  'customized-process-page1': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage1PageParameters } = await import('../page1/loadPageParameters');
    return loadPage1PageParameters(pageId, saved);
  }),
  'customized-process-page1-1': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage0_5PageParameters } = await import('../page0-5/loadPageParameters');
    return loadPage0_5PageParameters(pageId, saved);
  }),
  'customized-process-page1-2': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage1_2PageParameters } = await import('../page1-2/loadPageParameters');
    return loadPage1_2PageParameters(pageId, saved);
  }),
  'customized-process-page1-3': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage1_3PageParameters } = await import('../page1-3/loadPageParameters');
    return loadPage1_3PageParameters(pageId, saved);
  }),
  'customized-process-page1-4': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage1_4PageParameters } = await import('../page1-4/loadPageParameters');
    return loadPage1_4PageParameters(pageId, saved);
  }),
  'customized-process-page2': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage2PageParameters } = await import('../page2/loadPageParameters');
    return loadPage2PageParameters(pageId, saved);
  }),
  'customized-process-page2-1': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage2_1PageParameters } = await import('../page2-1/loadPageParameters');
    return loadPage2_1PageParameters(pageId, saved);
  }),
  'customized-process-page3': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage3PageParameters } = await import('../page3/loadPageParameters');
    return loadPage3PageParameters(pageId, saved);
  }),
  'customized-process-page3-1': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage3PageParameters } = await import('../page3/loadPageParameters');
    return loadPage3PageParameters(pageId, saved);
  }),
  'customized-process-page4': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage4PageParameters } = await import('../page4/loadPageParameters');
    return loadPage4PageParameters(pageId, saved);
  }),
  'customized-process-page5': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage5PageParameters } = await import('../page5/loadPageParameters');
    return loadPage5PageParameters(pageId, saved);
  }),
  'customized-process-page6': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage6PageParameters } = await import('../page6/loadPageParameters');
    return loadPage6PageParameters(pageId, saved);
  }),
  'customized-process-page7': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage7PageParameters } = await import('../page7/loadPageParameters');
    return loadPage7PageParameters(pageId, saved);
  }),
  'customized-process-page8': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage8PageParameters } = await import('../page8/loadPageParameters');
    return loadPage8PageParameters(pageId, saved);
  }),
  'customized-process-page9': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage9PageParameters } = await import('../page9/loadPageParameters');
    return loadPage9PageParameters(pageId, saved);
  }),
  'customized-process-page10': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage10PageParameters } = await import('../page10/loadPageParameters');
    return loadPage10PageParameters(pageId, saved);
  }),
  'customized-process-page11': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadPage11PageParameters } = await import('../page11/loadPageParameters');
    return loadPage11PageParameters(pageId, saved);
  }),

  'customized-process-tbdemo1-page1': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadTbdemo1PageParameters } = await import('../tbdemo1-page1/loadPageParameters');
    return loadTbdemo1PageParameters(pageId, saved);
  }),
  'customized-process-tbdemo1-page2': wrapExistingParameterLoader(async (pageId, saved) => {
    const { loadTbdemo1Page2Parameters } = await import('../tbdemo1-page2/loadPageParameters');
    return loadTbdemo1Page2Parameters(pageId, saved);
  }),

  'customized-process-zjzcjh1-1': wrapExistingParameterLoader(async pageId => {
    const { loadZjzcjhPageParameters } = await import('../zjzcjh1-1/loadPageParameters');
    return loadZjzcjhPageParameters(pageId);
  }),
  'customized-process-zlkwjc1-1': wrapExistingParameterLoader(async pageId => {
    const { loadZlkwjcPageParameters } = await import('../zlkwjc1-1/loadPageParameters');
    return loadZlkwjcPageParameters(pageId);
  }),

  'customized-process1-zt1-1-12': wrapExistingParameterLoader(async pageId => {
    const { loadZt1PageParameters } = await import('../ZT1_1_12/loadPageParameters');
    return loadZt1PageParameters(pageId);
  }),
  'customized-process1-zt1-4-10-1': wrapExistingParameterLoader(async pageId => {
    const { loadZt1_4101PageParameters } = await import('../ZT1_4_10_1/loadPageParameters');
    return loadZt1_4101PageParameters(pageId);
  }),
  'customized-process1-zt1-4-10-2': wrapExistingParameterLoader(async pageId => {
    const { loadZt1_4102PageParameters } = await import('../ZT1_4_10_2/loadPageParameters');
    return loadZt1_4102PageParameters(pageId);
  }),
  'customized-process1-zt1-5-3-2-a': wrapExistingParameterLoader(async pageId => {
    const { loadZt1_532APageParameters } = await import('../ZT1_5_3_2A/loadPageParameters');
    return loadZt1_532APageParameters(pageId);
  }),
  'customized-process1-zt1-5-3-2-b': wrapExistingParameterLoader(async pageId => {
    const { loadZt1_532BPageParameters } = await import('../ZT1_5_3_2B/loadPageParameters');
    return loadZt1_532BPageParameters(pageId);
  }),
  'customized-process1-zt1-5-3-2-c': wrapExistingParameterLoader(async pageId => {
    const { loadZt1_532CPageParameters } = await import('../ZT1_5_3_2C/loadPageParameters');
    return loadZt1_532CPageParameters(pageId);
  }),
  'customized-process1-zt1-4-4': wrapExistingParameterLoader(async pageId => {
    const { loadZt1_44PageParameters } = await import('../ZT1_4_4/loadPageParameters');
    return loadZt1_44PageParameters(pageId);
  }),

  'customized-process3-fs-1-5-1-j': wrapExistingParameterLoader(async pageId => {
    const { loadFs151JPageParameters } = await import('../FS_1_5_1J/loadPageParameters');
    return loadFs151JPageParameters(pageId);
  }),
  'customized-process3-fs1-5-1-4': wrapExistingParameterLoader(async pageId => {
    const { loadFs151_4PageParameters } = await import('../FS1_5_1_4/loadPageParameters');
    return loadFs151_4PageParameters(pageId);
  }),
  'customized-process3-fs1-5-1-5': wrapExistingParameterLoader(async pageId => {
    const { loadFs151_5PageParameters } = await import('../FS1_5_1_5/loadPageParameters');
    return loadFs151_5PageParameters(pageId);
  }),
  'customized-process3-fs1-5-1-6': wrapExistingParameterLoader(async pageId => {
    const { loadFs151_6PageParameters } = await import('../FS1_5_1_6/loadPageParameters');
    return loadFs151_6PageParameters(pageId);
  }),
  'customized-process3-fs1-5-1-k': wrapExistingParameterLoader(async pageId => {
    const { loadFs15_1KPageParameters } = await import('../FS1_5_1K/loadPageParameters');
    return loadFs15_1KPageParameters(pageId);
  }),
  'customized-process3-fs1-5-1-l': wrapExistingParameterLoader(async pageId => {
    const { loadFs15_1LPageParameters } = await import('../FS1_5_1L/loadPageParameters');
    return loadFs15_1LPageParameters(pageId);
  }),
  'customized-process3-fs1-5-g': wrapExistingParameterLoader(async pageId => {
    const { loadFs15GPageParameters } = await import('../FS1_5G/loadPageParameters');
    return loadFs15GPageParameters(pageId);
  }),
  'customized-process3-fs1-12-1-2-b': wrapExistingParameterLoader(async pageId => {
    const { loadAdapterPageParameters } = await import('../FS1_12_1_2/_common/loadPageParameters');
    const { ADAPTER_PAGE_CONFIG } = await import('../FS1_12_1_2B/config');
    return loadAdapterPageParameters(ADAPTER_PAGE_CONFIG, pageId);
  }),
  'customized-process3-fs1-12-1-2-c': wrapExistingParameterLoader(async pageId => {
    const { loadAdapterPageParameters } = await import('../FS1_12_1_2/_common/loadPageParameters');
    const { ADAPTER_PAGE_CONFIG } = await import('../FS1_12_1_2C/config');
    return loadAdapterPageParameters(ADAPTER_PAGE_CONFIG, pageId);
  }),
  'customized-process3-fs1-12-1-2-d': wrapExistingParameterLoader(async pageId => {
    const { loadAdapterPageParameters } = await import('../FS1_12_1_2/_common/loadPageParameters');
    const { ADAPTER_PAGE_CONFIG } = await import('../FS1_12_1_2D/config');
    return loadAdapterPageParameters(ADAPTER_PAGE_CONFIG, pageId);
  }),
  'customized-process3-fs1-5-1-1-g': wrapExistingParameterLoader(async pageId => {
    const { loadFs151_1GPageParameters } = await import('../FS1_5_1_1G/loadPageParameters');
    return loadFs151_1GPageParameters(pageId);
  }),
  'customized-process3-fs1-5-1-1-k': wrapExistingParameterLoader(async pageId => {
    const { loadFs151_1_1KPageParameters } = await import('../FS1_5_1_1_K/loadPageParameters');
    return loadFs151_1_1KPageParameters(pageId);
  }),
  'customized-process3-fs1-5-1-1-l': wrapExistingParameterLoader(async pageId => {
    const { loadFs151_1_1LPageParameters } = await import('../FS1_5_1_1_L/loadPageParameters');
    return loadFs151_1_1LPageParameters(pageId);
  }),
  'customized-process3-fs1-5-1-1-m': wrapExistingParameterLoader(async pageId => {
    const { loadFs151_1_1MPageParameters } = await import('../FS1_5_1_1_M/loadPageParameters');
    return loadFs151_1_1MPageParameters(pageId);
  }),
  'customized-process3-fs1-5-1-1-n': wrapExistingParameterLoader(async pageId => {
    const { loadFs151_1_1NPageParameters } = await import('../FS1_5_1_1_N/loadPageParameters');
    return loadFs151_1_1NPageParameters(pageId);
  }),
  'customized-process3-fs1-5-1-1-o': wrapExistingParameterLoader(async pageId => {
    const { loadFs151_1_1OPageParameters } = await import('../FS1_5_1_1_O/loadPageParameters');
    return loadFs151_1_1OPageParameters(pageId);
  }),
  'customized-process3-fs1-5-1-1-2': wrapExistingParameterLoader(async pageId => {
    const { loadFs151_1_2PageParameters } = await import('../FS1_5_1_1_2/loadPageParameters');
    return loadFs151_1_2PageParameters(pageId);
  }),
  'customized-process3-fs1-5-1-1-4': wrapExistingParameterLoader(async pageId => {
    const { loadFs151_1_4PageParameters } = await import('../FS1_5_1_1_4/loadPageParameters');
    return loadFs151_1_4PageParameters(pageId);
  }),
  'customized-process3-fs1-5-1-1-6': wrapExistingParameterLoader(async pageId => {
    const { loadFs151_1_6PageParameters } = await import('../FS1_5_1_1_6/loadPageParameters');
    return loadFs151_1_6PageParameters(pageId);
  }),
  'customized-process3-fs1-5-1-1-9': wrapExistingParameterLoader(async pageId => {
    const { loadFs151_1_9PageParameters } = await import('../FS1_5_1_1_9/loadPageParameters');
    return loadFs151_1_9PageParameters(pageId);
  }),

  'zq-frame-design-page1': async (pageId, saved, savedTables) => {
    const { createDefaultZqFrameDesignPage1ParameterList } = await import('../zq-frameDesign-page1/parameterDefaults');
    return createParameterLoader(createDefaultZqFrameDesignPage1ParameterList)(pageId, saved, savedTables);
  },
  'zq-frame-design-page2': async (pageId, saved, savedTables) => {
    const { createDefaultZqFrameDesignPage2ParameterList } = await import('../zq-frameDesign-page2/parameterDefaults');
    return createParameterLoader(createDefaultZqFrameDesignPage2ParameterList)(pageId, saved, savedTables);
  },
  'zq-transmission-shaft-page1': async (pageId, saved, savedTables) => {
    const { createDefaultTransmissionShaftPage1ParameterList } = await import(
      '../zq-transmissionShaft-page1/parameterDefaults'
    );
    return createParameterLoader(createDefaultTransmissionShaftPage1ParameterList)(pageId, saved, savedTables);
  },
  'zq-transmission-shaft-page2': async (pageId, saved, savedTables) => {
    const { createDefaultTransmissionShaftPage2ParameterList } = await import(
      '../zq-transmissionShaft-page2/parameterDefaults'
    );
    return createParameterLoader(createDefaultTransmissionShaftPage2ParameterList)(pageId, saved, savedTables);
  },
};
