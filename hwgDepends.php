<?php
namespace Hwg;

use yii\web\AssetBundle;

class hwgDepends extends AssetBundle
{

    public $css = [
		];
		
    public $js = [
		];
		
    public $depends = [
			'Hwg\hwgJuiAsset',
			'Hwg\hwgBootstrapPluginAsset',
			'Hwg\hwgBootstrapIconAsset',
		]; 
}
