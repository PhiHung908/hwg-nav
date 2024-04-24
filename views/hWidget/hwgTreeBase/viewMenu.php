<?php

use Hwg\components\Helper;
use yii\bootstrap5\menu;
 
$array = $model->getDataTree('home2', 'items', ['name' => 'label', 'link' => 'url']);

/* 
//echo yii\widgets\Menu::widget(['firstItemCssClass'=> 'dropdown-menu dropdown-menu-end', 'items' => $array]);
echo yii\widgets\Menu::widget([
    'items' =>  $array,
	'options' => ['class' => 'bt-menu bt-menu-content', 'role' => 'listmenu'],
	'submenuTemplate' => "\n<ul class='bt-menu-content'>\n{items}\n</ul>\n",
	'labelTemplate' => '<div><span class="a-label">{label}</span></div>',
	'linkTemplate' => '<div><a href="{url}"><span class="a-label">{label}</span></a></div>',
	'itemOptions' => ['class' => 'bt-menu-item'],
	
]);
*/


use \lesha724\treeview\TreeView;

?>


<nav class="navbar XXXfixed-top navbar-expand-lg navbar-dark bg-primary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
        </li>
      </ul>
      <form class="d-flex">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>


<div id="xx">
<?=yii\widgets\Menu::widget([
    'items' =>  $array,
	'options' => ['class' => 'list-menu menu-content', 'role' => 'listmenu', 'aria-labelledby' => 'dropdownMenuButton_{id}'],
	'submenuTemplate' => "\n<ul class='list-menu menu-content sub'>\n{items}\n</ul>\n",
	'labelTemplate' => '<div><span class="a-label">{label}</span></div>',
	'linkTemplate' => '<div><a href="{url}"><span class="a-label">{label}</span></a></div>',
	'itemOptions' => ['class' => 'list-item'],
	
])?>
</div>

<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton_{id}" data-bs-toggle="dropdown" aria-expanded="true">
    Dropdown button
  </button>
<?=yii\widgets\Menu::widget([
    'items' =>  $array,
	'options' => ['class' => 'dropdown-menu menu-content', 'role' => 'listmenu', 'aria-labelledby' => 'dropdownMenuButton_{id}'],
	'submenuTemplate' => "\n<ul class='XXdropdown-menu menu-content sub'>\n{items}\n</ul>\n",
	'labelTemplate' => '<div><span class="a-label">{label}</span></div>',
	'linkTemplate' => '<div><a href="{url}"><span class="a-label">{label}</span></a></div>',
	'itemOptions' => ['class' => 'dropdown-item'],
	
])?>
</div>


<nav class="navbar XXXfixed-top navbar-expand-lg navbar-dark bg-primary">
	<div class="container-fluid">
		<a class="navbar-brand" href="#">Navbar</a>
		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="MENUnavbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
		  <span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="MENUnavbarSupportedContent">
		<?=yii\widgets\Menu::widget([
			'items' =>  $array,
			'options' => ['class' => 'navbar-nav me-auto mb-2 mb-lg-0', 'role' => 'navmenu', 'aria-labelledby' => 'dropdownMenuButton_{id2}'],
			'submenuTemplate' => "\n<ul class='dropdown-menu sub'>\n{items}\n</ul>\n",
			'labelTemplate' => '<div><span class="a-label">{label}</span></div>',
			'linkTemplate' => '<div><a class="nav-link" href="{url}"><span class="a-label">{label}</span></a></div>',
			'itemOptions' => ['class' => 'nav-item'],
			
		])?>
		</div>
	</div>
</nav>

<script>
var kkk = <?=$model->getDataTree('home2', 'items', null, 'keyEncode')?>;
console.log(kkk); 
</script>

<div class="row">
	<div class="col-md-3">
		  <?=yii\jui\Menu::widget([
					'items' => $array,
					'clientOptions' => [
								'id' => 'xxxx',
								//'classes' => '',
								'disabled' => false,
								'icons' =>  [ 'submenu' => 'ui-icon-carat-1-e' ],
								//'items' => ['custom-item'],
								//'menus'
								'position' => ['my' => "left top", 'at' => 'right-5 top+5' ],
								'role' => 'menuitem',
								],
				])?>
	</div>
</div>

<div class="btn-group">
  <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    Right-aligned menu aaaaaaa
  </button>
  <ul class="dropdown-menu dropdown-menu-end">
    <li><a class="dropdown-item" href="#">Menu item</a></li>
    <li><a class="dropdown-item" href="#">Menu item</a></li>
    <li><a class="dropdown-item" href="#">Menu item</a></li>
  </ul>
</div>