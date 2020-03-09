import axios from 'axios';

const instance = axios.create({
  withCredentials: true, // 跨域请求时是否需要使用凭证
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err.response.status === 401) {
      const data = {
        code: -1,
        message: '暂无权限',
      };
      return Promise.reject(data);
    }
    return Promise.reject(err);
  },
);

async function MetroApi(config = {}) {
  const { method = 'post', url = '', data = {}, tipError = true } = config;
  const opt = { data, url, method };

  if (method.toLowerCase() === 'get') {
    opt.params = data;
  }
  try {
    const res = await instance.request(opt);
    return res.data;
  } catch (err) {
    tipError && alert('错误');
    throw err;
  }
}

export default MetroApi;
