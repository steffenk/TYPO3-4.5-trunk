<?php
/***************************************************************
*  Copyright notice
*
*  (c) 1999-2004 Kasper Skaarhoj (kasper@typo3.com)
*  All rights reserved
*
*  This script is part of the TYPO3 project. TYPO3 is free software;
*  You can redistribute it and/or modify it under the terms of the
*  TYPO3 License as published from the www.typo3.com website.
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
*
*  This copyright notice MUST APPEAR in all copies of this script
***************************************************************/
/**
 * Contains the TYPO3 Backend Language class
 *
 * $Id$
 * Revised for TYPO3 3.6.0
 *
 * @author	Kasper Skaarhoj <kasper@typo3.com>
 */
/**
 * [CLASS/FUNCTION INDEX of SCRIPT]
 *
 *
 *
 *   79: class language
 *  127:     function init($lang,$altPath='')
 *  172:     function addModuleLabels($arr,$prefix)
 *  198:     function hscAndCharConv($lStr,$hsc)
 *  213:     function makeEntities($str)
 *  230:     function JScharCode($str)
 *  249:     function getLL($index,$hsc=0)
 *  266:     function getLLL($index,$LOCAL_LANG,$hsc=0)
 *  286:     function sL($input,$hsc=0)
 *  330:     function loadSingleTableDescription($table)
 *  382:     function includeLLFile($fileRef,$setGlobal=1,$mergeLocalOntoDefault=0)
 *  427:     function readLLfile($fileRef)
 *  441:     function localizedFileRef($fileRef)
 *
 * TOTAL FUNCTIONS: 12
 * (This index is automatically created/updated by the extension "extdeveval")
 *
 */
















/**
 * Contains the TYPO3 Backend Language class
 *
 * For detailed information about how localization is handled,
 * please refer to the 'Inside TYPO3' document which descibes this.
 *
 * This class is normally instantiated as the global variable $LANG in typo3/template.php
 * It's only available in the backend and under certain circumstances in the frontend
 *
 * @author	Kasper Skaarhoj <kasper@typo3.com>
 * @package TYPO3
 * @subpackage core
 * @see typo3/template.php, template
 */
class language {
	var $lang='default';		// This is set to the language that is currently running for the user
	var $langSplit='default';	// Values like the labels in the tables.php-document are split by '|'. This values defines which language is represented by which position in the resulting array after splitting a value. (NOTICE: Obsolete concept!)

		// Default charset in backend
	var $charSet = 'iso-8859-1';

		// Array with alternative charsets for other languages. (Moved to t3lib_cs, Set from csConvObj!)
	var $charSetArray = array();

		// This is the url to the TYPO3 manual
	var $typo3_help_url= 'http://www.typo3.com/man_uk/';
		// Array with alternative URLs based on language.
	var $helpUrlArray = array(
		'dk' => 'http://www.typo3.com/man_dk/',
	);


	var $moduleLabels = Array();	// Can contain labels and image references from the backend modules. Relies on t3lib_loadmodules to initialize modules after a global instance of $LANG has been created.

		// Internal
	var $langSplitIndex=0;			// Points to the position of the current language key as found in constant TYPO3_languages
	var $LL_files_cache=array();	// Internal cache for read LL-files
	var $LL_labels_cache=array();	// Internal cache for ll-labels (filled as labels are requested)

		// Internal charset conversion:
	var $origCharSet='';		// If set, then it means that the this->charSet is set to a forced, common value for the WHOLE backend regardless of user language. And THIS variable will contain the original charset for the language labels. With ->csConvObj we must then convert the original charset to the charset used in the backend from now on.
	var $csConvObj;				// An instance of the "t3lib_cs" class. May be used by any application.








	/**
	 * Initializes the backend language.
	 * This is for example done in typo3/template.php with lines like these:
	 *
	 * require (PATH_typo3.'sysext/lang/lang.php');
	 * $LANG = t3lib_div::makeInstance('language');
	 * $LANG->init($BE_USER->uc['lang']);
	 *
	 * @param	string		The language key (two character string from backend users profile)
	 * @param	string		IGNORE. Not used.
	 * @return	void
	 */
	function init($lang,$altPath='')	{

			// Initialize the conversion object:
		$this->csConvObj = t3lib_div::makeInstance('t3lib_cs');
		$this->charSetArray = $this->csConvObj->charSetArray;

			// Internally setting the list of TYPO3 backend languages.
		$this->langSplit=TYPO3_languages;

			// Finding the requested language in this list based on the $lang key being inputted to this function.
		$ls = explode('|',$this->langSplit);
		while(list($i,$v)=each($ls))	{
			if ($v==$lang)	{	// Language is found. Configure it:
				$this->langSplitIndex=$i;		// The index of the language as found in the TYPO3_languages list
				$this->lang = $lang;			// The current language key
				if ($this->helpUrlArray[$this->lang])	$this->typo3_help_url=$this->helpUrlArray[$this->lang];	// The help URL if different from the default.
				if ($this->charSetArray[$this->lang])	$this->charSet=$this->charSetArray[$this->lang];		// The charset if different from the default.
			}
		}

			// If a forced charset is used and different from the charset otherwise used:
		if ($GLOBALS['TYPO3_CONF_VARS']['BE']['forceCharset'] && $GLOBALS['TYPO3_CONF_VARS']['BE']['forceCharset']!=$this->charSet)	{
				// Set the forced charset:
			$this->origCharSet = $this->charSet;
			$this->charSet = $GLOBALS['TYPO3_CONF_VARS']['BE']['forceCharset'];

			if ($this->charSet!='utf-8' && !$this->csConvObj->initCharset($this->charSet))		{
				t3lib_BEfunc::typo3PrintError ('The forced character set "'.$this->charSet.'" was not found in t3lib/csconvtbl/','Forced charset not found');
				exit;
			}
			if ($this->origCharSet!='utf-8' && !$this->csConvObj->initCharset($this->origCharSet))		{
				t3lib_BEfunc::typo3PrintError ('The original character set "'.$this->origCharSet.'" was not found in t3lib/csconvtbl/','Forced charset not found');
				exit;
			}
		}
	}

	/**
	 * Adds labels and image references from the backend modules to the internal moduleLabels array
	 *
	 * @param	array		Array with references to module labels, keys: ['labels']['tablabel'], ['labels']['tabdescr'], ['tabs']['tab']
	 * @param	string		Module name prefix
	 * @return	void
	 * @see t3lib_loadModules
	 */
	function addModuleLabels($arr,$prefix)	{
		if (is_array($arr))	{
			reset($arr);
			while(list($k,$larr)=each($arr))	{
				if (!isset($this->moduleLabels[$k]))	{
					$this->moduleLabels[$k]=array();
				}
				if (is_array($larr))	{
					reset($larr);
					while(list($l,$v)=each($larr))	{
						$this->moduleLabels[$k][$prefix.$l]=$v;
					}
				}
			}
		}
	}

	/**
	 * Will htmlspecialchar() the input string and before that any charset conversion will also have taken place if needed (see init())
	 * Used to pipe language labels through just before they are returned.
	 *
	 * @param	string		The string to process
	 * @param	boolean		If set, then the string is htmlspecialchars()'ed
	 * @return	string		The processed string
	 * @see init()
	 */
	function hscAndCharConv($lStr,$hsc)	{
		$lStr = $hsc ? htmlspecialchars($lStr) : $lStr;
		if ($this->origCharSet)	{
			$lStr = $this->csConvObj->conv($lStr,$this->origCharSet,$this->charSet,1);
		}
		return $lStr;
	}

	/**
	 * Will convert the input strings special chars (all above 127) to entities. The string is expected to be encoded in the charset, $this->charSet
	 * This function is used to create strings that can be used in the Click Menu (Context Sensitive Menus). The reason is that the values that are dynamically written into the <div> layer is decoded as iso-8859-1 no matter what charset is used in the document otherwise (only MSIE, Mozilla is OK). So by converting we by-pass this problem.
	 *
	 * @param	string		Input string
	 * @return	string		Output string
	 */
	function makeEntities($str)	{
			// Convert string to UTF-8:
		if ($this->charSet!='utf-8')	$str = $this->csConvObj->utf8_encode($str,$this->charSet);

			// Convert string back again, but using the full entity conversion:
		$str = $this->csConvObj->utf8_to_entities($str);
		return $str;
	}

	/**
	 * Converts the input string to a JavaScript function returning the same string, but charset-safe.
	 * Used for confirm and alert boxes where we must make sure that any string content does not break the script AND want to make sure the charset is preserved.
	 * Originally I used the JS function unescape() in combination with PHP function rawurlencode() in order to pass strings in a safe way. This could still be done for iso-8859-1 charsets but now I have applied the same method here for all charsets.
	 *
	 * @param	string		Input string, encoded with $this->charSet
	 * @return	string		Output string, a JavaScript function: "String.fromCharCode(......)"
	 */
	function JScharCode($str)	{

			// Convert string to UTF-8:
		if ($this->charSet!='utf-8')	$str = $this->csConvObj->utf8_encode($str,$this->charSet);

			// Convert the UTF-8 string into a array of char numbers:
		$nArr = $this->csConvObj->utf8_to_numberarray($str);

		return 'String.fromCharCode('.implode(',',$nArr).')';
	}

	/**
	 * Returns the label with key $index form the globally loaded $LOCAL_LANG array.
	 * Mostly used from modules with only one LOCAL_LANG file loaded into the global space.
	 *
	 * @param	string		Label key
	 * @param	boolean		If set, the return value is htmlspecialchar'ed
	 * @return	string
	 */
	function getLL($index,$hsc=0)	{
		// Get Local Language
		if (strcmp($GLOBALS['LOCAL_LANG'][$this->lang][$index],''))	{
			return $this->hscAndCharConv($GLOBALS['LOCAL_LANG'][$this->lang][$index], $hsc);	// Returns local label if not blank.
		} else {
			return $this->hscAndCharConv($GLOBALS['LOCAL_LANG']['default'][$index], $hsc);	// Returns default label
		}
	}

	/**
	 * Works like ->getLL() but takes the $LOCAL_LANG array used as the second argument instead of using the global array.
	 *
	 * @param	string		Label key
	 * @param	array		$LOCAL_LANG array to get label key from
	 * @param	boolean		If set, the return value is htmlspecialchar'ed
	 * @return	string
	 */
	function getLLL($index,$LOCAL_LANG,$hsc=0)	{
		// Get Local Language
		if (strcmp($LOCAL_LANG[$this->lang][$index],''))	{
			return $this->hscAndCharConv($LOCAL_LANG[$this->lang][$index], $hsc);	// Returns local label if not blank.
		} else {
			return $this->hscAndCharConv($LOCAL_LANG['default'][$index], $hsc);		// Returns default label
		}
	}

	/**
	 * splitLabel function
	 * Historically labels were exploded by '|' and each part would correspond to the translation of the language found at the same 'index' in the TYPO3_languages constant.
	 * Today all translations are based on $LOCAL_LANG variables. 'language-splitted' labels can therefore refer to a local-lang file + index instead!
	 * It's highly recommended to use the 'local_lang' method (and thereby it's highly depreciated to use 'language-splitted' label strings)
	 * Refer to 'Inside TYPO3' for more details
	 *
	 * @param	string		Label key/reference
	 * @param	boolean		If set, the return value is htmlspecialchar'ed
	 * @return	string
	 */
	function sL($input,$hsc=0)	{
		if (strcmp(substr($input,0,4),'LLL:'))	{	// Using obsolete 'language-splitted' labels:
			$t = explode('|',$input);
			$out = $t[$this->langSplitIndex] ? $t[$this->langSplitIndex] : $t[0];
			return $this->hscAndCharConv($out, $hsc);
		} else {	// LOCAL_LANG:
			if (!isset($this->LL_labels_cache[$this->lang][$input])) {	// If cached label
				$restStr = trim(substr($input,4));
				$extPrfx='';
				if (!strcmp(substr($restStr,0,4),'EXT:'))	{	// ll-file refered to is found in an extension.
					$restStr = trim(substr($restStr,4));
					$extPrfx='EXT:';
				}
				$parts = explode(':',$restStr);
				$parts[0]=$extPrfx.$parts[0];
				if (!isset($this->LL_files_cache[$parts[0]]))	{	// Getting data if not cached
					$this->LL_files_cache[$parts[0]] = $this->readLLfile($parts[0]);

						// If the current language is found in another file, load that as well:
					$lFileRef = $this->localizedFileRef($parts[0]);
					if ($lFileRef && is_string($this->LL_files_cache[$parts[0]][$this->lang]) && $this->LL_files_cache[$parts[0]][$this->lang]=='EXT')	{
						$tempLL = $this->readLLfile($lFileRef);
						$this->LL_files_cache[$parts[0]][$this->lang] = $tempLL[$this->lang];
					}

						// Overriding file?
					if (isset($GLOBALS['TYPO3_CONF_VARS']['BE']['XLLfile'][$parts[0]]))	{
						$ORarray = $this->readLLfile($GLOBALS['TYPO3_CONF_VARS']['BE']['XLLfile'][$parts[0]]);
						$this->LL_files_cache[$parts[0]] = t3lib_div::array_merge_recursive_overrule($this->LL_files_cache[$parts[0]],$ORarray);
					}
				}
				$this->LL_labels_cache[$this->lang][$input] = $this->getLLL($parts[1],$this->LL_files_cache[$parts[0]]);
			}
			return $hsc ? t3lib_div::deHSCentities(htmlspecialchars($this->LL_labels_cache[$this->lang][$input])) : $this->LL_labels_cache[$this->lang][$input]; // For the cached output charset conversion has already happend! So perform HSC right here.
		}
	}

	/**
	 * Loading $TCA_DESCR[$table]['columns'] with content from locallang files as defined in $TCA_DESCR[$table]['refs']
	 * $TCA_DESCR is a global var
	 *
	 * @param	string		Table name found as key in global array $TCA_DESCR
	 * @return	void
	 */
	function loadSingleTableDescription($table)	{
		global $TCA_DESCR;

		if (is_array($TCA_DESCR[$table])
				&& !isset($TCA_DESCR[$table]['columns'])
				&& is_array($TCA_DESCR[$table]['refs']))	 {	// First the 'table' cannot already be loaded in [columns] and secondly there must be a references to locallang files available in [refs]

				// Init $TCA_DESCR for $table-key
			$TCA_DESCR[$table]['columns']=array();

				// Get local-lang for each file in $TCA_DESCR[$table]['refs'] as they are ordered.
			foreach ($TCA_DESCR[$table]['refs'] as $llfile)	{
				$LOCAL_LANG = $this->includeLLFile($llfile,0,1);

					// Traverse all keys
				if (is_array($LOCAL_LANG['default']))	{
					foreach($LOCAL_LANG['default'] as $lkey => $lVal)	{

							// exploding by '.':
							// 0 => fieldname,
							// 1 => type from (alttitle,description,details,syntax,image_descr,image,seeAlso),
							// 2 => special instruction, see switch construct
						$kParts = explode('.',$lkey);

							// Detecting 'hidden' labels, converting to normal fieldname
						if ($kParts[0]=='_')	$kParts[0]='';
						if (substr($kParts[0],0,1)=='_')	{ $kParts[0] = substr($kParts[0],1); }

							// Add label:
						switch((string)$kParts[2])	{
							case '+':	// adding
								$TCA_DESCR[$table]['columns'][$kParts[0]][$kParts[1]].= chr(10).$lVal;
							break;
							default:	// Substituting:
								$TCA_DESCR[$table]['columns'][$kParts[0]][$kParts[1]] = $lVal;
							break;
						}
					}
				}
			}
		}
	}

	/**
	 * Includes locallang file (and possibly additional localized version if configured for)
	 * Read language labels will be merged with $LOCAL_LANG (if $setGlobal=1).
	 *
	 * @param	string		$fileRef is a file-reference (see t3lib_div::getFileAbsFileName)
	 * @param	boolean		Setting in global variable $LOCAL_LANG (or returning the variable)
	 * @param	boolean		If $mergeLocalOntoDefault is set the local part of the $LOCAL_LANG array is merged onto the default part (if the local part exists) and the local part is unset.
	 * @return	mixed		If $setGlobal is true the LL-files will set the $LOCAL_LANG in the global scope. Otherwise the $LOCAL_LANG array is returned from function
	 */
	function includeLLFile($fileRef,$setGlobal=1,$mergeLocalOntoDefault=0)	{
			// Configure for global flag:
		if ($setGlobal)	{
			global $LOCAL_LANG;
		}

			// Get default file:
		$llang = $this->readLLfile($fileRef);

		if (count($llang))	{

			$LOCAL_LANG = t3lib_div::array_merge_recursive_overrule($LOCAL_LANG,$llang);

				// Localized addition?
			$lFileRef = $this->localizedFileRef($fileRef);
			if ($lFileRef && (string)$LOCAL_LANG[$this->lang]=='EXT')	{
				$llang = $this->readLLfile($lFileRef);
				$LOCAL_LANG = t3lib_div::array_merge_recursive_overrule($LOCAL_LANG,$llang);
			}

				// Overriding file?
			if (isset($GLOBALS['TYPO3_CONF_VARS']['BE']['XLLfile'][$fileRef]))	{
				$ORarray = $this->readLLfile($GLOBALS['TYPO3_CONF_VARS']['BE']['XLLfile'][$fileRef]);
				$LOCAL_LANG = t3lib_div::array_merge_recursive_overrule($LOCAL_LANG,$ORarray);
			}

				// Merge local onto default:
			if ($mergeLocalOntoDefault && strcmp($this->lang,'default') && is_array($LOCAL_LANG[$this->lang]) && is_array($LOCAL_LANG['default']))	{
				$LOCAL_LANG['default'] = array_merge($LOCAL_LANG['default'],$LOCAL_LANG[$this->lang]);	// array_merge can be used so far the keys are not numeric - which we assume they are not...
				unset($LOCAL_LANG[$this->lang]);
			}
		}

			// Return value if not global is set.
		if (!$setGlobal)	{
			return $LOCAL_LANG;
		}
	}

	/**
	 * Includes a locallang file and returns the $LOCAL_LANG array found inside.
	 *
	 * @param	string		Input is a file-reference (see t3lib_div::getFileAbsFileName) which, if exists, is included. That file is expected to be a 'local_lang' file containing a $LOCAL_LANG array.
	 * @return	array		Value of $LOCAL_LANG found in the included file. If that array is found it's returned. Otherwise an empty array
	 */
	function readLLfile($fileRef)	{
		$file = t3lib_div::getFileAbsFileName($fileRef);
		if ($file)	{
			$baseFile = ereg_replace('\.(php|xml)$', '', $file);

			if (@is_file($baseFile.'.xml'))	{
				$LOCAL_LANG = $this->readLLXMLfile($baseFile.'.xml', $this->lang);
			} elseif (@is_file($baseFile.'.php'))	{
				include($baseFile.'.php');
			}
		}
		return is_array($LOCAL_LANG)?$LOCAL_LANG:array();
	}

	/**
	 * Includes a locallang-xml file and returns the $LOCAL_LANG array
	 *
	 * @param	string
	 * @param	string
	 * @return	array
	 */
	function readLLXMLfile($fileRef,$langKey)	{

		if (@is_file($fileRef))	{

				// Set charset:
			$origCharset = $this->csConvObj->parse_charset($this->csConvObj->charSetArray[$langKey] ? $this->csConvObj->charSetArray[$langKey] : 'iso-8859-1');

				// Cache file name:
			$hashSource = substr($fileRef,strlen(PATH_site)).'|'.date('d-m-Y H:i:s',filemtime($fileRef));
			$cacheFileName = PATH_site.'typo3temp/llxml/cache_llxml_'.t3lib_div::md5int($hashSource).'.'.$langKey.'.'.$origCharset.'.ser';

				// Check if cache file exists...
			if (!@is_file($cacheFileName))	{	// ... if it doesn't, create content and write it:

					// Read XML, parse it and set default LOCAL_LANG array content:
				$xmlString = t3lib_div::getUrl($fileRef);
				$xmlContent = t3lib_div::xml2array($xmlString);
				$LOCAL_LANG = array();
				$LOCAL_LANG['default'] = $xmlContent['data']['default'];

					// Specific language, convert from utf-8 to backend language charset:
					// NOTICE: Converting from utf-8 back to "native" language may be a temporary solution until we can totally discard "locallang.php" files altogether (and use utf-8 for everything). But doing this conversion is the quickest way to migrate now and the source is in utf-8 anyway which is the main point.
				if ($langKey && $langKey!='default')	{
					$LOCAL_LANG[$langKey] = $xmlContent['data'][$langKey];

					if (is_array($LOCAL_LANG[$langKey]) && $origCharset!='utf-8')	{
						foreach($LOCAL_LANG[$langKey] as $labelKey => $labelValue)	{
							$LOCAL_LANG[$langKey][$labelKey] = $this->csConvObj->utf8_decode($labelValue,$origCharset);
						}
					}
				}

				$serContent = array('origFile'=>$hashSource, 'LOCAL_LANG'=>$LOCAL_LANG);
				t3lib_div::writeFileToTypo3tempDir($cacheFileName, serialize($serContent));
			} else {
				$serContent = unserialize(t3lib_div::getUrl($cacheFileName));
				$LOCAL_LANG = $serContent['LOCAL_LANG'];
			}
			return $LOCAL_LANG;
		}
	}

	/**
	 * Returns localized fileRef (.[langkey].php)
	 *
	 * @param	string		Filename/path of a 'locallang.php' file
	 * @return	string		Input filename with a '.[lang-key].php' ending added if $this->lang is not 'default'
	 */
	function localizedFileRef($fileRef)	{
		if ($this->lang!='default' && substr($fileRef,-4)=='.php')	{
			return substr($fileRef,0,-4).'.'.$this->lang.'.php';
		}
	}
}

// Include extension to the template class?
if (defined('TYPO3_MODE') && $TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/lang/lang.php'])	{
	include_once($TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/lang/lang.php']);
}
?>