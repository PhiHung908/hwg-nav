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
<nav id="<?=$clientOptions['id']?>" class="navbar navbar-expanded <?=$wg->classFixed?> h-100 align-items-start <?=$clientOptions['noTopFixed'] ? '' : 'position-fixed'?> invisible border border-bottom-1 border-top-0 border-end-0 border-start-0 pb-0 mb-3 <?= $wg->brandOptions['class'] ?>" data-bs-theme="<?=$dark?>" style="overflow-y: auto; overflow-x:hidden; margin-left:-0.5em; <?=$style?>">
  <div class="container-fluid ps-0 pe-0 pt-1">
    
	<button class="navbar-toggler border border-0  ms-1 mt-1 me-1 ps-1 pe-1 <?php echo $wg->isMainNav ? 'd-none' : 'XXXmark-for-menu' ?> border-top-0 border-end-0 border-start-0" data-bs-auto-close="false" data-node-level="0" type="button" data-bs-toggle="collapse" data-bs-target=".navbar_<?=$clientOptions['id']?>" aria-controls="<?=$clientOptions['id']?>" aria-expanded="true" aria-label="Toggle menu e">
      <span class="navbar-toggler-icon"></span>
    </button>
    <a class="navbar-brand me-auto <?php echo !$wg->isMainNav ? '': 'd-none' ?>" href="<?=$wg->brandUrl ? : '#'?>"><span class="a-label"><?=$wg->brandLabel?></span></a>
	
    <div class="navbar-collapse collapse show <?php echo !$wg->isMainNav ? 'eee' : 'dmy' ?>navbar_<?=$clientOptions['id']?>" id="XXnavbar_<?=$clientOptions['id']?>" style="--bs-body-bg: inherit"  data-node-level="0">


<?php if (!empty($wg->navOptions)) {?>
		<?php 
			//Html::beginTag('ul', $wg->navOptions);
			if (empty($wg->navOptions['class'])) $wg->navOptions['class'] = 'navbar-nav';
			else $wg->navOptions['class'] .= ' navbar-nav';
			echo '<ul class="' . $wg->navOptions['class'] . '">';
		?>
		
<?php } else {?>
      <ul class="navbar-nav me-auto mb-2 mb-md-0 border border-0" data-node-level="1">
<?php }?>
	<?php foreach ($dArray as $k => $v) {
		//if ($v['iposition'] == 'end') continue;
if (!key_exists('items', $v)) {$wg->drawLi($v, 'nav-item', 'nav-link');
} else {$wg->drawTree($v);}}
	?>
	  </ul>
    </div>
	<div class="navbar-collapse">
	<div class="navbar-collapse collapse me-auto show <?php echo !$wg->isMainNav ? 'eee' : 'dmy' ?>navbar_<?=$clientOptions['id']?>" id="YYnavbar_<?=$clientOptions['id']?>" data-node-level="0">
<?php if (!empty($wg->navOptions)) {?>
		<?php 
			//Html::beginTag('ul', $wg->navOptions);
			if (empty($wg->navOptions['class'])) $wg->navOptions['class'] = 'navbar-nav';
			else $wg->navOptions['class'] .= ' navbar-nav';
			echo '<ul class="' . $wg->navOptions['class'] . '">';
		?>
		
<?php } else {?>
      <ul class="navbar-nav me-auto mb-2 mb-md-0 border border-0" data-node-level="1">
<?php }?>
	<?php foreach ($dArray as $k => $v) {
		if (1==1 || !($v['iposition'] == 'end')) continue;
if (!key_exists('items', $v)) {$wg->drawLi($v, 'nav-item', 'nav-link');
} else {$wg->drawTree($v);}}
	?>
	  </ul>
    </div>
	</div>
  </div>
</nav>
