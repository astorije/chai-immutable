import {Utils} from 'chai/lib/Utils';
import {} from './Assertion';

// chai-immutable exports a single function (is a callable? module).
//
// The namespace+function combo enable the use of "import * as X from chai-immutable" and "use(X)" in chai.
declare function initialize(chai: any,  utils: Utils) : void;
declare namespace initialize {
}

export = initialize;
