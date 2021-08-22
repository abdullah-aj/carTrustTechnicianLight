// @flow

import Constants from './constants';
import FormsValidations from './formsValidations';
import type {UtilInterface} from './types.flow';
import _Functions from './functions';

class Ut {
    Constants = new Constants();
    FormsValidations = new FormsValidations();
    Functions = new _Functions();
}

const Utility: UtilInterface = new Ut();
export default Utility;
