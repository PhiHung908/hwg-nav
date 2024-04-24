<?php

namespace hwg;

use Yii;
use yii\helpers\Html;


use Hwg\hwgTreeBaseAsset;
use Hwg\models\hwgTreeBaseModel;  
 
class hwgTreeBase extends \yii\jui\Widget
{
    public $id;
	
	public $wgMode;
	  
	public $name;
	
	public $model;
	
	
    public function init($config = [])
    {
        parent::init();
		$this->model = new hwgTreeBaseModel;
		hwgTreeBaseAsset::register($this->getView()); 

    }

    public function run()
    {
		//self::registerJs("jQuery('.jq-tree-acl').hwgTree();\n");
		if ($this->wgMode = 'menu') {
			$this->renderWidgetMenu();
		} else {
			$this->renderWidget();
		}
		
		$this->registerClientOptions('hwgTreeBase', $this->getId());
        //return Html::encode($this->message);
    }
	
	protected function renderWidget()
    {
		echo $this->renderFile('@Hwg/views/hWidget/hwgTreeBase/view.php',['model' => $this->model, 'aaa' => 1, 'clientOptions' => $this->clientOptions]);
	}
	
	protected function renderWidgetMenu()
    {
		echo $this->renderFile('@Hwg/views/hWidget/hwgTreeBase/viewMenu.php',['model' => $this->model, 'aaa' => 1, 'clientOptions' => $this->clientOptions]);
	}
}