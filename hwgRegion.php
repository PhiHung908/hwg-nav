<?php
namespace hwg;

use Hwg\hwgRegionAsset;
use Hwg\models\HwgRegionModel;

use yii\bootstrap5\Html;
use yii\widgets\ActiveForm;

use yii\helpers\Url;
use yii\helpers\Json;

 
class hwgRegion extends \yii\jui\Widget
{
	//params when use model inherit hwgTreeBaseModel
	public $model;
	
	public $treeTable = '';
	public $branchName = '';
	public $keyChild = 'items';
	public $map = [];
	private $_keyEncode;
	public $keyEncode =  'data';
	
	public $dArray = [];
	//end params...
	
	private $_initRender;
	public $lazyMode = false;
	
	private $_params;
	
	public $title;
	
	
	private $viewContBegin;
	private $viewContEnd;

	
	
	
	public function getParams() {
		$this->_params['lazyMode'] = false;
		return $this->_params;
	}
	
	
	public function __construct($params = [])
    {
        parent::__construct($params);
		$this->_params = $params;
		$this->model = new HwgRegionModel($params);
		
		$this->_initRender = !empty($params['lazyMode']) && $params['lazyMode'] == true || $this->lazyMode ? 'view' : 'begin';
		$this->_init($params);
    }
	
	
	private function _init($config = [])
    {
		$this->dArray = $this->model->getDataTree($this->branchName, $this->keyChild, $this->map, /*$this->keyEncode*/null);
		$this->_keyEncode = $this->keyEncode ? : 'data'; 
		$this->clientOptions[$this->_keyEncode] = Json::htmlEncode($this->dArray);
		hwgRegionAsset::register($this->getView());
		
		$this->viewContBegin = $this->renderFile('@Hwg/views/hWidget\hwgRegion\viewContBegin.php.twig');
		$this->viewContEnd   = $this->renderFile('@Hwg/views/hWidget\hwgRegion\viewContEnd.php');

		
		$this->renderWidget($this->_initRender);
		$this->_run();
    }
	
	
    public function init()
    {
        if (!isset($this->options['id'])) {
            $this->options['id'] = $this->getId();
        }
		parent::init();
    }
	
	
    private function _run()
    {	
		$this->clientOptions['id'] = $this->getId();
		$this->registerClientOptions('hwgRegion', $this->id);
    }
	
	
	public function Xrun()
    {
		$this->renderWidget('view');
	}
	

	public function _beforeRun() {
		if (!parent::beforeRun()) {
			return false;
		}
		
		$this->renderWidget($this->_initRender);
		$this->_run();
		
		return true;
	}
	
	
	public function afterRun($result) {
		//$result = parent::afterRun($result);
		$this->renderWidget('end');
		//return $result;
		//$this->registerClientOptions('hwgRegion', $this->getId());
	}
	
	
	protected function renderWidget($mode)
    {
		if ($mode == 'begin') {
			echo $this->renderFile('@Hwg/views/hWidget/hwgRegion/viewRegionBegin.php.twig', ['wg' => $this, 'title' => $this->title ]);
		} else if ($mode == 'end')  {
			echo $this->renderFile('@Hwg/views/hWidget/hwgRegion/viewRegionEnd.php', ['wg' => $this, 'title' => $this->title ]);
		} else {
			echo $this->renderFile('@Hwg/views/hWidget/hwgRegion/view.php', ['wg' => $this, 'title' => $this->title ]);

		}
	}
	
	
	
	public function renderContItems(&$v, &$wg, $params, $isRecusive) {
		if ($isRecusive) echo '<div class="col">';
		echo $this->viewContBegin;
			if (key_exists('items', $v)) {
				$this->doForEach($v['items'], $wg, $params, true);
			} 
			echo $v['name'];
		echo $this->viewContEnd;
		if ($isRecusive) echo '</div>';
	}



	public function renderInputItems(&$v) {
		$attr = $v['data'];
		echo Html::tag('div',
							Html::input(array_slice(explode('-', $v['itype']), 1)[0], $v['name'], $v['name'], ['class' => 'cont-input'])
						, ['class' => 'col']);
	}



	public function renderFormRegion(&$v, &$wg, $params, $isRecusive) {
		$params = $v['data']; $mField;
		
		if ($isRecusive) echo '<div class="col">';
		
		$form = ActiveForm::begin([
			'method' => 'get',
			'action' => [ $v['route'] ],
		]);
		
		if (isSet($params['modelFieldClass'])) {
			$mField = ActiveForm::beginField($params['modelFieldClass']);//, $attribute, $options = [])
		}
		
		if (key_exists('items', $v)) {
			$this->doForEach($v['items'], $wg, $params, true);
		}
		
		if (isSet($mField)) {
			$mField->endField();
		}
		
		$form->end();
		
		if ($isRecusive) echo '</div>';
	}



	public function renderGridRegion(&$v, &$wg, $params, $isRecusive) {
		return;
		$params = $v['data'];
		
		if ($isRecusive) echo '<div class="col">';
		
		echo $this->viewContBegin;
			if (key_exists('items', $v)) {
				$this->doForEach($v['items'], $wg, $params, true);
			} 
			echo $v['name'];
		echo $this->viewContEnd;
		
		if ($isRecusive) echo '</div>';
	}



	function doForEach(&$dArray, &$wg, $params, $isRecusive) {
		foreach ($dArray as $k => &$v) {
			$stackWg = isSet($stackWg) ? : $wg;
			if ($v['itype'] === 'region') {
				$params['title'] = $v['name'];
				if ($isRecusive) echo '<div class="col">' .'@@@-' . $v['name'];
				$stackWg = $wg->begin($params);
				if (key_exists('items', $v)) {
					$this->doForEach($v['items'], $stackWg, $params, true);
				}
				$stackWg->end();
				if ($isRecusive) echo '</div>';
			} else if ($v['itype'] === 'cont-items') {
				$this->renderContItems($v, $stackWg, $params, false);
			} else if (strPos($v['itype'].'', 'input-') === 0) {
				$this->renderInputItems($v);
			} else if ($v['itype'] === 'form-region') {
				$this->renderFormRegion($v, $stackWg, $params, false);
			} else if ($v['itype'] === 'grid-region') {
				$this->renderGridRegion($v, $stackWg, $params, false);
			}
		}
	}


}