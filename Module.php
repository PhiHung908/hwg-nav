<?php
namespace Hwg;

use Yii;

class Module extends \yii\base\Module
{
	public $defaultRoute = 'site';
	
	public $navbar;
	
	public function init()
    {
         parent::init();
        if (!isset(Yii::$app->i18n->translations['yii-utils.hwgNav'])) {
            Yii::$app->i18n->translations['yii-utils.hwgNav'] = [
                'class' => 'yii\i18n\PhpMessageSource',
                'sourceLanguage' => 'en',
                'basePath' => '@Hwg/messages',
				'forceTranslation' => true,
            ];
        }

        //user did not define the Navbar?
        if ($this->navbar === null && Yii::$app instanceof \yii\web\Application) {
            $this->navbar = [
                ['label' => Yii::t('yii-utils.hwgNav', 'Help'), 'url' => ['default/index']],
                ['label' => Yii::t('yii-utils.hwgNav', 'Application'), 'url' => Yii::$app->homeUrl],
            ];
        }
        if (Yii::$container->has('yii\jui\JuiAsset')) {
            Yii::$container->set('hwgJuiAsset', 'yii\jui\JuiAsset');
        }
		if (Yii::$container->has('yii\bootstrap5\BootstrapPluginAsset')) {
            Yii::$container->set('hwgBootstrapPluginAsset', 'yii\bootstrap5\BootstrapPluginAsset');
        }
		if (Yii::$container->has('yii\bootstrap5\BootstrapIconAsset')) {
            Yii::$container->set('hwgBootstrapIconAsset', 'yii\bootstrap5\BootstrapIconAsset');
        }
	}
}
