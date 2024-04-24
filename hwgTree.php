<?php

namespace hwg;

use Yii;
use yii\helpers\Html;
 
use Hwg\hwgTreeAsset;
 
class hwgTree extends \yii\jui\Widget
{
    public $id;
	
    public $message;
	
	public $name;

    public function init()
    {
        parent::init();
		//JuiAsset::register($this->getView());
		hwgTreeAsset::register($this->getView()); 
		
        if ($this->message === null) {
            $this->message = 'Hello World '. $this->getViewPath();
        }
    }

    public function run()
    {
		//self::registerJs("jQuery('.jq-tree-acl').hwgTree();\n");
		
		$this->renderWidget();
		
		$this->registerClientOptions('hwgTree', $this->clientOptions['id']);
        //return Html::encode($this->message);
    }
	
	protected function renderWidget()
    {
		echo $this->renderFile('@Hwg/views/hWidget/hwgTree/view.php',['aaa' => 1, 'clientOptions' => $this->clientOptions]);
	}
}