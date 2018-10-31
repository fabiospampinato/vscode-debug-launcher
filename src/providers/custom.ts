
/* IMPORT */

import * as _ from 'lodash';

/* CUSTOM */

function custom ( configuration ) {

  if ( !_.isPlainObject ( configuration ) ) return;

  return {
    provider: 'custom',
    configuration
  };

}

/* EXPORT */

export default custom;
