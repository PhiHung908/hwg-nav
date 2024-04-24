<?php

namespace Hwg\components;

use yii\helpers\ArrayHelper;

class Helper
{	
	public static function parseArrayTree(&$array, $aItems, $map = ['name' => 'text']) {
		$array = []; $n = count($aItems);
		for ($i = 0; $i<$n; $i++) {
			$aVal = $aItems[$i];
			/*if (strpos($aVal['path'],'.',1)===false) {
				if ($aVal['sta'] == 0) $array[$i] = $aVal;
				continue;
			}*/
			if (!empty($map)) foreach ((array)$map as $k => $v) {
				if (key_exists($k, $aItems[$i])) $aVal[$v] = $aItems[$i][$k];
			}
			ArrayHelper::setValue($array, ltrim($aItems[$i]['path'], '.'), $aVal);
		}
		uasort($array, function ($a, $b) {
			if (!isSet($a['order'])) return -1;
			return $a['order']==$b['order'] ? 0 : ($a['order']<$b['order'] ? -1 : 1);
		});
	}
	
	
	public static function menuChild111(&$array, $keyChild = 'children') {
		if (!is_array($array)) {return;} 
		foreach ($array as $k=>$v) {
			if (isSet($v['sta']) && $v['sta'] != 0) {
				if (is_array($array[$k])) {
					foreach($array[$k] as $sk=>$sv) {
						if (isSet($sv['sta']) ) {
							$array[$k][$keyChild][$sk] = $sv;
							unset($array[$k][$sk]);
							uasort($array[$k][$keyChild], function ($a, $b) {
								if (!isSet($a['order'])) return -1;
								return $a['order']==$b['order'] ? 0 : ($a['order']<$b['order'] ? -1 : 1);
							});
							self::menuChild($array[$k][$keyChild], $keyChild); 
						}
					}
				}
			}
		}
	}
	
	//new: su dung &$v
	public static function menuChild(&$array, $keyChild = 'children') {
		if (!is_array($array)) return;
		foreach (array_keys($array) as &$k) {
			if (is_array($array[$k])) {
				if (!(isSet($array[$k]['sta']) && $array[$k]['sta'] != 0)) continue;
				foreach ($array[$k] as $sk=>&$sv) {
					if (!isSet($sv['sta'])) continue;
					$array[$k][$keyChild][$sk] = $sv;
					unset($array[$k][$sk]);
					uasort($array[$k][$keyChild], function ($a, $b) {
						if (!isSet($a['order'])) return -1;
						return $a['order']==$b['order'] ? 0 : ($a['order']<$b['order'] ? -1 : 1);
					});
					self::menuChild($array[$k][$keyChild], $keyChild); 
					
				}
			}
		}
	}
	
}
