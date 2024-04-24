<?php
namespace Hwg;

use yii\web\AssetBundle;

class hwgNavAsset extends AssetBundle
{
	public $sourcePath = '@Hwg/views/hWidget/Assets';
	
	
    public $css = [
			'hwg.Nav.css',
		];
    public $js = [
			'hwg.Nav.js',
		];
    public $depends = [
			'Hwg\hwgAsset',
			'Hwg\hwgDepends',
		]; 
}
