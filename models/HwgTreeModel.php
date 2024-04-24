<?php
namespace Hwg\models;

use Yii;
use yii\base\Model;
use yii\db\Query;
use yii\helpers\Json; 

use Hwg\components\Helper;

class HwgTreeModel extends \yii\db\ActiveRecord
{
	public $kkk = 'test detail';
	
	public function __construct($item = null, $config = [])
    {
        //...
        parent::__construct($config);
    }


	public function rules()
    {
        return [
            [['name'], 'required'],
        ];
    }
	
	
	public function attributeLabels()
    {
        return [
			'id' => 'ID',
			'name' => 'ho va ten',
		];
	}
	
	//public $admin;

	public function getDataTree00($type = '', $name = '', $retMenu = false, $endcodeJsonKey = null /*'items'*/, $markChildren = 'children')
	{
		$array = [];
		Helper::parseArrayTree($array, $this->getArrayItems($type, $name));
		if ($retMenu) {
			Helper::menuChild($array, $markChildren);
		}
	/*	
		//extract($array, EXTR_PREFIX_SAME, "hwg_");
		extract($array, EXTR_REFS, 'hwg_');
		  foreach ($array as $key => $value) {
			  if ( !is_string($key) || str_contains($key,'/') ) continue;// || $key !== 'admin') continue;
			  $k = str_replace('/','',$key);
			  $this->$key = $$key;
			  // Do: $this->key = $key; if $key is not a string.
 //break;
		  }
//var_dump($this->admin);	
*/	
		if (!empty($endcodeJsonKey)) {
			return Json::htmlEncode(
				[$endcodeJsonKey => $array ]
			);
		}
		return $array;
	}
	
	
	public function getDataTree($type='', $branchName = '', $keyChild = 'children', $map = ['name' => 'text'], $keyEncode =  null)
	{
		
		$array = [];
		Helper::parseArrayTree($array, $this->getArrayItems($type, $branchName), $map);
		if (!empty($keyChild)) {
			Helper::menuChild($array, $keyChild);
		}
		
		if (isSet($keyEncode)) {
			return Json::htmlEncode([
				$keyEncode => $array 
			]);
		}
		return $array;
	}
	
	
	
	public function getArrayItems444($branch = '') {
		$whereType = ''; $_branch = $branch;
		if ($branch == 1 || $branch == 2) {
			if ($branch == 1) {
				$_branch = 'where type = 1';
				$whereType = 'where type=1';// or sta not in (0,-1)';
			} else {
				$_branch = 'where type = 2';
				$whereType = 'where type=2';
			}
		} 
		$command = (new Query())->withQuery(str_replace('#WHERE_TYPE#',' '.$whereType.' ',str_replace('#WHERE_BRANCH#', ' '.$_branch.' ', "
		WITH RECURSIVE m (sta, id, name, parent,  lvl, path, `type`, description, rule_name, `data`, created_at, updated_at) AS (
 SELECT CASE 
	     WHEN NOT EXISTS (SELECT 1 FROM auth_item_child WHERE parent = i.name) THEN 0
	     ELSE 1
	 END sta, 
	NAME id, i.name , REPEAT(' ',64) parent,  1 lvl, CONCAT('.', NAME) path,
	i.type, i.description, i.rule_name, i.data, i.created_at, i.updated_at
 FROM auth_item i 
 #WHERE_zBRANCH#
 where name='root'
  UNION ALL
 SELECT 0, 'id',  child, parent, 1, '',
	0, 'de', NULL, NULL, NULL, NULL
 FROM  auth_item_child a
  LEFT JOIN auth_item b ON b.name = a.parent
 WHERE NAME = 'root' 
 
 UNION ALL
 SELECT CASE WHEN tp.sta = 0 THEN 0
	     WHEN tp.lvl = 1 THEN 1
	     ELSE -1
	 END sta, CONCAT(tp.id,'_'), t.child,  t.parent, tp.lvl+1, CONCAT(tp.path, '.', t.child) path,
	 tp.type, tp.description, tp.rule_name, tp.data, tp.created_at, tp.updated_at
 FROM m tp
   JOIN auth_item_child t ON t.parent = tp.name 
)
SELECT * FROM m
#WHERE_zTYPE#
 ORDER BY path
		")), 'mm', false)->select('*')->from('mm')->createCommand();

		
		// show the SQL statement
		//echo $command->sql;
		// show the parameters to be bound
		//print_r($command->params);
		// returns all rows of the query result
		//$rows = $command->queryAll();
		//return $rows;
		return $command->queryAll();
	}
	
 
	 
	
	public function getArrayItems($type = '', $branchName = '') {
		 
		 /*
		if ($type == '' && isSet($_GET['t'])) $type = $_GET['t'];  
		if ($branchName == '' && isSet($_GET['n'])) $branchName = $_GET['n'];
		*/
		
		$initialQuery = (new \yii\db\Query())->select(['(SELECT CASE 
	     WHEN NOT EXISTS (SELECT 1 FROM auth_item_child WHERE parent = name) THEN 0
	     ELSE 1
	 END) as sta', 
	'name id', 'name' , "REPEAT(' ',64) as parent",  "(1) as lvl", "CONCAT('.', name) path",
	'type', 'description', 'rule_name', 'data', 'created_at', 'updated_at']) 
	->FROM (['m' => 'auth_item']) 
	-> where(['or',['and',['or', 'type=:type',':type=""'],':name=""'],':name=name'])
	->orderBy('name');
	
	/*
	$initialQuery->addParams(['type' => $type, 'name' => $branchName]);
	
$command = $initialQuery->createCommand();
		echo $command->sql;
	return $command->queryAll();
	*/
	
	$initQ2 = (new \yii\db\Query()) -> select(['(0) sta', "name id", 'child', 'parent', '(1) lvl', "CONCAT('.', parent,'.',child) path",
				'type', 'description', 'rule_name', 'data', 'created_at', 'updated_at'])
	->from(['a' => 'auth_item_child'])
	->leftJoin(['b' => 'auth_item'], 'b.name = a.parent')
	//-> where(['and',['or', 'type=:type',':type=""'],['or', 'name=:name', ':name=""', ':type!=""']])
	//-> where(['or', 'name=:name', ':name=""'])
	//-> where(['or',['and',['or', 'type=:type',':type=""'],':name=""'],':name<>""'])
	;
 $recursiveQuery = (new \yii\db\Query()) -> select(['(CASE WHEN tp.sta = 0 THEN 0
	     WHEN tp.lvl = 1 THEN 1
	     ELSE -1
	 END) sta', "CONCAT(tp.id,'_') id", 't.child as name' ,  't.parent', '(tp.lvl+1) lvl', "CONCAT(tp.path, '.', t.child) path",
	 "tp.type", "tp.description", "tp.rule_name", "tp.data", "tp.created_at", "tp.updated_at"
	 ])-> FROM (['tp' => 'm'])
   -> innerJoin(['t' =>  'auth_item_child'], 't.parent = tp.name')
   -> where(['or', 'type=:type',':type=""'])
   ;
   
   
   $mainQuery = (new \yii\db\Query())
			->from('m')
			->withQuery($initialQuery->union($initQ2, true)->union($recursiveQuery, true), 'm', true);
    
		
			$initialQuery->addParams(['type' => $type, 'name' => $branchName]);

		
		return $mainQuery->all();
	}		
	
	
}