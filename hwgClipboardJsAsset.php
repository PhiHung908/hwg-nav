<?php
namespace Hwg;

use yii\web\AssetBundle;

class hwgClipboardJsAsset extends AssetBundle
{
	public $sourcePath = '@Hwg/views/hWidget/Assets';
	
    public $css = [
		];
    
	public $js = [
			'clipboard.js-master\dist\clipboard.min.js',
		];
    
	public $depends = [
		]; 
}
