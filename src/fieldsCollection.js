/* */
define([
    "lodash",
    "./field"
], function ( _, Field ) {

    var p = FieldsCollection.prototype;

    function FieldsCollection( params ) {
        this.domain          = "";
        this.fields         = [];
        this.collections    = [];

        this._processPresetValues( params );
    }

    p.setDomain = function (t) { this.domain = t; }

    p.getDomain = function () { return this.domain; }

    p.getFields = function () { return this.fields; }

    p.addField = function ( nameOrParams, furtherParams) {
        var newField = null;
        var fieldParams = nameOrParams;
        if( _.isString( nameOrParams ) ) {
            fieldParams = _.defaults({ 'name': nameOrParams }, furtherParams );
        }
        newField = this._addField(fieldParams);
        return newField;
    }

    p.getField = function ( fieldName ) {
        var f = _.find( this.fields, ['name', fieldName] );
        return f;
    }

    p.removeField = function( fieldName ) {
        var f = this.getField( fieldName ) ;
        if(f) _.pull(this.fields,f);
    }

    p.getCollectionFields = function (collectionName) {
        var self = this;
        var c = _.find( this.collections, ['name', collectionName] );
        var f = [];
        if( c ) {
            if(c.fields) {
                f = _.map(c.fields, function(f){
                    return self._getFieldObject(f);
                });
            }

            if(c.rows) {
                _.forEach(c.rows, function (row) {
                    _.forEach(row, function (field) {
                        var tmpField =  self._getFieldObject(field);
                        f.push( tmpField );
                    })
                });
            }
        }
        return f;
    }

    p.getFormRows = function ( collectionName ) {
        var self = this;
        var c = _.find( this.collections, ['name', collectionName] );
        var rows = [];
        if(c) {
            if(c.fields) {
                _.forEach(c.fields, function ( fieldname ) {
                    var rowItem = self._prepareFormrowItem( fieldname );
                    if(rowItem) {
                        var tmpRow = [];
                        tmpRow.push( rowItem );
                        rows.push( tmpRow );
                    }
                });
            }

            if(c.rows) {
                _.forEach(c.rows, function (row) {
                    var tmpRow = [];
                    _.forEach(row, function (field) {
                        var rowItem = self._prepareFormrowItem( field );
                        if(rowItem) tmpRow.push( rowItem );
                    });
                    rows.push(tmpRow);
                });
            }
        }
        return rows;
    }




    ////////////////////////////////////
    // IMPLEMENTATION DETAIL
    ////////////////////////////////////

    p._processPresetValues = function ( params ) {
        if( params ) {

            if( params.domain ) this.setDomain( params.domain );
            if( params.fields ) {
                for( var f in params.fields ) {
                    this._addField( params.fields[f] );
                }
            }
            if( params.collections ) {
                for( var c in params.collections ) {
                    this._addCollection( params.collections[c] );
                }
                console.log( this.collections );
            }
        }
    }

    p._addField = function( fieldParams ) {
        var newField = null;
        if( fieldParams.name ) {
            if( !_.find( this.fields, ['name', fieldParams.name] ) ) {
                newField = new Field( fieldParams );
                this.fields.push( newField );
            } else {
                console.warn( "a filed with name "+fieldParams.name+" was already defined!" );
            }
        } else {
            throw new Error("parameters for adding a field MUST at least have a value for 'name'");
        }
        return newField;
    }

    p._addCollection = function ( collectionParams ) {
        if( collectionParams.name ) {
            if( !_.find( this.collections, ['name', collectionParams.name] ) ) {
                this.collections.push( collectionParams );
            } else {
                console.warn( "a collection with name "+collectionParams.name+" was already defined!" );
            }
        } else {
            throw new Error("parameters for adding a field MUST at least have a value for 'name'");
        }
    }

    /**
     * search for the field-object from a given string (fieldname or fieldname|with)
     * @param fieldString
     * @return {*}
     * @private
     */
    p._getFieldObject = function ( fieldString ) {
        var parts = fieldString.split('|');
        var fieldname = parts[0];
        var tmpField =  _.find( this.fields, ['name', fieldname] );
        return tmpField;
    }

    /**
     * prepare a valueobject for a given rowitemString.
     *
     * @param rowitemString
     * @return {{field: *, width: *}}
     * @private
     */
    p._prepareFormrowItem = function (rowitemString) {
        var tmpField    =  this._getFieldObject(rowitemString);
        if( tmpField ) {
            var parts       = rowitemString.split('|');
            var w           = parts.length > 1 ? parts[1]=="hidden" ? "hidden" : parts[1] : 12;
            return {type:'field', field:tmpField, width:w};
        } else {
            var parts = rowitemString.split('|');
            if( parts[0] == "divider" ) {
                return {type:'divider', label:parts[1]};
            } else {
                console.warn( "unknown item ", rowitemString );
                return null;
            }
        }
    }

    return FieldsCollection;

});