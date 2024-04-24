<?php
namespace Hwg\models;

use Hwg\components\Helper;

use yii\db\Query;


class hwgTreeBaseModel extends \yii\db\ActiveRecord
{
	
	private static $_tableName = 'menu';
	

	public function __construct($treeParams = [])
    {
		parent::__construct();	
		if (!empty($treeParams['treeTable'])) {
			$this->setTableName($treeParams['treeTable']);
		}
    }
	
	
	public static function tableName() {
		return self::$_tableName;
	}
	
	
	public static function setTableName($table) {
		self::$_tableName = $table;
	}
	
	public function loadModel($id) {
		return $this->findOne($id);
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
			'name' => Yii::t('yii-utils.hwgNav', 'Name'),
		];
	}
	
	
	public function insert($runValidation = true, $attributes = null, $parent = null)
	{
		$this->parent = $parent;
		return parent::insert(is_null($runValidation) ? true : $runValidation, $attributes);
	}
	
	
	public function insertNode($parent = null)
	{
		$this->parent = $parent;
		return parent::insert(false, null);
	}
	
	
	public function changeParent($parent)
	{
		if ($this->getIsNewRecord()) {
			$this->parent = $parent;
			return parent::insert(false, null);
		} 
		$this->parent = $parent;
		return parent::save(false, null);
	}
	
	
	public function cloneNode($branchName = '', $id = null, $newBranchName = null, $aEmptyData = [])
	{
		$array = $this->getArrayItems($branchName, $id);
			
		$i = 0; $lvl = -1; $lvlChg = false; $model; $nMax = 0; $xBranch;
		$count = (new \yii\db\Query())
			->select('max(id)')
			->from($this->tableName())
			->scalar() +1;
			
		$thisDb = $this->getDb();
		
		/* rollback khong tac dung 
		$transaction = $thisDb->beginTransaction();
		try {
		//*/
			foreach ($array as $r) {
				$lvlChg = $r['level'] !== $lvl;
				$model = $this->findOne($r['id']);
				
				if ($lvlChg) {
					if ($i === 0) {
						$par = $r['parent'];
						$count -= $r['id'];
					}
					$lvl = $r['level'];
				}
				
				$i++;
				
				$model->id = $model->id+$count;
				$par = is_null($model->parent) ? null : $model->parent+$count;
				$model->parent = $par;
				
				if ($i===1) $xBranch = $model->id;
				
				$nMax = $model->id <= $nMax ? : $model->id;
				
				$model->branch_name = !empty($newBranchName) ? $newBranchName : $model->branch_name . '-' . $xBranch;
				
				if (count($aEmptyData)) {
					foreach ($aEmptyData as $kd) {
						if (strpos(',id,name,parent,branch_name,', ','.$kd.',' ) !== false) continue;
						$model->$kd = null;
					}
				}
				
				$model->isNewRecord = true;
				if($model->save()) {
				}
			}
			$thisDb->createCommand('ALTER TABLE ' . $this->tableName() . ' AUTO_INCREMENT = :new_next', [
				':new_next' => $nMax+1
			])->execute();
		/* khong tac dung	
			$transaction->commit();
		} catch(\Exception $e) {
			$transaction->rollBack();
			throw $e;
		} catch(\Throwable $e) {
			$transaction->rollBack();
			throw $e;
		}
		//*/
	}
	

	public function getDataTree($branchName = '', $keyChild = 'children', $map = ['name' => 'text'], $keyEncode =  null)
	{
		
		$array = [];
		Helper::parseArrayTree($array, $this->getArrayItems($branchName), $map);
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
	
	
	public function getJsonTree($branchName = '', $keyEncode =  null) {
		return $this->getDataTree($branchName, '', [], $keyEncode);
	}
	
	
	public function getArrayItems($_branchName = '', $id = null)
	{
		if (!isSet($_branchName) || isSet($_branchName) && empty($_branchName)) $branchName = ['']; else $branchName = $_branchName; 
		if (!is_array($branchName) && strpos(',', $branchName) === false) $branchName = [trim($branchName,' ,')]; 
		if (is_array($branchName)) $branchName = ','.trim(implode(',',$branchName),' ,').',';

		
		$initialQuery = (new Query())->select(['(SELECT CASE 
			 WHEN NOT EXISTS (SELECT 1 FROM ' . $this->tableName() . ' WHERE parent = m.id) THEN 0
			 ELSE -1
		 END) as sta', 
		"(1) as level", 'name', 'icon' , 'id', '("tip") tooltip',  'route', 'parent', "CONCAT('.', REPLACE(name,'.','-')) path", 'itype', 'order', 'data', 'iposition', 'serverside'
		])
		->FROM (['m' => $this->tableName()])
		->Where(':id = id or :id is null and parent IS NULL and (LOCATE(CONCAT(",",branch_name,","), :branchName) > 0 or :branchName = ",,")')
		// oder in helper ->orderBy('order','name')
		;
		
		$recursiveQuery = (new Query()) -> select(['(CASE WHEN tp.sta = 0 THEN 0
				 WHEN tp.level = 1 THEN 1
				 ELSE -1
			 END) sta',
			"(tp.level+1) as level", 't.name', 't.icon' , 't.id', '("tip") tooltip',  't.route', 't.parent', "CONCAT(tp.path,'.', REPLACE(t.name,'.','-')) path", 't.itype', 't.order', 't.data', 't.iposition', 't.serverside'
			 ])
		->FROM (['tp' => 'm'])
		->innerJoin(['t' =>  $this->tableName()], 't.parent = tp.id')
		//->orderBy('order','name')
		;
   
   
		return (new Query())->addParams(['branchName' => $branchName, 'id' => $id])
				->from('m')
				->withQuery($initialQuery->union($recursiveQuery, true), 'm', true)
				->all()
				;
    }		
	
	
}