<?php
$base="/specs";
$md_file=@$_GET['md'];
if (empty($md_file)) {
    $md_file = 'list.md';
}
$md_file = './.md-cache/' . $md_file . '.html';
if (!file_exists($md_file)) {
    http_response_code(404);
    exit('404: Document file not found.');
} else { ?>
<!DOCTYPE html>
<html>
<head>
<title>specs</title>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="author" content="Allex Wang">
<link href="<?php echo $base;?>/assets/css/specs-base.css" rel="stylesheet" type="text/css" />
<link href="<?php echo $base;?>/assets/css/highlight/github.css" rel="stylesheet" type="text/css" />
</head>
<body>
<div class="md-body">
<?php echo file_get_contents($md_file); ?>
</div>
<script src="<?php echo $base;?>/assets/js/jquery-1.8.1.min.js"></script>
<script src="<?php echo $base;?>/assets/js/highlight/highlight.pack.js"></script>
<script>
jQuery(function($) {
    // sync document title
    var title = $('h1').html();
    if (title) { document.title = title; }
    // rebuild links to enable open in new window.
    var HOST_NAME = window.location.hostname;
    $(document.links).filter(function(i, a) { return a.hostname !== HOST_NAME; }).attr('target', '_blank');
    // highlight source code
    hljs.initHighlightingOnLoad();
});
</script> 
</body></html>
<?php } ?>
