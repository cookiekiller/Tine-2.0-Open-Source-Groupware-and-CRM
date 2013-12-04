<?php
/**
 * Tine 2.0
 * 
 * @package     Tinebase
 * @subpackage  Filter
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Philipp Schüle <p.schuele@metaways.de>
 * @copyright   Copyright (c) 2013 Metaways Infosystems GmbH (http://www.metaways.de)
 * 
 */

/**
 * TempFile filter class
 * 
 * @package     Tinebase
 * @subpackage  Filter 
 */
class Tinebase_Model_TempFileFilter extends Tinebase_Model_Filter_FilterGroup
{
    /**
     * @var string application of this filter group
     */
    protected $_applicationName = 'Tinebase';
    
    /**
     * @var string name of model this filter group is designed for
     */
    protected $_modelName = 'Tinebase_Model_TempFile';
    
    /**
     * @var array filter model fieldName => definition
     */
    protected $_filterModel = array(
        'id'     => array('filter' => 'Tinebase_Model_Filter_Id'),
        'time'   => array('filter' => 'Tinebase_Model_Filter_DateTime'),
        'name'   => array('filter' => 'Tinebase_Model_Filter_Text')
    );
}
