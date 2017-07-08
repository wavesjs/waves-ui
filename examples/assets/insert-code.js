/**
 *  Extract the code in <script> tags with class example
 *  and insert it after the DOMElement whose id correspond to its `rel` attribute
 */
window.addEventListener('DOMContentLoaded', function() {

  var tags = document.querySelectorAll('.example');
  tags = Array.prototype.slice.call(tags, 0);

  tags.forEach(function(tag) {
    var relId = tag.getAttribute('rel');
    var rel = document.querySelector('#' + relId);
    // create code block
    var pre = document.createElement('pre');
    var code = document.createElement('code');

    code.textContent = tag.textContent.replace(/\n(\s)*$/, '');
    code.classList.add('language-javascript');

    pre.appendChild(code);
    rel.parentNode.insertBefore(pre, rel.nextSibling);
  });

  Prism.highlightAll();

});
