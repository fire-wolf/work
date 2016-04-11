<?php
$path=@$_GET["path"];
if (!$path) {
    header("Content-Type: text/plain; charset=utf-8");
    http_response_code(404);
    exit("404: Invalid Request");
}
?><!DOCTYPE html>
<html>
<head>
<title>Markdown slide viewer</title>
<meta charset="utf-8">
<meta name="author" content="Allex Wang">
<style>
@import url(//fonts.useso.com/css?family=Yanone+Kaffeesatz);@import url(//fonts.useso.com/css?family=Ubuntu+Mono:400,700,400italic);h1,h2,h3{font-family:'Yanone Kaffeesatz';font-weight:400;margin-bottom:0}.remark-slide-content h1{font-size:3em}.remark-slide-content h2{font-size:2em;color:#666}.remark-slide-content h3{font-size:1.6em}.remark-slide-content blockquote{color:#999;font-style:italic}.footnote{position:absolute;bottom:3em}li p{line-height:1.25em}.red{color:#fa0000}.large{font-size:2em}a,a>code{color:#f92672;text-decoration:none}code{background:#e7e8e2;border-radius:5px}.remark-code,.remark-inline-code{font-family:'Ubuntu Mono'}.remark-code-line-highlighted{background-color:#373832}.pull-left{float:left;width:47%}.pull-right{float:right;width:47%}.pull-right ~ p{clear:both}.inverse{background:#272822;color:#777872;text-shadow:0 0 20px #333}.inverse h1,.inverse h2{color:#f3f3f3;line-height:.8em}#slideshow .slide .content code{font-size:.8em}#slideshow .slide .content pre code{font-size:.9em;padding:15px}#slide-inverse .footnote{bottom:12px;left:20px}#slide-how .slides{font-size:.9em;position:absolute;top:151px;right:140px}#slide-how .slides h3{margin-top:.2em}#slide-how .slides .first,#slide-how .slides .second{padding:1px 20px;height:90px;width:120px;-moz-box-shadow:0 0 10px #777;-webkit-box-shadow:0 0 10px #777;box-shadow:0 0 10px #777}#slide-how .slides .first{background:#fff;position:absolute;top:20%;left:20%;z-index:1}#slide-how .slides .second{position:relative;background:#fff;z-index:0}.left-column{color:#777;width:20%;height:92%;float:left}.left-column h2:last-of-type,.left-column h3:last-child{color:#000}.right-column{width:75%;float:right;padding-top:1em}.remark-code{line-height:1.3em}
</style>
</head>
<body>
<script src="./remark/remark-latest.min.js"></script>
<script>
var hljs = remark.highlighter.engine;
</script>
<script src="./remark/remark.language.js"></script>
<script>
remark.create({highlightStyle:'monokai',highlightLanguage:'remark',sourceUrl:'./r?&mimeType=md&path=<?php echo $path;?>'});
</script>
</body></html>
<!-- vim: set ft=html ff=unix et sw=4 ts=4 sts=4 tw=150: -->
