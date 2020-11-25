const RApi = {
  dev: 'https://b3589481400.rapi.dev5',
  stage: 'https://rapi.stage.ruten.com.tw',
  formal: 'https://rapi.ruten.com.tw'
}

const MemberApi = {
  dev: 'https://b3589481400.member.dev2.ruten.com.tw',
  stage: 'https://member.stage.ruten.com.tw',
  formal: 'https://member.ruten.com.tw'
}

const saveAward = function({rid, type}) {
  // return fetch(`https://b3589481400.rapi.dev5.ruten.com.tw/api/coin/v1/deposit/`, {
  //   method: 'POST',
  //   credentials: 'include',
  //   body: JSON.stringify({
  //     'ctrl_rowid': rid,
  //     'ref_event': type,
  //   }), // data can be `string` or {object}!
  //   headers: new Headers({
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   })
  // })
  //   .then(_formatStatusCode)
  //   .then(_formatJsend)
  const defaultError = {
    status: 'fail',
    data: {
      code: 999
    }
  }
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${RApi.formal}/api/coin/v1/deposit`,
      dataType: 'json',
      type: 'POST',
      data: {
        'ctrl_rowid': rid,
        'ref_event': type
      },
      xhrFields: {
        withCredentials: true
      },
      success(res) {
        if(res && res.status === 'success') {
          resolve(res)
        } else {
          reject(defaultError)
        }
      },
      error(res) {
        try {
          res = JSON.parse(res.responseText)
          if(res.status === 'fail') {
            reject(res)
          } else {
            reject(defaultError)
          }
        } catch (error) {
          reject(defaultError)
        }
      }
    })
  })
}

const checkPermission = function (userNick, type) {
  return fetch(`${RApi.formal}/api/users/v1/${userNick}/coin/permission?ref_event=${type}`, {
    method: 'GET',
    credentials: 'include',
  })
    .then(_formatStatusCode)
    .then(_formatJsend)
}

const checkLogin = function () {
  return fetch(`${MemberApi.formal}/user/ajax_header_slice.php`, {
    method: 'POST',
    credentials: 'include',
  })
    .catch(error => {
      alert('請先登入會員')
      window.location = `${MemberApi.formal}/user/login.htm?refer=`+window.encodeURIComponent(window.location.href)
    })
    .then(_formatStatusCode)
    .then(res => {
      if(!res) {
        alert('請先登入會員')
        window.location = `${MemberApi.formal}/user/login.htm?refer=`+window.encodeURIComponent(window.location.href)
      }
      if(res && res.user_nick) return {userNick: res.user_nick}
    })
}

function _formatStatusCode(response) {
  if (response.status === 200 || response.status === 0) {
    return Promise.resolve(response.json())
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function _formatJsend(response) {
  if(response.status === 'success') {
    return Promise.resolve(response.data)
  } else {
    return Promise.reject(response.data)
  }
}

export {
  saveAward,
  checkPermission,
  checkLogin
}