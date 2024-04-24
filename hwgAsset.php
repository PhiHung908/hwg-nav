<?php
namespace Hwg;

use yii\web\AssetBundle;

class hwgAsset extends AssetBundle
{
	public $sourcePath = '@Hwg/views/hWidget/Assets';
	
    public $css = [
		];
    public $js = [
			'phUtils.js',
			'PH_utils.uiBase.js',
		];
    public $depends = [
			'Hwg\hwgJuiAsset',
			'Hwg\hwgClipboardJsAsset',
		]; 
}
