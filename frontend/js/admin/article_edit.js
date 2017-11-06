'use strict';

let category = document.getElementById('category'),
  title = document.getElementById('title'),
  short_descr = document.getElementById('short_descr'),
  author = document.getElementById('author'),
  keywords = document.getElementById('keywords'),
  description = document.getElementById('description'),
  body = document.getElementById('body'),
  btnSave = document.getElementById('btnSave');

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

function queryString (name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
};

function init() {
  btnSave.addEventListener('click', () => {
    let pars = {
      author: author.value,
      body: body.value,
      category: category.options[category.selectedIndex].value,
      description: description.value,
      id: queryString('id'),
      keywords: keywords.value,
      short_descr: short_descr.value,
      title: title.value,
    };
    ajaxRequest('/admin/library/article_update', pars);
  });
}

document.addEventListener('DOMContentLoaded', init);
