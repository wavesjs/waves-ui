<!doctype html>
<html class="no-js" lang="en-us">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{%= name %}</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto+Slab:400,700|Lato:400,700,400italic,700italic" rel="stylesheet" type="text/css">
    <script src="js/highlight.pack.js"></script>
    <link rel="stylesheet" href="css/main.css">
  </head>
  <body>

  <header>
    <nav>
      <ul>
        <li><a class="icon-github" href="{%= repo %}">Source on GitHub</a></li>
        <li class="updated"><em>Last updated: {%= updated %}</em></li>
      </ul>
    </nav>
  </header>
  
  <hr>

  <section>
    {%= html("_head.md") %}
    {%= html("_demo-ghp.md") %}
    {%= html("_api.md") %}
  </section>

  <hr>

  <footer>
    {%= html("_credits.md") %}
  </footer>
  <script>hljs.initHighlightingOnLoad();</script>
  </body>
</html>