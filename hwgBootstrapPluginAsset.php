<?php
namespace Hwg;

use yii\web\AssetBundle;

class hwgBootstrapPluginAsset extends AssetBundle
{
	
    public $css = [
		];
    
	public $js = [
		];
    
	public $depends = [
			'yii\bootstrap5\BootstrapPluginAsset',
		]; 
}
