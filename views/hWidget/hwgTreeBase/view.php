<?php

use yii\helpers\Html;
use yii\helpers\Json; 

use Hwg\components\Helper;
 
$array = $model->getDataTree('home2', true);

use \lesha724\treeview\TreeView;
?>

<div class="jq-tree-acl">
	<?TreeView:begin()?>
	<?=TreeView::widget(['id' => 'wtreeview_re', 'data' => $array, 'cssFile' => 'jquery.treeview.css', 'animated' => true]);?>
	<?TreeView:end()?>
</div>
