<?php
namespace hwg;

use Hwg\hwgNavAsset;
use Hwg\models\hwgNavModel;  


use yii\helpers\Url;
use yii\helpers\Json;

 
class hwgNav extends \yii\jui\Widget
{
	//params when use model inherit hwgTreeBaseModel
    public $treeTable = '';
	
	public $model;
	
	public $branchName = '';
	public $keyChild = 'children';
	public $map = ['name' => 'text'];
	private $_keyEncode;
	public $keyEncode =  'data';
	
	public $dArray = [];
	//end params...
	public $resizable = true;
	public $clientEvent = '';
	
	
	public $brandLabel = '';
	public $brandUrl = '';
	public $brandOptions = [];
	
	public $classFixed = '';
	public $navOptions = [];
	
	public $navType = 'bar';
	public $menuAutoToggle = false;
	public $menuAlwayIconMin = false;
	public $menuInitMin = true;
	
	public $barAlwayIconMin = false;
	
	public $isMainNav = true;
	public $isRightMenu = false;
	public $resetSiseAllNav = true;	
	public $noGToggle = false;
	public $customLiEvent = false;
	public $draggable = false;
	public $dragRevert = false;
	  
	  
	public function __construct($params = [])
    {
        parent::__construct($params);
		$this->model = new hwgNavModel($params);
		$this->_init($params);
    }
	
    
	private function _init($config = [])
    {
		//parent::init($config);
		$this->dArray = $this->model->getDataTree($this->branchName, $this->keyChild, $this->map, /*$this->keyEncode*/null);
		$this->_keyEncode = $this->keyEncode ? : 'data'; 
		$this->clientOptions[$this->_keyEncode] = Json::htmlEncode($this->dArray);
		hwgNavAsset::register($this->getView()); 
    }
	
	
	public function init()
    {
        if (!isset($this->options['id'])) {
            $this->options['id'] = $this->getId();
        }
		parent::init();
    }

    public function run()
    {
		$this->clientOptions['id'] = $this->getId();
		$this->clientOptions['navType'] = $this->navType;
		$this->clientOptions['menuAutoToggle'] = $this->menuAutoToggle;
		$this->clientOptions['menuAlwayIconMin'] = $this->menuAlwayIconMin;
		$this->clientOptions['menuInitMin'] = $this->menuInitMin; 
		$this->clientOptions['barAlwayIconMin'] = $this->barAlwayIconMin;
		$this->clientOptions['isMainNav'] = $this->isMainNav;
		$this->clientOptions['isRightMenu'] = $this->isRightMenu;
		$this->clientOptions['resizable'] = $this->resizable;
		$this->clientOptions['clientEvent'] = $this->clientEvent;
		$this->clientOptions['resetSiseAllNav'] = $this->resetSiseAllNav;
		$this->clientOptions['noGToggle'] = $this->noGToggle;
		$this->clientOptions['customLiEvent'] = $this->customLiEvent;
		$this->clientOptions['draggable'] = $this->draggable;
		$this->clientOptions['dragRevert'] = $this->dragRevert;
		
		$this->clientOptions['noTopFixed'] = !empty($this->clientOptions['noTopFixed']) ? : false;  
		if ($this->navType == 'menu') {
			$this->renderWidgetMenu();
		} else {
			$this->renderWidget();
		}
		$this->registerClientOptions('hwgNav', $this->getId());
    }
	
	protected function renderWidget()
    {
		echo $this->renderFile('@Hwg/views/hWidget/hwgNav/view.php',['wg' => $this, 'dArray' => $this->dArray, 'clientOptions' => $this->clientOptions]);
	}
	
	protected function renderWidgetMenu()
    {
		echo $this->renderFile('@Hwg/views/hWidget/hwgNav/viewMenu.php',['wg' => $this, 'dArray' => $this->dArray, 'clientOptions' => $this->clientOptions]);
	}
	
	private function _detectEvt(&$v) {
		$url = trim($v['url'].'');
		$aTag = strpos($url, 'javascript:')===0 || strpos($url, 'event:')===0 ? 'button' : 'a';
		$href = '';
		$hwgEvent = '';
		if ($aTag === 'a') {
			$href = 'href="'. str_replace('/index.php?','/?',urldecode(Url::to([$v['url']]))) . '" ';
		} else {
			$ev = substr($url, strpos($url,':')+1);
			if (strpos(trim($v['url'].''), 'javascript:')===0) {
				//$href = 'onclick="(function(event){location.href="' . $ev . '})(event);" ';
				$href = 'onclick="(function(event){function __(event){' . $ev . '}; return __(event);})(event);" ';
			} else {
				$hwgEvent = 'data-hwg-event="' . $ev . '" ';
			}
		}
		return [$aTag, $href, $hwgEvent];
	}
	
	public function drawLi(&$v, $liClass = 'nav-item', $aClass = 'dropdown-item') {
		$d = $v['serverside'];
		
		if (!is_null($d) && !empty($d)) {
			eval('$bool = ' . $d . ';');
			if (!$bool) return;
		}
		
		list($aTag, $href, $hwgEvent) = $this->_detectEvt($v);
		
		if (strPos($v['label'],'-')===0) {
			echo '<li><hr class="dropdown-divider"></li>';
			return;
		}
		echo ' 
				<li ' . $hwgEvent . 'class="' . (!in_array($v['itype'],['html','view','eval']) ? $liClass : '') . ($this->navType=='menu' ? ' ms-4' : ($v['itype'] === 'eval' ? ' ms-3' : ' ms-4')) . '" data-node-level="' . $v['level'] . '">';
					if ($v['itype'] == 'html') {
						echo '<div class="ms-0"><div class="full-row-hover"></div>' . $v['data'] . '</div>';
					} else if ($v['itype'] == 'view') {
						if (strPos('/',$v['data']) === false) {
							$fpath = '@Hwg/views/hWidget/form/'.$v['data'];
						} else {
							$fpath = $v['data'];
						}
						echo '<div class="ms-0">' . $this->renderFile($fpath) . '</div>';
					} else if ($v['itype'] === 'eval') {
						eval('use yii\bootstrap5\Html; use yii\helpers\Json; use yii\helpers\Url; '.$v['data'] .';');
					}
					else {
						echo '<' . $aTag . ' class="' . $aClass . '  hidden-arrow ps-0' . ($this->navType=='menu' ? ' ms-0' : ''). '" '  . $href . 'type="button"><div class="full-row-hover"></div>
							<i class="' . (!empty($v['icon']) ? $v['icon']: 'bi bi-dash') . ' pe-2" ' . (!empty($v['icon']) ? '' : ' style="color:transparent"') . ' XXtitle="' . $v['label'] . '"></i>
							<span class="a-label XXd-none XXd-sm-inline-block">' . $v['label'] . '</span>
						</' . $aTag . '>';
					}
				echo '</li>';
	}
	public function drawTree(&$v) {
		$d = $v['serverside'];
		if (!is_null($d) && !empty($d)) {
			eval('$bool = ' . $d . ';');
			if (!$bool) return;
		}
		list($aTag, $href, $hwgEvent) = $this->_detectEvt($v);
	 echo '		
			<li ' . $hwgEvent . 'class="nav-item dropdown ms-4" data-node-level="' . $v['level'] . '">
			  <' . $aTag . '  type="button" class="nav-link d-inline-block virt-dropdown-toggle ps-0' . ($this->navType=='menu' ? ' ms-0' : '') . '" ' . $href . '><div class="full-row-hover"></div>
				';
				if ($v['itype'] === 'eval') {
						eval('use yii\bootstrap5\Html; use yii\helpers\Json; use yii\helpers\Url;'.$v['data'] .';');
				} else { echo '
				<i class="' . (!empty($v['icon']) ? $v['icon'] : 'bi bi-dash') . ' pe-2" ' . (!empty($v['icon']) ? '' : ' style="color:transparent"') . ' XXtitle="' . $v['label'] . '"></i>
				<span class="a-label XXd-none XXd-sm-inline-block">' . $v['label'] . '</span>
				';} echo '
			  </' . $aTag . ' >
			  <button type="button" data-bs-auto-close="false" data-bs-offset="0,0" data-node-level="' . $v['level'] . '" class="nav-link dropdown-toggle dropdown-toggle-split float-end me-1 ps-2 pe-2 border border-0" id="navbarDropdownMenuLink_' . $v['id'] . '" role="button" data-bs-toggle="dropdown" aria-expanded="false">
				<span class="sr-only"></span>
			  </button>
			  <ul class="dropdown-menu' . ($v['level'] == 1 ?  ' dropdown-menu-end' : '') . ($this->navType=='menu' ? ' border border-0  me-auto' : '') . '" aria-labelledby="navbarDropdownMenuLink_' . $v['id'] . '" data-node-level="' . $v['level'] . '">';
	foreach($v['items'] as $sk => $sv) {
				if (key_exists('items', $sv)) {$this->drawTree($sv);} else {
					$this->drawLi($sv);
				}
	} echo '
			  </ul>
			</li>
		'; 
		
	}
}