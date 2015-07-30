# Notes for a gh-pages script

```sh
git checkout -b gh-pages
# remove all files except the one we needs
ls | grep -v 'examples' | grep -v 'README.md' | grep -v 'LICENSE' | xargs rm -Rf
# commit
git add -A
git commit -m 'updated gh-pages'

git push origin gh-pages
```