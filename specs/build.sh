#!/bin/sh

if [ -f /etc/profile ]; then
    . /etc/profile
fi

dir=`cd $(dirname $0); pwd -P`
cache="$dir/.md-cache"

cd $dir;

git pull >>$dir/.deploy.log 2>&1

ls=`find ./ -name "*.md" -type f|grep -v assets`
for f in $ls; do
  o="$cache/$f.html"
  d=`dirname $o`
  echo "build $f"
  [ -d $d ] || mkdir -p $d;
  marked --gfm $f >$o
  sed -i"" -e "s/ id=\"-\">/>/g;s/ id=\"-*\(.*\)\">/ id=\"\1\">/g;s/ id=\"\(.*\)-\">/ id=\"\1\">/g" $o
done
cd - >/dev/null 2>&1

echo "-==DONE!==-"

# vim: set fdm=manual ts=2 sw=2 sts=2 tw=85 et :
