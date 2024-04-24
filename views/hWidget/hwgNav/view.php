<?php

use yii\helpers\Url;
//use yii\bootstrap5\Html;
//use yii\bootstrap5\Nav;
use yii\bootstrap5\NavBar;

use Hwg\components\Helper;


?>

<?php 
	$dark = 'dark';
	$style = trim(!empty($wg->brandOptions) && !empty($wg->brandOptions['style']) ? $wg->brandOptions['style'] : '', ';');
	if (!empty($wg->brandOptions)) {
		if (!isSet($wg->brandOptions['class'])) $wg->brandOptions['class'] = 'text-bg-dark';
		if (strpos($wg->brandOptions['class'], 'bg-light') !== false) $dark = 'light'; else $dark = 'dark';
		$wg->brandOptions['data-bs-theme'] = $dark;
		if ($dark == 'light') $wg->brandOptions['class'] = str_replace('text-bk-light text-bk-light','text-bk-light',str_replace('bg-light','text-bk-light',str_replace('navbar-light','text-bk-light',$wg->brandOptions['class'])));
		else $wg->brandOptions['class'] = str_replace('text-bk-dark text-bk-dark','text-bk-dark',str_replace('bg-dark','text-bk-dark',str_replace('navbar-dark','text-bk-dark',$wg->brandOptions['class'])));
	} else {
		$wg->brandOptions['class'] = 'text-bg-dark';
	}
?>
<nav id="<?=$clientOptions['id']?>" class="navbar navbar-expand-lg <?=$wg->classFixed?> border border-bottom-1 border-top-0 border-end-0 border-start-0 <?=$wg->brandOptions['class']?>" data-bs-theme="<?=$dark?>" <?=!empty($style) ? 'style="'. $style . '"' : ''?>>
  <div class="container-fluid">
	<button class="navbar-toggler me-auto border border-0 ps-1 pe-1 mark-for-menu <?php echo $wg->isMainNav ? '' : ' d-none' ?>" data-bs-auto-close="false" data-node-level="0" type="button" data-bs-toggle="collapse" data-bs-target=".XXXnavbar_<?=$clientOptions['id']?>" aria-controls="XXXnavbar_<?=$clientOptions['id']?>" aria-expanded="true" aria-label="XXToggle navigation" style="margin-left: -0.2em;">
      <span class="navbar-toggler-icon"></span>
    </button>
    <a class="navbar-brand" href="<?=$wg->brandUrl ? : '#'?>"><?php if (!empty($v['logoUrl'])) { echo '<i><img src="' . $v['logoUrl'] .'"></i>';} ?><span class="a-label"><?=$wg->brandLabel?></span></a>
    <button class="navbar-toggler ms-auto border border-0 ps-1 pe-1" data-bs-auto-close="false" data-node-level="0" type="button" data-bs-toggle="collapse" data-bs-target=".navbar_<?=$clientOptions['id']?>" aria-controls="<?=$clientOptions['id']?>" aria-expanded="false" aria-label="Toggle navigation" style="margin-right: -0.2em !important;">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="navbar-collapse collapse navbar_<?=$clientOptions['id']?>" id="XXnavbar_<?=$clientOptions['id']?>   ps-0 pe-0" data-node-level="0">

<?php if (!empty($wg->navOptions)) {?>
		<?php 
			//Html::beginTag('ul', $wg->navOptions);
			if (empty($wg->navOptions['class'])) $wg->navOptions['class'] = 'navbar-nav';
			else $wg->navOptions['class'] .= ' navbar-nav';
			echo '<ul class="' . $wg->navOptions['class'] . '">';
		?>
		
<?php } else {?>
      <ul class="navbar-nav me-auto mb-2 mb-md-0" data-node-level="1">
<?php }?>
	<?php foreach ($dArray as $k => $v) {
		if ($v['iposition'] == 'end') continue;
if (!key_exists('items', $v)) {$wg->drawLi($v, 'nav-item', 'nav-link');
} else {$wg->drawTree($v);}}
	?>
	  </ul>
    </div>
	<div class="w-auto">
	<div class="navbar-collapse collapse ms-auto navbar_<?=$clientOptions['id']?>" id="YYnavbar_<?=$clientOptions['id']?>" data-node-level="0">
<?php if (!empty($wg->navOptions)) {?>
		<?php 
			//Html::beginTag('ul', $wg->navOptions);
			if (empty($wg->navOptions['class'])) $wg->navOptions['class'] = 'navbar-nav';
			else $wg->navOptions['class'] .= ' navbar-nav';
			echo '<ul class="' . $wg->navOptions['class'] . '">';
		?>
		
<?php } else {?>
      <ul class="navbar-nav me-auto mb-2 mb-md-0" data-node-level="1">
<?php }?>
	<?php foreach ($dArray as $k => $v) {
		if (!($v['iposition'] == 'end')) continue;
if (!key_exists('items', $v)) {	$wg->drawLi($v, 'nav-item', 'nav-link');
} else {$wg->drawTree($v);}}
	?>
	  </ul>
    </div>
	</div>
  </div>
</nav>


	<?php 
	//var_dump( $wg->model->cloneNode('', 29, 'newBranch') );
	?>

