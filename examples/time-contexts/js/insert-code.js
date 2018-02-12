window.addEventListener('DOMContentLoaded', function() {
  window.fetch('./src/index.js')
    .then(response => response.text())
    .then(code => {
      var $pre = document.createElement('pre');
      var $code = document.createElement('code');

      $code.textContent = code;
      $code.classList.add('language-javascript');

      $pre.appendChild($code);
      document.body.appendChild($pre);

      Prism.highlightAll();
    });
});
