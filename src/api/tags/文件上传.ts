// import { OpenApiActions, type OpenApiTag } from "@wei/openapi-codegen/es/src/OpenApiTags";
import { ContentType, httpClient, type RequestParams } from './http-client';
import { CommonResultFileUploadResponseDTOModel } from '../models/upload/CommonResultFileUploadResponseDTOModel';
import { FileUploadResponseDTOModel, PreviewFileDTOModel } from '../models/upload/FileUploadResponseDTOModel';

/**
 * 文件上传
 */
export class AdminApiSystemUploadFile {
  /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
  static $tagName: string = `文件上传`;

  /** 获取文件信息 */
  static getFileStorage = <
    Req extends {
      fileId?: string;
      token?: string | null;
    } = {
      fileId?: string;
      token?: string | null;
    },
  >(
    data: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<PreviewFileDTOModel, any>(
      {
        path: `/file-storage/getFileStorage`,
        method: 'GET',
        query: data,
        secure: true,
        ...params,
      },
      PreviewFileDTOModel,
    );

  /** 使用公共组件预览 */
  static showKkFileView = <
    Req extends {
      fileId?: string;
      token?: string | null;
    } = {
      fileId?: string;
      token?: string | null;
    },
  >(
    data: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<PreviewFileDTOModel, any>(
      {
        path: `/common-api/common/file-storage/showByFileId`,
        method: 'GET',
        query: data,
        secure: true,
        ...params,
      },
      PreviewFileDTOModel,
    );

  /**
   * 文件上传
   *
   * @tags 管理后台 - 上传
   * @name uploadFile
   * @summary  文件上传
   * @request POST:/file-storage/uploadFile
   * @secure
   */
  static uploadFile = <
    Req extends {
      /** @format binary */
      file?: File;
      userId?: number;
    } = {
      /** @format binary */
      file?: File;
      userId?: number;
    },
  >(
    data: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultFileUploadResponseDTOModel, any>(
      {
        path: `system-service/fileManagerController/upload.json`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      CommonResultFileUploadResponseDTOModel,
    );

  /**
   * 文件上传并另存为pdf
   *
   * @tags 管理后台 - 上传
   * @name uploadWordToPDF
   * @summary  文件上传
   * @request POST:/file-storage/uploadWordToPDF.json
   * @secure
   */
  static uploadWordToPDF = <
    Req extends {
      /** @format binary */
      file?: File;
      userId?: number;
      securityLevel?: string;
    } = {
      /** @format binary */
      file?: File;
      userId?: number;
      securityLevel?: string;
    },
  >(
    data: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultFileUploadResponseDTOModel, any>(
      {
        path: `system-service/fileManagerController/uploadWordToPDF.json`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      CommonResultFileUploadResponseDTOModel,
    );

  /**
   * 文件上传
   *
   * @tags 管理后台 - 上传
   * @name uploadFile
   * @summary  文件上传
   * @request POST:/file-storage/downloadFile
   * @secure
   */
  static downloadEpcFile = <
    Req extends {
      /** @format binary */
      fileId?: String;
    } = {
      /** @format binary */
      fileId?: String;
    },
  >(
    data: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultFileUploadResponseDTOModel, any>(
      {
        path: `/system-service/fileManagerController/download.json`,
        method: 'GET',
        query: data,
        secure: true,
        format: 'blob',
        ...params,
      },
      CommonResultFileUploadResponseDTOModel,
    );

  /**
   * 模块树属性管理文件上传
   *
   * @tags 模块树属性管理文件上传 - 上传
   * @name uploadFile
   * @summary  模块树属性管理文件上传
   * @request POST:system-service/fileManagerController/uploadFileTransfer.json
   * @secure
   */
  static uploadFileTransfer = <
    Req extends {
      /** @format binary */
      fileId?: String;
      file: any;
    } = {
      /** @format binary */
      fileId?: String;
      file: any;
    },
  >(
    data: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultFileUploadResponseDTOModel, any>(
      {
        path: `/system-service/fileManagerController/uploadFileTransfer.json`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      CommonResultFileUploadResponseDTOModel,
    );

  /**
   * 产品平台GBOM导入功能
   *
   * @tags 产品平台GBOM导入功能
   * @name uploadFile
   * @summary  产品平台GBOM导入功能
   * @request POST:/file-storage/gBomImportData
   * @secure
   */
  static gBomImportData = <
    Req extends {
      /** @format binary */
      file?: File;
      userId?: number;
      proId?: string;
      id?: string;
    } = {
      /** @format binary */
      file?: File;
      userId?: number;
      proId?: string;
      id?: string;
    },
  >(
    data: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultFileUploadResponseDTOModel, any>(
      {
        path: `cirpoint-module-api/platformbomGBOM/import`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      CommonResultFileUploadResponseDTOModel,
    );

  /**
   * 设计查核导入功能
   *
   * @tags 设计查核导入功能
   * @name auditImportData
   * @summary  设计查核导入功能
   * @request POST:/cirpoint-module-api/auditLibrary/import
   * @secure
   */
  static paramImportData = <
    Req extends {
      /** @format binary */
      file?: File;
      userId?: number;
      seriesId?: string;
      proId?: string;
    } = {
      /** @format binary */
      file?: File;
      userId?: number;
      proId?: string;
    },
  >(
    data: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultFileUploadResponseDTOModel, any>(
      {
        path: `cirpoint-module-api/seriesParameter/importSeriesParameter`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      CommonResultFileUploadResponseDTOModel,
    );

  /**
   * 设计查核导入功能
   *
   * @tags 设计查核导入功能
   * @name auditImportData
   * @summary  设计查核导入功能
   * @request POST:/cirpoint-module-api/auditLibrary/import
   * @secure
   */
  static auditImportData = <
    Req extends {
      /** @format binary */
      file?: File;
      userId?: number;
      auditId?: string;
    } = {
      /** @format binary */
      file?: File;
      userId?: number;
      proId?: string;
    },
  >(
    data: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultFileUploadResponseDTOModel, any>(
      {
        path: `cirpoint-module-api/auditLibrary/import`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      CommonResultFileUploadResponseDTOModel,
    );

  /**
   * 参数字典导入功能
   *
   * @tags 参数字典导入功能
   * @name templateImportData
   * @summary  参数字典导入功能
   * @request POST:/system-service/tempalteinfo/import
   * @secure
   */
  static templateImportData = <
    Req extends {
      /** @format binary */
      file?: File;
      userid?: number;
      categoryid?: string;
    } = {
      /** @format binary */
      file?: File;
      userid?: number;
      categoryid?: string;
    },
  >(
    data: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultFileUploadResponseDTOModel, any>(
      {
        path: `system-service/tempalteinfo/import`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      CommonResultFileUploadResponseDTOModel,
    );

  /**
   * 流程设计文件上传
   *
   * @tags 流程设计文件上传
   * @name uploadFileToPDM
   * @summary  文件上传
   * @request POST:/file-storage/uploadFile
   * @secure
   */
  static uploadFileToPDM = <
    Req extends {
      /** @format binary */
      file?: File;
      userId?: number;
    } = {
      /** @format binary */
      file?: File;
      userId?: number;
    },
  >(
    data: Req,
    params: RequestParams = {},
  ) =>
    httpClient.request<CommonResultFileUploadResponseDTOModel, any>(
      {
        path: `cirpoint-module-api/ckProjectInfo/uploadFileToPDM`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      },
      CommonResultFileUploadResponseDTOModel,
    );
}
