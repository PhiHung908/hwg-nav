<?php
namespace Hwg;

use yii\web\AssetBundle;

class hwgTreeBaseAsset extends AssetBundle
{
	public $sourcePath = '@Hwg/views/hWidget/Assets';
	
	
    public $css = [
			'hwg.tree.base.css',
		];
    public $js = [
			'hwg.tree.base.js',
		];
    public $depends = [
			'Hwg\hwgDepends',
		]; 
}
