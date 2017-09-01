define([
    "lodash"
], function ( _ ) {

    var p = FieldDefinition.prototype;

    function FieldDefinition( params ) {
        this.table          = "";
        this.fields         = [];
        this.collections    = [];

        this._processPresetValues( params );
    }

    p.setTable = function (t) { this.table = t; }

    p.getTable = function () { return this.table; }

    p.getFields = function () { return this.fields; }

    p.addField = function ( nameOrParams, furtherParams) {
        if( _.isString( nameOrParams ) ) {
            var p = _.defaults({ 'name': nameOrParams }, furtherParams );
            this._addField( p );
        } else {
            this._addField(nameOrParams);
        }
    }

    p.removeField = function( fieldName ) {
        var f = _.find( this.fields, ['name', fieldName] );
        if(f) _.pull(this.fields,f);
    }

    p.getCollectionFields = function (collectionName) {
        var self = this;
        var c = _.find( this.collections, ['name', collectionName] );
        var f = _.map(c.fields, function(f){
            return _.find( self.fields, ['name', f] );
        });
        return f;
    }


    ////////////////////////////////////
    // IMPLEMENTATION DETAIL
    ////////////////////////////////////

    p._processPresetValues = function ( params ) {
        if( params ) {

            if( params.table ) this.setTable( params.table );
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
        if( fieldParams.name ) {
            if( !_.find( this.fields, ['name', fieldParams.name] ) ) {
                this.fields.push( fieldParams );
            } else {
                console.warn( "a filed with name "+fieldParams.name+" was already defined!" );
            }
        } else {
            throw new Error("parameters for adding a field MUST at least have a value for 'name'");
        }
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

    return FieldDefinition;

});