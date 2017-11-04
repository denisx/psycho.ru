'use strict';

function init() {
  let
    ansError = document.getElementById('ansError'),
    ansEmail = document.getElementById('ansEmail'),
    divError = document.getElementById('divError'),
    inpLogin = document.getElementById('inpLogin'),
    inpPassword = document.getElementById('inpPassword'),
    btnLogin = document.getElementById('btnLogin');

  inpLogin.focus();
  if(ansError.value) {
    divError.classList.remove('hidden');
    inpLogin.value = ansEmail.value;
  }
}

document.addEventListener('DOMContentLoaded', init);
