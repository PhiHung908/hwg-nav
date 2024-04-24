<?php
namespace Hwg;

use yii\web\AssetBundle;

class hwgTreeAsset extends AssetBundle
{
	public $sourcePath = '@Hwg/views/hWidget/Assets';
	
	
    public $css = [
			'hwg.tree.css',
		];
    public $js = [
			'hwg.tree.js',
		];
    public $depends = [
			'yii\jui\JuiAsset',
		]; 
}
