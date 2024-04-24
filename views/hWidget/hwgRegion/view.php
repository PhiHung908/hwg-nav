<?php



use yii\bootstrap5\ActiveForm;

use yii\bootstrap5\Html;
//use yii\helpers\Json;

/*
$wg->begin($wg->getParams());
echo 'aaaaa';
$wg->end(); 
*/



$GLOBALS['viewContBegin'] = $wg->render('hWidget\hwgRegion\viewContBegin.php.twig');
$GLOBALS['viewContEnd'] = $wg->render('hWidget\hwgRegion\viewContEnd.php');


function renderContItems(&$v, &$wg, $params, $isRecusive) {
	if ($isRecusive) echo '<div class="col">';
	echo $GLOBALS['viewContBegin'];
		if (key_exists('items', $v)) {
			doForEach($v['items'], $wg, $params, true);
		} 
		echo $v['name'];
	echo $GLOBALS['viewContEnd'];
	if ($isRecusive) echo '</div>';
}



function renderInputItems(&$v) {
	$attr = $v['data'];
	echo Html::tag('div',
						Html::input(array_slice(explode('-', $v['itype']), 1)[0], $v['name'], $v['name'], ['class' => 'cont-input'])
					, ['class' => 'col']);
}



function renderFormRegion(&$v, &$wg, $params, $isRecusive) {
	$params = $v['data']; $mField;
	
	if ($isRecusive) echo '<div class="col">';
	
	echo $GLOBALS['viewContBegin'];
	
	//echo Html::beginForm([ $v['route'] , 'id' => $v['id'].'w_design' ], 'get', ['enctype' => 'multipart/form-data']);
	//*
	$form = ActiveForm::begin([
		'method' => 'get',
		'action' => [ $v['route'] ],
	]);
	//*/
	
	if (isSet($params['modelFieldClass'])) {
		$mField = ActiveForm::beginField($params['modelFieldClass']);//, $attribute, $options = [])
	}
	
	if (key_exists('items', $v)) {
		doForEach($v['items'], $wg, $params, true);
	}
	
	if (isSet($mField)) {
		$mField->endField();
	}
	
	echo Html::submitButton(
                'Submit',
                ['class' => 'btn btn-link logout text-decoration-none pt-0']
				);
	
	//*
	$form->end();
	//*/
	//echo Html::endForm();
	
	echo $GLOBALS['viewContEnd'];
	
	if ($isRecusive) echo '</div>';
}



function renderGridRegion(&$v, &$wg, $params, $isRecusive) {
	return;
	$params = $v['data'];
	
	
	echo $GLOBALS['viewContBegin'];
		if (key_exists('items', $v)) {
			doForEach($v['items'], $wg, $params, true);
		} 
		echo $v['name'];
	echo $GLOBALS['viewContEnd'];
	
	
}



function doForEach(&$dArray, &$wg, $params, $isRecusive) {
	foreach ($dArray as $k => &$v) {
		//se viet sau voi cac opts: noTitle, v.v... $componentOpts = $v['data'];
		
		$stackWg = isSet($stackWg) ? : $wg;
		if ($v['itype'] === 'region' || $v['itype'] === 'form-region' ) {
			$params['title'] = $v['name'];
			if ($isRecusive) echo '<div class="col">';
			$stackWg = $wg->begin($params);
			if ($v['itype'] === 'region') {
				if (key_exists('items', $v)) {
					doForEach($v['items'], $stackWg, $params, true);
				}
			} else {
				renderFormRegion($v, $stackWg, $params, false);
			}
			$stackWg->end();
			if ($isRecusive) echo '</div>';
		} else if ($v['itype'] === 'cont-items') {
			renderContItems($v, $stackWg, $params, false);
		} else if (strPos($v['itype'].'', 'input-') === 0) {
			renderInputItems($v);
		} else if ($v['itype'] === 'form-region') {
			if ($isRecusive) echo '<div class="col">';
			renderFormRegion($v, $stackWg, $params, false);
			if ($isRecusive) echo '</div>';
		} else if ($v['itype'] === 'grid-region') {
			renderGridRegion($v, $stackWg, $params, false);
		}
	}
}



doForEach($wg->dArray, $wg, $wg->getParams(), false);
?>
