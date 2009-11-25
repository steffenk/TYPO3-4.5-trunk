<?php
/**
 * Oracle configuration
 * 
 * $Id: oci8.config.php 26966 2009-11-25 15:20:04Z stucki $
 *
 * @author Xavier Perseguers <typo3@perseguers.ch>
 *
 * @package TYPO3
 * @subpackage dbal
 */
global $TYPO3_CONF_VARS;

$TYPO3_CONF_VARS['EXTCONF']['dbal']['handlerCfg'] = array(
	'_DEFAULT' => array( 
		'type' => 'adodb', 
		'config' => array(
			'driver' => 'oci8',
		),
	), 
);

$TYPO3_CONF_VARS['EXTCONF']['dbal']['mapping'] = array(
	'cachingframework_cache_hash' => array(
		'mapTableName' => 'cf_cache_hash',
	),
	'cpg_categories' => array(
		'mapFieldNames' => array(
			'pid' => 'page_id',
		),
	),
	'tt_news' => array(
		'mapTableName' => 'ext_tt_news',
		'mapFieldNames' => array(
			'uid' => 'news_uid',
		),
	),
	'tt_news_cat' => array(
		'mapTableName' => 'ext_tt_news_cat',
		'mapFieldNames' => array(
			'uid' => 'cat_uid',
		),
	),
	'tt_news_cat_mm' => array(
		'mapTableName' => 'ext_tt_news_cat_mm',
		'mapFieldNames' => array(
			'uid_local' => 'local_uid',
		),
	),
	'tx_dam_file_tracking' => array(
		'mapFieldNames' => array(
			'file_name' => 'filename',
			'file_path' => 'path',
		),
	),
	'tx_dbal_debuglog' => array(
		'mapFieldNames' => array(
			'errorFlag' => 'errorflag',
		),
	),
	'tx_templavoila_datastructure' => array(
		'mapTableName' => 'tx_templavoila_ds',
	),
);
?>