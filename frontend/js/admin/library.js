'use strict';

function ajaxRequest(path, data, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', path);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
  xhr.send(JSON.stringify(data));
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200 && callback instanceof Function) {
      return callback(JSON.parse(xhr.responseText));
    }
    return true;
  };
}

function init() {
  let filterTimerId = 0;

  function f(answer) {
    let divSearchResults = document.getElementById('divSearchResults');
    // отрисовка списка статей
    divSearchResults.innerHTML = '';
    for(let i = 0; i < answer.data.length; i++) {
      divSearchResults.innerHTML += `<a href="/admin/library/article_edit?id=${answer.data[i].id}" target="_blank">${answer.data[i].title}</a><br/>`;
    }
  }

  /* eslint-disable no-invalid-this */
  document.getElementById('inpSearch').addEventListener('keyup', function() {
    if(!this.value) {
      return;
    }
    clearTimeout(filterTimerId);
    filterTimerId = setTimeout(() => {
      if(this.value.length > 1) {
        let pars = {
          s: this.value
        };
        ajaxRequest('/admin/library/search', pars, f);
      }
    }, 300);
  });
  /* eslint-enable no-invalid-this */
}

document.addEventListener('DOMContentLoaded', init);
