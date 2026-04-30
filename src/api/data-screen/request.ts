import service from '@/httpRequest';

const request = (config: any) => {
  // 1. 确保看板特有的 Header 始终存在
  config.headers = {
    ...config.headers,
    Cirpoint_2021: 'cirpoint',
  };

  // 2. 修正 baseURL。看板请求通常不带全局的 VITE_API_URL 前缀
  if (!config.baseURL) {
    config.baseURL = import.meta.env.VITE_BASE_URL;
  }

  // 3. 调用全局请求实例
  return service(config).then(res => {
    // 4. 全局 service 返回的是 AxiosResponse，解构出其中的 data
    // 看板原有的 request 拦截器会返回 response.data，这里保持一致
    return res.data;
  });
};

export default request;
