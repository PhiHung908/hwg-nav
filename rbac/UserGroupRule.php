<?php
namespace Hwg\rbac;

use Yii;
use yii\rbac\Rule;

/**
 * Checks if user group matches
 */
class UserGroupRule extends Rule
{
    public $name = 'userGroup';

    public function execute($user, $item, $params)
    {
        if (!Yii::$app->user->isGuest) {
            $group = Yii::$app->user->identity->group;
            if ($item->name === 'admin') {
                return $group == 'AdminRole';
            } elseif ($item->name === 'author') {
                return $group == 'AdminRole' || $group == 'AuthorRole';
            }
        }
        return false;
    }
}
