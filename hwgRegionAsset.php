<?php
namespace Hwg;

use yii\web\AssetBundle;

class hwgRegionAsset extends AssetBundle
{
	public $sourcePath = '@Hwg/views/hWidget/Assets';
	
	
    public $css = [
			'hwg.region.css',
		];
    public $js = [
			'hwg.region.js',
		];
    public $depends = [
			'yii\jui\JuiAsset',
		]; 
}
