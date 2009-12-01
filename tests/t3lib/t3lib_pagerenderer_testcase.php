<?php
/***************************************************************
* Copyright notice
*
* (c) 2009 Steffen Kamper (info@sk-typo3.de)
* All rights reserved
*
* This script is part of the TYPO3 project. The TYPO3 project is
* free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 2 of the License or
* (at your option) any later version.
*
* The GNU General Public License can be found at
* http://www.gnu.org/copyleft/gpl.html.
*
* This script is distributed in the hope that it will be useful
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* This copyright notice MUST APPEAR in all copies of the script!
***************************************************************/


/**
 * Testcase for the t3lib_PageRenderer class in the TYPO3 core.
 *
 * @package TYPO3
 * @subpackage t3lib
 *
 * @author Steffen Kamper (info@sk-typo3.de)
 */
class t3lib_PageRenderer_testcase extends tx_phpunit_testcase {
	/**
	 * @var t3lib_PageRenderer
	 */
	private $fixture;

	public function setUp() {
		$this->fixture = new t3lib_PageRenderer();
		$this->fixture->setCharSet('utf-8');
	}

	public function tearDown() {
		unset(
			$this->fixture
		);
	}


	//////////////////////////////////////
	// Tests for the basic functionality
	//////////////////////////////////////

	/**
	 * @test
	 */
	public function fixtureCanBeCreated() {
		$this->assertTrue(
			$this->fixture instanceof t3lib_PageRenderer
		);
	}

	//////////////////////
	// test functions
	//////////////////////

	/**
	* test set xml prolog and doctype
	*
	*/
	public function testSetXmlPrologAndDocType() {

		$expectedReturnValue = '<?xml version="1.0" encoding="utf-8" ?>';
		$this->fixture->setXmlPrologAndDocType('<?xml version="1.0" encoding="utf-8" ?>');
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test set title
	*
	*/
	public function testSetTitle() {

		$expectedReturnValue = '<title>This is the title</title>';
		$this->fixture->setTitle('This is the title');
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test set charset
	*
	*/
	public function testSetCharset() {

		$expectedReturnValue = '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
		$this->fixture->setCharset('utf-8');
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test set favicon
	*
	*/
	public function testSetFavIcon() {

		$expectedReturnValue1 = '<link rel="shortcut icon" href="http://google.com/favicon.ico" />';
		$expectedReturnValue2 = '<link rel="icon" href="http://google.com/favicon.ico" />';
		$this->fixture->setFavIcon('http://google.com/favicon.ico');
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue1,
			$out
		);
		$this->assertContains(
			$expectedReturnValue2,
			$out
		);

	}

	/**
	* test set baseUrl
	*
	*/
	public function testSetBaseUrl() {

		$expectedReturnValue = '<base href="http://ggogle.com/" />';
		$this->fixture->setBaseUrl('http://ggogle.com/');
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test add meta tag
	*
	*/
	public function testAddMetaTag() {

		$expectedReturnValue = '<meta name="author" content="Anna Lyse">';
		$this->fixture->addMetaTag('<meta name="author" content="Anna Lyse">');
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test add inline comment
	*
	*/
	public function testAddInlineComment() {

		$expectedReturnValue = 'this is an inline comment written by unit test';
		$this->fixture->addInlineComment('this is an inline comment written by unit test');
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test add header data
	*
	*/
	public function testAddHeaderData() {

		$expectedReturnValue = '<tag method="private" name="test" />';
		$this->fixture->addHeaderData('<tag method="private" name="test" />');
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test add footer data
	*
	*/
	public function testAddFooterData() {

		$expectedReturnValue = '<tag method="private" name="test" />';
		$this->fixture->addFooterData('<tag method="private" name="test" />');
		$out = $this->fixture->render(t3lib_PageRenderer::PART_FOOTER);

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test add JS library file
	*
	*/
	public function testAddJsLibrary() {

		$expectedReturnValue = '<script src="fileadmin/test.js" type="text/javascript"></script>';
		$this->fixture->addJsLibrary('test', 'fileadmin/test.js');
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}


	/**
	* test add JS footer library file
	*
	*/
	public function testAddJsFooterLibrary() {

		$expectedReturnValue = '<script src="fileadmin/test.js" type="text/javascript"></script>';
		$this->fixture->addJsFooterLibrary('test', 'fileadmin/test.js');
		$out = $this->fixture->render(t3lib_PageRenderer::PART_FOOTER);

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test add JS file
	*
	*/
	public function testAddJsFile() {

		$expectedReturnValue = '<script src="fileadmin/test.js" type="text/javascript"></script>';
		$this->fixture->addJsFile('fileadmin/test.js');
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test add JS file for footer
	*
	*/
	public function testAddJsFooterFile() {

		$expectedReturnValue = '<script src="fileadmin/test.js" type="text/javascript"></script>';
		$this->fixture->addJsFooterFile('fileadmin/test.js');
		$out = $this->fixture->render(t3lib_PageRenderer::PART_FOOTER);

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test add JS inline
	*
	*/
	public function testAddJsInlineCode() {

		$expectedReturnValue = 'var x = "testvar"';
		$this->fixture->addJsInlineCode('test', 'var x = "testvar"');
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test add JS inline for footer
	*
	*/
	public function testAddJsFooterInlineCode() {

		$expectedReturnValue = 'var x = "testvar"';
		$this->fixture->addJsFooterInlineCode('test', 'var x = "testvar"');
		$out = $this->fixture->render(t3lib_PageRenderer::PART_FOOTER);

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test add JS handler
	*
	*/
	public function testAddExtOnReadyCode() {

		$expectedReturnValue1 = 'Ext.onReady(function() {';
		$expectedReturnValue2 = 'var x = "testvar";';
		$this->fixture->loadExtJS();
		$this->fixture->addExtOnReadyCode('var x = "testvar";');
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue1,
			$out
		);

		$this->assertContains(
			$expectedReturnValue2,
			$out
		);

	}

	/**
	* test add CSS file
	*
	*/
	public function testAddCssFile() {

		$expectedReturnValue = '<link rel="stylesheet" type="text/css" href="fileadmin/test.css" media="screen" />';
		$this->fixture->addCssFile('fileadmin/test.css');
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test add CSS inline
	*
	*/
	public function testAddCssInlineBlock() {

		$expectedReturnValue = 'body {margin:20px;}';
		$this->fixture->addCssInlineBlock('general', 'body {margin:20px;}');
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test add CSS inline and force on top
	*
	*/
	public function testAddCssInlineBlockForceOnTop() {

		$expectedReturnValue = '/*general1*/' . chr(10) . 'h1 {margin:20px;}' . chr(10) . '/*general*/' . chr(10) . 'body {margin:20px;}';
		$this->fixture->addCssInlineBlock('general', 'body {margin:20px;}');
		$this->fixture->addCssInlineBlock('general1', 'h1 {margin:20px;}', NULL, TRUE);
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

    /**
    * test load prototype
    *
    */
  	public function testLoadPrototype() {

		$expectedReturnValue = '<script src="contrib/prototype/prototype.js" type="text/javascript"></script>';
		$this->fixture->loadPrototype();
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test load Scriptaculous
	*
	*/
	public function testLoadScriptaculous() {

		$expectedReturnValue = '<script src="contrib/scriptaculous/scriptaculous.js?load=effects,controls,slider" type="text/javascript"></script>';
		$this->fixture->loadScriptaculous('slider,controls');
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test load ExtJS
	*
	*/
    public function testLoadExtJS() {

		$expectedReturnValue = '<script src="contrib/extjs/adapter/jquery/ext-jquery-adapter.js" type="text/javascript"></script>' . chr(10) . '<script src="contrib/extjs/ext-all.js" type="text/javascript"></script>';
		$this->fixture->loadExtJS(TRUE, TRUE, 'jquery');
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test load ExtCore
	*
	*/
	public function testLoadExtCore() {

		$expectedReturnValue = '<script src="contrib/extjs/ext-core.js" type="text/javascript"></script>';
		$this->fixture->loadExtCore();
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test enable ExtJsDebug
	*
	*/
	public function testEnableExtJsDebug() {

		$expectedReturnValue = '<script src="contrib/extjs/adapter/jquery/ext-jquery-adapter.js" type="text/javascript"></script>' . chr(10) . '<script src="contrib/extjs/ext-all-debug.js" type="text/javascript"></script>';
		$this->fixture->loadExtJS(TRUE, TRUE, 'jquery');
		$this->fixture->enableExtJsDebug();
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test enable ExtCoreDebug
	*
	*/
   	public function testEnableExtCoreDebug() {

		$expectedReturnValue = '<script src="contrib/extjs/ext-core-debug.js" type="text/javascript"></script>';
		$this->fixture->loadExtCore();
		$this->fixture->enableExtCoreDebug();
		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test inline language label
	*
	*/
	public function testAddInlineLanguageLabel() {

		$expectedReturnValue = 'TYPO3.lang = {"myKey":"myValue"}';
		$this->fixture->loadExtJS();
		$this->fixture->addInlineLanguageLabel('myKey', 'myValue');
		$out = $this->fixture->enableMoveJsFromHeaderToFooter();
		$out = $this->fixture->render(t3lib_PageRenderer::PART_FOOTER);

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test inline language label as array
	*
	*/
	public function testAddInlineLanguageLabelArray() {

		$expectedReturnValue = 'TYPO3.lang = {"myKey1":"myValue1","myKey2":"myValue2"}';
		$this->fixture->loadExtJS();
		$this->fixture->addInlineLanguageLabelArray(array('myKey1' => 'myValue1', 'myKey2' => 'myValue2',));
		$out = $this->fixture->enableMoveJsFromHeaderToFooter();
		$out = $this->fixture->render(t3lib_PageRenderer::PART_FOOTER);

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test inline language label as array get merged
	*
	*/
	public function testAddInlineLanguageLabelArrayMerged() {

		$expectedReturnValue = 'TYPO3.lang = {"myKey1":"myValue1","myKey2":"myValue2"}';
		$this->fixture->loadExtJS();
		$this->fixture->addInlineLanguageLabelArray(array('myKey1' => 'myValue1',));
		$this->fixture->addInlineLanguageLabelArray(array('myKey2' => 'myValue2',));
		$out = $this->fixture->enableMoveJsFromHeaderToFooter();
		$out = $this->fixture->render(t3lib_PageRenderer::PART_FOOTER);

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test inline setting
	*
	*/
	public function testAddInlineSetting() {

		$expectedReturnValue = 'TYPO3.settings = {"myApp":{"myKey":"myValue"}};';
		$this->fixture->loadExtJS();
		$this->fixture->addInlineSetting('myApp', 'myKey', 'myValue');
		$out = $this->fixture->enableMoveJsFromHeaderToFooter();
		$out = $this->fixture->render(t3lib_PageRenderer::PART_FOOTER);

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test inline settings with array
	*
	*/
	public function testAddInlineSettingArray() {

		$expectedReturnValue = 'TYPO3.settings = {"myApp":{"myKey1":"myValue1","myKey2":"myValue2"}};';
		$this->fixture->loadExtJS();
		$this->fixture->addInlineSettingArray('myApp', array('myKey1' => 'myValue1', 'myKey2' => 'myValue2',));
		$out = $this->fixture->enableMoveJsFromHeaderToFooter();
		$out = $this->fixture->render(t3lib_PageRenderer::PART_FOOTER);

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test inline settings with array get merged
	*
	*/
	public function testAddInlineSettingArrayMerged() {

		$expectedReturnValue = 'TYPO3.settings = {"myApp":{"myKey1":"myValue1","myKey2":"myValue2"}};';
		$this->fixture->loadExtJS();
		$this->fixture->addInlineSettingArray('myApp', array('myKey1' => 'myValue1',));
		$this->fixture->addInlineSettingArray('myApp', array('myKey2' => 'myValue2',));
		$out = $this->fixture->enableMoveJsFromHeaderToFooter();
		$out = $this->fixture->render(t3lib_PageRenderer::PART_FOOTER);

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	* test add body content
	*
	*/
	public function testAddBodyContent() {
		$expectedReturnValue = 'ABCDE';
		$this->fixture->addBodyContent('A');
		$this->fixture->addBodyContent('B');
		$this->fixture->addBodyContent('C');
		$this->fixture->addBodyContent('D');
		$this->fixture->addBodyContent('E');

		$out = $this->fixture->getBodyContent();
		$this->assertEquals(
			$expectedReturnValue,
			$out
		);
	}


	/**
	* test set body content
	*
	*/
	public function testSetBodyContent() {
		$expectedReturnValue = 'ABCDE';
		$this->fixture->setBodyContent('ABCDE');

		$out = $this->fixture->getBodyContent();
		$this->assertEquals(
			$expectedReturnValue,
			$out
		);

		$out = $this->fixture->render();

		$this->assertContains(
			$expectedReturnValue,
			$out
		);
	}

	/**
	 * Tests whether labels are delivered in a non-UTF-8 context.
	 * (background: json_encode() requires UTF-8 to work properly)
	 *
	 * @test
	 */
	public function isInlineLanguageLabelDeliveredWithNonUTF8() {
		$testPrefix = uniqid('test');
		$this->fixture->loadExtCore();
		$this->fixture->setCharSet('iso-8859-1');
		$this->fixture->addInlineLanguageLabel($testPrefix, $testPrefix . "_\xd8");

		$out = $this->fixture->render();

		$this->assertContains($testPrefix . '_\\u00d8', $out);
	}
}
?>