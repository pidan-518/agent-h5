import Taro from '@tarojs/taro';

// 携带token的请求
export function CarryTokenRequest(url, parmas) {
  return new Promise((resolve, rejece) => {
    Taro.request({
      url: url,
      method: "POST",
      credentials: "include",
      /* mode: "cors", */
      data: JSON.stringify(parmas),
      header: {
        'Content-Type': 'application/json',
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (res.data.code === 403) {
            Taro.showToast({
              title: '暂未登录',
              icon: 'none',
              duration: 1000,
              success: () => {
                Taro.removeStorageSync('userinfo');
                setTimeout(() => {
                  Taro.redirectTo({
                    url: '/page/login/login'
                  });
                }, 1000);
              }
            })
          } else {
            resolve(res);
          }
        } else {
          rejece(res);
        }
      },
      fail: (err) => {
        rejece(err);
        Taro.showToast({
          title: '网络连接失败',
          icon: 'none',
          duration: 1000,
        });
      }
    })
  })
};

// post请求
export function postRequest(url, parmas) {
  return new Promise((resolve, rejece) => {
    Taro.request({
      url: url,
      method: "POST",
      credentials: "include",
      mode: "cors",
      data: JSON.stringify(parmas),
      header: {
        'Content-Type': 'application/json',
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res);
        } else {
          rejece(res);
        }
      }
    })
  })
}