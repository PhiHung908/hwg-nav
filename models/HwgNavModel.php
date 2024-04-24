<?php
namespace Hwg\models;

use yii\db\Query;


class hwgNavModel extends hwgTreeBaseModel
{
	
	public function __construct($treeParams = [])
    {
        parent::__construct($treeParams);
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
}