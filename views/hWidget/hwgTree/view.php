<?php

use Hwg\models\HwgTreeModel;
 
use yii\helpers\Html;
use yii\helpers\Json; 

use Hwg\components\Helper;

$dataTreeModel = new HwgTreeModel();

/*
$arrayR = [];
$arrayP = [];

Helper::parseArrayTree($arrayR, $dataTreeModel->getArrayItems(1));
Helper::menuChild($arrayR);
//echo Json::htmlEncode([$array]);
$mTreeR = Json::htmlEncode(
    ['items' => $arrayR ]
);
//----
Helper::parseArrayTree($arrayP, $dataTreeModel->getArrayItems(2));
Helper::menuChild($arrayP);
//echo Json::htmlEncode([$array]);
$mTreeP = Json::htmlEncode(
    ['items' => $arrayP]
);

$arrayRP = [];
Helper::parseArrayTree($arrayRP, $dataTreeModel->getArrayItems(''));
Helper::menuChild($arrayRP);
//echo Json::htmlEncode([$array]);
$mTreeRP = Json::htmlEncode(
    ['items' => $arrayRP]
);
*/
$arrayR = $dataTreeModel->getDataTree(1);
$arrayP = $dataTreeModel->getDataTree(2);
$arrayRP = $dataTreeModel->getDataTree('');
/*
$mTreeR = $dataTreeModel->getDataTree(1, true, 'items',  'children');
$mTreeP = $dataTreeModel->getDataTree(2, true, 'items', 'children');
$mTreeRP = $dataTreeModel->getDataTree('', true, 'items', 'children');
*/
$mTreeR = Json::htmlEncode(['items' => $arrayR]);
$mTreeP = Json::htmlEncode(['items' => $arrayP]);
$mTreeRP = Json::htmlEncode(['items' => $arrayRP]);


//use common\widgets\phUtils\hwgTree;
//echo hwgTree::widget(['name' => 'xName', 'clientOptions' => ['a' => 1, 'b' => 2, 'id' => 'hwg'] ]);
/*
yii\jui\JuiAsset::register($this);
//$this->registerJsFile('hwg.tree', ['position' => 'POST_HEAD', 'depends' => ['yii\jui\JuiAsset'] ]);
$this->registerCss($this->render('_jq_tree.css'));
$this->registerJs($this->render('hwg.tree.js'));
*/

//$this->registerJs("jQuery('.jq-tree-acl').hwgTree();\n");
/*
\aminkt\widgets\tree\TreeView::widget([
    //'data'=>$array,
    'remove'=>['bot-actions/category-remove'],
    'edit'=>['bot-actions/categories'],
]);
//var_dump($array);
 */

//$this->registerJs("var  _mTree = {'R': $mTreeR, 'P': $mTreeP, 'RP': $mTreeRP};");
 
//use common\widgets\phUtils\hwgTree;
//echo hwgTree::widget(['name' => 'xName', 'clientOptions' => ['a' => 1, 'b' => 2, 'id' => 'hwg'] ]);

use \lesha724\treeview\TreeView;
?>


<?php /*
$array=[];
$i = 0;
foreach ((new AuthItem)->getArrayItems('') as $aVal) {
    $a0 = $aVal;
	if ($i++ >1) {
		ArrayHelper::setValue($array, ltrim($a0['path'],'.'),['text' => $a0['name'], 'nodes' =>  $aVal]);
	}
}
var_dump($array);
echo '<script>var aa=';
echo( Json::htmlEncode([
    'items' => array('available' => $array)
]));
echo '</script>';
*/
?>

<div id="hwg" class="row">
	<div class="col-sm-5">
		<div>
		<h5>Roles</h5>
		
			<div class="jq-tree-acl">
				<?TreeView:begin()?>
				<?=TreeView::widget(['id' => 'wtreeview_r', 'data' => $arrayR, 'cssFile' => 'jquery.treeview.css', 'animated' => true]);?>
				<?TreeView:end()?>
			</div>
			<h5>Permisions</h5>
			<div class="jq-tree-acl">
				<?TreeView:begin()?>
				<?= TreeView::widget(['id' => 'wtreeview_p', 'data' => $arrayP, 'cssFile' => 'jquery.treeview.css', 'animated' => true]); ?>
				<?TreeView:end()?>
			</div>
		</div>
	</div>
	
	<div class="col-sm-1">
	</div>
	
	<div class="col-sm-5">
		<div id="hh2"> 
			<h5>Tree Full</h5>
			<div class="jq-tree-acl">
				<?TreeView:begin()?>
				<?= TreeView::widget(['id' => 'wtreeview_rp', 'data' => $arrayRP, 'cssFile' => 'jquery.treeview.css', 'animated' => true]); ?>
				<?TreeView:end()?>
			</div>
		</div>
	</div> 
</div>

