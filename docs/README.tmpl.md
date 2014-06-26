# {%= name %}

> {%= description %}

{% if(type == 'docs') { %}

## Build

If gulp is not installed

```bash
$ npm install -g gulp-cli
```

Install all depencies in the module folder

```bash
$ npm install
```

Buil the lib

```bash
$ gulp
```

## Tests

After make build

Run the server on 9001 port (you can change the port in the gulpfile.js)

```bash
$ gulp --type=test
```

Run the test via the web browser on `http://localhost:9001/tests`

## Documentation

README.md generation

```bash
$ gulp --type=docs
```

Github Pages generation

```bash
$ gulp --type=gh-pages
```
{% } %}

## Script

{%= jsstart %}
alert('COOL');
{%= jsend %}

{% if (type == 'gh-pages') { %}

This is the DEMO

{% } %}


Sed ut perspiciatis unde omnis iste natus error sit voluptatem
accusantium doloremque laudantium, totam rem aperiam.