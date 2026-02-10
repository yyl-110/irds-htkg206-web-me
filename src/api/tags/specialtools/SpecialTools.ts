import {httpClient} from "@/api/tags/http-client";

export class SpecialToolsApi {
    /** `OpenApi` 中的 `tag` 名称, 作为默认的资源名称 */
    static $tagName: string = `专用工具相关封装`;

    static findToolManualTree = (
        query: any,
        params: any,
    ) =>
        httpClient.request(
            {
                path: `business-api/business/manual/findToolManualTree`, //?partNumber=1004085192
                method: "GET",
                query: query,
                secure: true,
                ...params,
            },
        );
}