window.addEventListener('DOMContentLoaded', function() {
  const $examples = Array.from(document.querySelectorAll('.example'));

  const promises = $examples.map($example => {
    const rel = $example.getAttribute('rel');
    const jsFile = `./src/${rel}.js`;

    return window.fetch(jsFile)
      .then(response => response.text())
      .then(code => {
        var $pre = document.createElement('pre');
        var $code = document.createElement('code');

        $code.textContent = code;
        $code.classList.add('language-javascript');

        $pre.appendChild($code);
        $example.after($pre);

        return Promise.resolve();
      });
  });

  Promise.all(promises).then(() => Prism.highlightAll());
});
