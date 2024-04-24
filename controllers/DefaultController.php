<?php

namespace Hwg\controllers;

use Yii;

/**
 * DefaultController
 *
 * @author Misbahul D Munir <misbahuldmunir@gmail.com>
 * @since 1.0
 */
class DefaultController extends \yii\web\Controller
{

    /**
     * Action index
     */
    public function actionIndex($page = 'README.md')
    {
        return $this->render('index', ['page' => $page]);
    }
}
