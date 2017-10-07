/* a simple example of the module pattern
   with a few little tools.
   For a good discussion see http://www.yuiblog.com/blog/2007/06/12/module-pattern/
   c.f. http://developer.yahoo.com/yui/docs/YAHOO.js.html
*/

var ELB = function () {

    /**
     * From Doug Crockford's Remedial Javascript
     * http://javascript.crockford.com/remedial.html
     */
    if (!String.prototype.supplant) {
        String.prototype.supplant = function (o) {
            return this.replace(/\{([^{}]*)\}/g,
                function (a, b) {
                    var r = o[b];
                    return typeof r === 'string' || typeof r === 'number' ? r : a;
                }
            );
        };
    }
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
        };
    }

    /* A minimal console if a real one is not available */
    if (!console) {
        alert('no console');
        console = function () {
            var pubblico = {

                /**
                 * Alert a user to something untoward happening.
                 * Redefine this to function(){} to disable in production?
                 * @param theCondition expected to be true
                 * @param theMessage to display when theCondition is not met.
                 */
                assert: function(theCondition, theMessage) {
                    if (!theCondition) {
                        //alert("ASSERTION FAILED: " + theMessage);
                        throw("ASSERTION FAILED: " + theMessage);
                    }
                },

                log: function (theMessage) {
                    alert(theMessage);
                },
                info: function (theMessage) {
                    alert('(i) ' + theMessage);
                },
                warn: function (theMessage) {
                    alert('(!) ' + theMessage);
                },
                error: function (theMessage) {
                    alert('(x) ' + theMessage);
                }

            };
            return pubblico;
        }();
    }

    /* Private Variables and Functions */

    /* Public Variables and Functions */
    var pubblico = {

        /**
         * Create a name space within ELB.
         * Dotted names can be used to create a hierarcy of name spaces.
         * @param [String] a list of namespaces to create.
         * @return the last namespace created.
         */
        namespace : function() {
            var a=arguments, o=null, i, j, d;
            for (i = 0; i < a.length; i++) {
                d = ("" + a[i]).split(".");
                o = ELB;
                 for (j = (d[0] === "ELB") ? 1 : 0; j < d.length; j++) {
                    o[d[j]] = o[d[j]] || {};
                    o = o[d[j]];
                }
            }
            return o;
        },

        /**
         * This is just for debugging.
         * It shows an object's value in the console.
         */
        showObject : function (theObject) {
            var msg = "object:";
            for (var x in theObject) {
                if (theObject.hasOwnProperty(x)) {
                  msg += "\n" + x + ": ";
                  if (typeof theObject[x] === 'object') {
                      msg += "object";
                  }
                  else {
                      msg += theObject[x];
                  }
                }
            }
            console.log(msg);
        }

    };

    return pubblico;

}();
