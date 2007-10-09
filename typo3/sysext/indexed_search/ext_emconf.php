<?php

########################################################################
# Extension Manager/Repository config file for ext: "indexed_search"
#
# Auto generated 11-09-2006 08:36
#
# Manual updates:
# Only the data in the array - anything else is removed by next write.
# "version" and "dependencies" must not be touched!
########################################################################

$EM_CONF[$_EXTKEY] = array(
	'title' => 'Indexed Search Engine',
	'description' => 'Indexed Search Engine for TYPO3 pages, PDF-files, Word-files, HTML and text files. Provides a backend module for statistics of the indexer and a frontend plugin. Documentation can be found in doc_indexed_search.',
	'category' => 'plugin',
	'shy' => 0,
	'dependencies' => 'cms',
	'conflicts' => '',
	'priority' => '',
	'loadOrder' => '',
	'module' => 'mod,cli',
	'state' => 'stable',
	'internal' => 1,
	'uploadfolder' => 0,
	'createDirs' => '',
	'modify_tables' => '',
	'clearCacheOnLoad' => 1,
	'lockType' => '',
	'author' => 'Kasper Sk�rh�j',
	'author_email' => 'kasperYYYY@typo3.com',
	'author_company' => 'Curby Soft Multimedia',
	'CGLcompliance' => '',
	'CGLcompliance_note' => '',
	'version' => '2.10.0',
	'_md5_values_when_last_written' => 'a:314:{s:9:"ChangeLog";s:4:"3b27";s:17:"class.crawler.php";s:4:"4438";s:25:"class.doublemetaphone.php";s:4:"8d81";s:25:"class.external_parser.php";s:4:"1554";s:17:"class.indexer.php";s:4:"e7a5";s:15:"class.lexer.php";s:4:"ae6b";s:21:"ext_conf_template.txt";s:4:"5221";s:12:"ext_icon.gif";s:4:"4cbf";s:17:"ext_localconf.php";s:4:"b103";s:14:"ext_tables.php";s:4:"9bda";s:14:"ext_tables.sql";s:4:"5f5c";s:28:"ext_typoscript_editorcfg.txt";s:4:"0a34";s:24:"ext_typoscript_setup.txt";s:4:"b271";s:13:"locallang.xml";s:4:"0a76";s:26:"locallang_csh_indexcfg.xml";s:4:"f4f3";s:16:"locallang_db.xml";s:4:"2c55";s:7:"tca.php";s:4:"8991";s:15:".svn/README.txt";s:4:"cf1a";s:16:".svn/dir-wcprops";s:4:"2818";s:15:".svn/empty-file";s:4:"d41d";s:12:".svn/entries";s:4:"dbbe";s:11:".svn/format";s:4:"48a2";s:33:".svn/text-base/ChangeLog.svn-base";s:4:"3b27";s:41:".svn/text-base/class.crawler.php.svn-base";s:4:"4438";s:49:".svn/text-base/class.doublemetaphone.php.svn-base";s:4:"8d81";s:49:".svn/text-base/class.external_parser.php.svn-base";s:4:"1554";s:41:".svn/text-base/class.indexer.php.svn-base";s:4:"e7a5";s:39:".svn/text-base/class.lexer.php.svn-base";s:4:"ae6b";s:45:".svn/text-base/ext_conf_template.txt.svn-base";s:4:"5221";s:38:".svn/text-base/ext_emconf.php.svn-base";s:4:"3816";s:36:".svn/text-base/ext_icon.gif.svn-base";s:4:"4cbf";s:41:".svn/text-base/ext_localconf.php.svn-base";s:4:"b103";s:38:".svn/text-base/ext_tables.php.svn-base";s:4:"9bda";s:38:".svn/text-base/ext_tables.sql.svn-base";s:4:"5f5c";s:52:".svn/text-base/ext_typoscript_editorcfg.txt.svn-base";s:4:"0a34";s:48:".svn/text-base/ext_typoscript_setup.txt.svn-base";s:4:"b271";s:37:".svn/text-base/locallang.xml.svn-base";s:4:"0a76";s:50:".svn/text-base/locallang_csh_indexcfg.xml.svn-base";s:4:"f4f3";s:40:".svn/text-base/locallang_db.xml.svn-base";s:4:"2c55";s:31:".svn/text-base/tca.php.svn-base";s:4:"8991";s:33:".svn/prop-base/ChangeLog.svn-base";s:4:"3c71";s:41:".svn/prop-base/class.crawler.php.svn-base";s:4:"3c71";s:49:".svn/prop-base/class.doublemetaphone.php.svn-base";s:4:"3c71";s:49:".svn/prop-base/class.external_parser.php.svn-base";s:4:"3c71";s:41:".svn/prop-base/class.indexer.php.svn-base";s:4:"3c71";s:39:".svn/prop-base/class.lexer.php.svn-base";s:4:"3c71";s:45:".svn/prop-base/ext_conf_template.txt.svn-base";s:4:"3c71";s:38:".svn/prop-base/ext_emconf.php.svn-base";s:4:"3c71";s:36:".svn/prop-base/ext_icon.gif.svn-base";s:4:"c5ac";s:41:".svn/prop-base/ext_localconf.php.svn-base";s:4:"3c71";s:38:".svn/prop-base/ext_tables.php.svn-base";s:4:"3c71";s:38:".svn/prop-base/ext_tables.sql.svn-base";s:4:"a362";s:52:".svn/prop-base/ext_typoscript_editorcfg.txt.svn-base";s:4:"3c71";s:48:".svn/prop-base/ext_typoscript_setup.txt.svn-base";s:4:"3c71";s:37:".svn/prop-base/locallang.xml.svn-base";s:4:"3c71";s:50:".svn/prop-base/locallang_csh_indexcfg.xml.svn-base";s:4:"3c71";s:40:".svn/prop-base/locallang_db.xml.svn-base";s:4:"3c71";s:31:".svn/prop-base/tca.php.svn-base";s:4:"685f";s:29:".svn/props/ChangeLog.svn-work";s:4:"3c71";s:37:".svn/props/class.crawler.php.svn-work";s:4:"3c71";s:45:".svn/props/class.doublemetaphone.php.svn-work";s:4:"3c71";s:45:".svn/props/class.external_parser.php.svn-work";s:4:"3c71";s:37:".svn/props/class.indexer.php.svn-work";s:4:"3c71";s:35:".svn/props/class.lexer.php.svn-work";s:4:"3c71";s:41:".svn/props/ext_conf_template.txt.svn-work";s:4:"3c71";s:34:".svn/props/ext_emconf.php.svn-work";s:4:"3c71";s:32:".svn/props/ext_icon.gif.svn-work";s:4:"c5ac";s:37:".svn/props/ext_localconf.php.svn-work";s:4:"3c71";s:34:".svn/props/ext_tables.php.svn-work";s:4:"3c71";s:34:".svn/props/ext_tables.sql.svn-work";s:4:"a362";s:48:".svn/props/ext_typoscript_editorcfg.txt.svn-work";s:4:"3c71";s:44:".svn/props/ext_typoscript_setup.txt.svn-work";s:4:"3c71";s:33:".svn/props/locallang.xml.svn-work";s:4:"3c71";s:46:".svn/props/locallang_csh_indexcfg.xml.svn-work";s:4:"3c71";s:36:".svn/props/locallang_db.xml.svn-work";s:4:"3c71";s:27:".svn/props/tca.php.svn-work";s:4:"685f";s:31:".svn/wcprops/ChangeLog.svn-work";s:4:"29f5";s:39:".svn/wcprops/class.crawler.php.svn-work";s:4:"5b73";s:47:".svn/wcprops/class.doublemetaphone.php.svn-work";s:4:"6380";s:47:".svn/wcprops/class.external_parser.php.svn-work";s:4:"34ea";s:39:".svn/wcprops/class.indexer.php.svn-work";s:4:"749a";s:37:".svn/wcprops/class.lexer.php.svn-work";s:4:"9805";s:43:".svn/wcprops/ext_conf_template.txt.svn-work";s:4:"79af";s:36:".svn/wcprops/ext_emconf.php.svn-work";s:4:"280d";s:34:".svn/wcprops/ext_icon.gif.svn-work";s:4:"2d29";s:39:".svn/wcprops/ext_localconf.php.svn-work";s:4:"588c";s:36:".svn/wcprops/ext_tables.php.svn-work";s:4:"e1f9";s:36:".svn/wcprops/ext_tables.sql.svn-work";s:4:"2b93";s:50:".svn/wcprops/ext_typoscript_editorcfg.txt.svn-work";s:4:"c1ba";s:46:".svn/wcprops/ext_typoscript_setup.txt.svn-work";s:4:"e478";s:35:".svn/wcprops/locallang.xml.svn-work";s:4:"ff00";s:48:".svn/wcprops/locallang_csh_indexcfg.xml.svn-work";s:4:"6f9e";s:38:".svn/wcprops/locallang_db.xml.svn-work";s:4:"d1e5";s:29:".svn/wcprops/tca.php.svn-work";s:4:"a484";s:13:"mod/clear.gif";s:4:"cc11";s:12:"mod/conf.php";s:4:"6ea2";s:13:"mod/index.php";s:4:"a59f";s:15:"mod/isearch.gif";s:4:"4cbf";s:21:"mod/locallang_mod.xml";s:4:"1624";s:19:"mod/.svn/README.txt";s:4:"cf1a";s:20:"mod/.svn/dir-wcprops";s:4:"50c7";s:19:"mod/.svn/empty-file";s:4:"d41d";s:16:"mod/.svn/entries";s:4:"80a4";s:15:"mod/.svn/format";s:4:"48a2";s:37:"mod/.svn/text-base/clear.gif.svn-base";s:4:"cc11";s:36:"mod/.svn/text-base/conf.php.svn-base";s:4:"9062";s:37:"mod/.svn/text-base/index.php.svn-base";s:4:"a59f";s:39:"mod/.svn/text-base/isearch.gif.svn-base";s:4:"4cbf";s:45:"mod/.svn/text-base/locallang_mod.xml.svn-base";s:4:"1624";s:37:"mod/.svn/prop-base/clear.gif.svn-base";s:4:"c5ac";s:36:"mod/.svn/prop-base/conf.php.svn-base";s:4:"3c71";s:37:"mod/.svn/prop-base/index.php.svn-base";s:4:"3c71";s:39:"mod/.svn/prop-base/isearch.gif.svn-base";s:4:"c5ac";s:45:"mod/.svn/prop-base/locallang_mod.xml.svn-base";s:4:"3c71";s:33:"mod/.svn/props/clear.gif.svn-work";s:4:"c5ac";s:32:"mod/.svn/props/conf.php.svn-work";s:4:"3c71";s:33:"mod/.svn/props/index.php.svn-work";s:4:"3c71";s:35:"mod/.svn/props/isearch.gif.svn-work";s:4:"c5ac";s:41:"mod/.svn/props/locallang_mod.xml.svn-work";s:4:"3c71";s:35:"mod/.svn/wcprops/clear.gif.svn-work";s:4:"2d29";s:34:"mod/.svn/wcprops/conf.php.svn-work";s:4:"2d29";s:35:"mod/.svn/wcprops/index.php.svn-work";s:4:"506c";s:37:"mod/.svn/wcprops/isearch.gif.svn-work";s:4:"2d29";s:43:"mod/.svn/wcprops/locallang_mod.xml.svn-work";s:4:"9b25";s:29:"example/class.crawlerhook.php";s:4:"8246";s:24:"example/class.pihook.php";s:4:"dff9";s:23:"example/.svn/README.txt";s:4:"cf1a";s:24:"example/.svn/dir-wcprops";s:4:"1a19";s:23:"example/.svn/empty-file";s:4:"d41d";s:20:"example/.svn/entries";s:4:"974c";s:19:"example/.svn/format";s:4:"48a2";s:53:"example/.svn/text-base/class.crawlerhook.php.svn-base";s:4:"89dc";s:48:"example/.svn/text-base/class.pihook.php.svn-base";s:4:"b70f";s:53:"example/.svn/prop-base/class.crawlerhook.php.svn-base";s:4:"3c71";s:48:"example/.svn/prop-base/class.pihook.php.svn-base";s:4:"3c71";s:49:"example/.svn/props/class.crawlerhook.php.svn-work";s:4:"3c71";s:44:"example/.svn/props/class.pihook.php.svn-work";s:4:"3c71";s:51:"example/.svn/wcprops/class.crawlerhook.php.svn-work";s:4:"8332";s:46:"example/.svn/wcprops/class.pihook.php.svn-work";s:4:"0c64";s:12:"doc/TODO.txt";s:4:"f6c3";s:19:"doc/.svn/README.txt";s:4:"cf1a";s:20:"doc/.svn/dir-wcprops";s:4:"2d10";s:19:"doc/.svn/empty-file";s:4:"d41d";s:16:"doc/.svn/entries";s:4:"aa09";s:15:"doc/.svn/format";s:4:"48a2";s:36:"doc/.svn/text-base/TODO.txt.svn-base";s:4:"f6c3";s:36:"doc/.svn/prop-base/TODO.txt.svn-base";s:4:"3c71";s:32:"doc/.svn/props/TODO.txt.svn-work";s:4:"3c71";s:34:"doc/.svn/wcprops/TODO.txt.svn-work";s:4:"0d50";s:12:"cli/conf.php";s:4:"3c1d";s:21:"cli/indexer_cli.phpsh";s:4:"d236";s:19:"cli/.svn/README.txt";s:4:"cf1a";s:20:"cli/.svn/dir-wcprops";s:4:"2d29";s:19:"cli/.svn/empty-file";s:4:"d41d";s:16:"cli/.svn/entries";s:4:"a641";s:15:"cli/.svn/format";s:4:"48a2";s:36:"cli/.svn/text-base/conf.php.svn-base";s:4:"bbcd";s:45:"cli/.svn/text-base/indexer_cli.phpsh.svn-base";s:4:"d236";s:36:"cli/.svn/prop-base/conf.php.svn-base";s:4:"685f";s:45:"cli/.svn/prop-base/indexer_cli.phpsh.svn-base";s:4:"3c71";s:32:"cli/.svn/props/conf.php.svn-work";s:4:"685f";s:41:"cli/.svn/props/indexer_cli.phpsh.svn-work";s:4:"3c71";s:34:"cli/.svn/wcprops/conf.php.svn-work";s:4:"2d29";s:43:"cli/.svn/wcprops/indexer_cli.phpsh.svn-work";s:4:"2d29";s:29:"pi/class.tx_indexedsearch.php";s:4:"33bc";s:21:"pi/considerations.txt";s:4:"e3df";s:22:"pi/indexed_search.tmpl";s:4:"d788";s:16:"pi/locallang.xml";s:4:"f62f";s:20:"pi/template_css.tmpl";s:4:"c1b0";s:18:"pi/.svn/README.txt";s:4:"cf1a";s:19:"pi/.svn/dir-wcprops";s:4:"94d3";s:18:"pi/.svn/empty-file";s:4:"d41d";s:15:"pi/.svn/entries";s:4:"7669";s:14:"pi/.svn/format";s:4:"48a2";s:53:"pi/.svn/text-base/class.tx_indexedsearch.php.svn-base";s:4:"9a9f";s:45:"pi/.svn/text-base/considerations.txt.svn-base";s:4:"e3df";s:46:"pi/.svn/text-base/indexed_search.tmpl.svn-base";s:4:"d788";s:40:"pi/.svn/text-base/locallang.xml.svn-base";s:4:"f62f";s:44:"pi/.svn/text-base/template_css.tmpl.svn-base";s:4:"c1b0";s:53:"pi/.svn/prop-base/class.tx_indexedsearch.php.svn-base";s:4:"3c71";s:45:"pi/.svn/prop-base/considerations.txt.svn-base";s:4:"3c71";s:46:"pi/.svn/prop-base/indexed_search.tmpl.svn-base";s:4:"685f";s:40:"pi/.svn/prop-base/locallang.xml.svn-base";s:4:"3c71";s:44:"pi/.svn/prop-base/template_css.tmpl.svn-base";s:4:"685f";s:49:"pi/.svn/props/class.tx_indexedsearch.php.svn-work";s:4:"3c71";s:41:"pi/.svn/props/considerations.txt.svn-work";s:4:"3c71";s:42:"pi/.svn/props/indexed_search.tmpl.svn-work";s:4:"685f";s:36:"pi/.svn/props/locallang.xml.svn-work";s:4:"3c71";s:40:"pi/.svn/props/template_css.tmpl.svn-work";s:4:"685f";s:51:"pi/.svn/wcprops/class.tx_indexedsearch.php.svn-work";s:4:"8c0c";s:43:"pi/.svn/wcprops/considerations.txt.svn-work";s:4:"2d29";s:44:"pi/.svn/wcprops/indexed_search.tmpl.svn-work";s:4:"52c0";s:38:"pi/.svn/wcprops/locallang.xml.svn-work";s:4:"3ad0";s:42:"pi/.svn/wcprops/template_css.tmpl.svn-work";s:4:"ff5d";s:14:"pi/res/csv.gif";s:4:"e413";s:14:"pi/res/doc.gif";s:4:"0975";s:15:"pi/res/html.gif";s:4:"5647";s:14:"pi/res/jpg.gif";s:4:"23ac";s:17:"pi/res/locked.gif";s:4:"c212";s:16:"pi/res/pages.gif";s:4:"1923";s:14:"pi/res/pdf.gif";s:4:"9451";s:14:"pi/res/pps.gif";s:4:"926b";s:14:"pi/res/ppt.gif";s:4:"ada5";s:14:"pi/res/rtf.gif";s:4:"f660";s:14:"pi/res/sxc.gif";s:4:"00a6";s:14:"pi/res/sxi.gif";s:4:"ef83";s:14:"pi/res/sxw.gif";s:4:"4a8f";s:14:"pi/res/tif.gif";s:4:"533b";s:14:"pi/res/txt.gif";s:4:"c576";s:14:"pi/res/xls.gif";s:4:"4a22";s:14:"pi/res/xml.gif";s:4:"2e7b";s:22:"pi/res/.svn/README.txt";s:4:"cf1a";s:23:"pi/res/.svn/dir-wcprops";s:4:"2d29";s:22:"pi/res/.svn/empty-file";s:4:"d41d";s:19:"pi/res/.svn/entries";s:4:"c35a";s:18:"pi/res/.svn/format";s:4:"48a2";s:38:"pi/res/.svn/text-base/csv.gif.svn-base";s:4:"e413";s:38:"pi/res/.svn/text-base/doc.gif.svn-base";s:4:"0975";s:39:"pi/res/.svn/text-base/html.gif.svn-base";s:4:"5647";s:38:"pi/res/.svn/text-base/jpg.gif.svn-base";s:4:"23ac";s:41:"pi/res/.svn/text-base/locked.gif.svn-base";s:4:"c212";s:40:"pi/res/.svn/text-base/pages.gif.svn-base";s:4:"1923";s:38:"pi/res/.svn/text-base/pdf.gif.svn-base";s:4:"9451";s:38:"pi/res/.svn/text-base/pps.gif.svn-base";s:4:"926b";s:38:"pi/res/.svn/text-base/ppt.gif.svn-base";s:4:"ada5";s:38:"pi/res/.svn/text-base/rtf.gif.svn-base";s:4:"f660";s:38:"pi/res/.svn/text-base/sxc.gif.svn-base";s:4:"00a6";s:38:"pi/res/.svn/text-base/sxi.gif.svn-base";s:4:"ef83";s:38:"pi/res/.svn/text-base/sxw.gif.svn-base";s:4:"4a8f";s:38:"pi/res/.svn/text-base/tif.gif.svn-base";s:4:"533b";s:38:"pi/res/.svn/text-base/txt.gif.svn-base";s:4:"c576";s:38:"pi/res/.svn/text-base/xls.gif.svn-base";s:4:"4a22";s:38:"pi/res/.svn/text-base/xml.gif.svn-base";s:4:"2e7b";s:38:"pi/res/.svn/prop-base/csv.gif.svn-base";s:4:"c5ac";s:38:"pi/res/.svn/prop-base/doc.gif.svn-base";s:4:"c5ac";s:39:"pi/res/.svn/prop-base/html.gif.svn-base";s:4:"c5ac";s:38:"pi/res/.svn/prop-base/jpg.gif.svn-base";s:4:"c5ac";s:41:"pi/res/.svn/prop-base/locked.gif.svn-base";s:4:"c5ac";s:40:"pi/res/.svn/prop-base/pages.gif.svn-base";s:4:"c5ac";s:38:"pi/res/.svn/prop-base/pdf.gif.svn-base";s:4:"c5ac";s:38:"pi/res/.svn/prop-base/pps.gif.svn-base";s:4:"1131";s:38:"pi/res/.svn/prop-base/ppt.gif.svn-base";s:4:"1131";s:38:"pi/res/.svn/prop-base/rtf.gif.svn-base";s:4:"c5ac";s:38:"pi/res/.svn/prop-base/sxc.gif.svn-base";s:4:"1131";s:38:"pi/res/.svn/prop-base/sxi.gif.svn-base";s:4:"1131";s:38:"pi/res/.svn/prop-base/sxw.gif.svn-base";s:4:"1131";s:38:"pi/res/.svn/prop-base/tif.gif.svn-base";s:4:"c5ac";s:38:"pi/res/.svn/prop-base/txt.gif.svn-base";s:4:"c5ac";s:38:"pi/res/.svn/prop-base/xls.gif.svn-base";s:4:"1131";s:38:"pi/res/.svn/prop-base/xml.gif.svn-base";s:4:"c5ac";s:34:"pi/res/.svn/props/csv.gif.svn-work";s:4:"c5ac";s:34:"pi/res/.svn/props/doc.gif.svn-work";s:4:"c5ac";s:35:"pi/res/.svn/props/html.gif.svn-work";s:4:"c5ac";s:34:"pi/res/.svn/props/jpg.gif.svn-work";s:4:"c5ac";s:37:"pi/res/.svn/props/locked.gif.svn-work";s:4:"c5ac";s:36:"pi/res/.svn/props/pages.gif.svn-work";s:4:"c5ac";s:34:"pi/res/.svn/props/pdf.gif.svn-work";s:4:"c5ac";s:34:"pi/res/.svn/props/pps.gif.svn-work";s:4:"1131";s:34:"pi/res/.svn/props/ppt.gif.svn-work";s:4:"1131";s:34:"pi/res/.svn/props/rtf.gif.svn-work";s:4:"c5ac";s:34:"pi/res/.svn/props/sxc.gif.svn-work";s:4:"1131";s:34:"pi/res/.svn/props/sxi.gif.svn-work";s:4:"1131";s:34:"pi/res/.svn/props/sxw.gif.svn-work";s:4:"1131";s:34:"pi/res/.svn/props/tif.gif.svn-work";s:4:"c5ac";s:34:"pi/res/.svn/props/txt.gif.svn-work";s:4:"c5ac";s:34:"pi/res/.svn/props/xls.gif.svn-work";s:4:"1131";s:34:"pi/res/.svn/props/xml.gif.svn-work";s:4:"c5ac";s:36:"pi/res/.svn/wcprops/csv.gif.svn-work";s:4:"2d29";s:36:"pi/res/.svn/wcprops/doc.gif.svn-work";s:4:"2d29";s:37:"pi/res/.svn/wcprops/html.gif.svn-work";s:4:"2d29";s:36:"pi/res/.svn/wcprops/jpg.gif.svn-work";s:4:"2d29";s:39:"pi/res/.svn/wcprops/locked.gif.svn-work";s:4:"2d29";s:38:"pi/res/.svn/wcprops/pages.gif.svn-work";s:4:"2d29";s:36:"pi/res/.svn/wcprops/pdf.gif.svn-work";s:4:"2d29";s:36:"pi/res/.svn/wcprops/pps.gif.svn-work";s:4:"2d29";s:36:"pi/res/.svn/wcprops/ppt.gif.svn-work";s:4:"2d29";s:36:"pi/res/.svn/wcprops/rtf.gif.svn-work";s:4:"2d29";s:36:"pi/res/.svn/wcprops/sxc.gif.svn-work";s:4:"2d29";s:36:"pi/res/.svn/wcprops/sxi.gif.svn-work";s:4:"2d29";s:36:"pi/res/.svn/wcprops/sxw.gif.svn-work";s:4:"2d29";s:36:"pi/res/.svn/wcprops/tif.gif.svn-work";s:4:"2d29";s:36:"pi/res/.svn/wcprops/txt.gif.svn-work";s:4:"2d29";s:36:"pi/res/.svn/wcprops/xls.gif.svn-work";s:4:"2d29";s:36:"pi/res/.svn/wcprops/xml.gif.svn-work";s:4:"2d29";s:44:"modfunc1/class.tx_indexedsearch_modfunc1.php";s:4:"eb02";s:22:"modfunc1/locallang.xml";s:4:"4806";s:24:"modfunc1/.svn/README.txt";s:4:"cf1a";s:25:"modfunc1/.svn/dir-wcprops";s:4:"0cad";s:24:"modfunc1/.svn/empty-file";s:4:"d41d";s:21:"modfunc1/.svn/entries";s:4:"cdd8";s:20:"modfunc1/.svn/format";s:4:"48a2";s:68:"modfunc1/.svn/text-base/class.tx_indexedsearch_modfunc1.php.svn-base";s:4:"eb02";s:46:"modfunc1/.svn/text-base/locallang.xml.svn-base";s:4:"4806";s:68:"modfunc1/.svn/prop-base/class.tx_indexedsearch_modfunc1.php.svn-base";s:4:"3c71";s:46:"modfunc1/.svn/prop-base/locallang.xml.svn-base";s:4:"3c71";s:64:"modfunc1/.svn/props/class.tx_indexedsearch_modfunc1.php.svn-work";s:4:"3c71";s:42:"modfunc1/.svn/props/locallang.xml.svn-work";s:4:"3c71";s:66:"modfunc1/.svn/wcprops/class.tx_indexedsearch_modfunc1.php.svn-work";s:4:"221e";s:44:"modfunc1/.svn/wcprops/locallang.xml.svn-work";s:4:"d3aa";s:44:"modfunc2/class.tx_indexedsearch_modfunc2.php";s:4:"4b4e";s:22:"modfunc2/locallang.xml";s:4:"a889";s:24:"modfunc2/.svn/README.txt";s:4:"cf1a";s:25:"modfunc2/.svn/dir-wcprops";s:4:"85a5";s:24:"modfunc2/.svn/empty-file";s:4:"d41d";s:21:"modfunc2/.svn/entries";s:4:"eb65";s:20:"modfunc2/.svn/format";s:4:"48a2";s:68:"modfunc2/.svn/text-base/class.tx_indexedsearch_modfunc2.php.svn-base";s:4:"4b4e";s:46:"modfunc2/.svn/text-base/locallang.xml.svn-base";s:4:"a889";s:68:"modfunc2/.svn/prop-base/class.tx_indexedsearch_modfunc2.php.svn-base";s:4:"685f";s:46:"modfunc2/.svn/prop-base/locallang.xml.svn-base";s:4:"685f";s:64:"modfunc2/.svn/props/class.tx_indexedsearch_modfunc2.php.svn-work";s:4:"685f";s:42:"modfunc2/.svn/props/locallang.xml.svn-work";s:4:"685f";s:66:"modfunc2/.svn/wcprops/class.tx_indexedsearch_modfunc2.php.svn-work";s:4:"4213";s:44:"modfunc2/.svn/wcprops/locallang.xml.svn-work";s:4:"707e";}',
	'constraints' => array(
		'depends' => array(
			'cms' => '',
			'php' => '3.0.0-',
			'typo3' => '4.0.0-',
		),
		'conflicts' => array(
		),
		'suggests' => array(
		),
	),
	'suggests' => array(
	),
);

?>
