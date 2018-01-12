/**
 * Field
 *
 * a definition of an object property. containing
 * information and methods about validation, valueAcces
 * and outputformat of the value of the described
 * property.
 *
 */

define([
    "knockout",
    "lodash",
    "low-res/validator",
    "low-res/formater"
], function( ko, _, Validator, Formater ){
    var p = Field.prototype;

    function Field( params ) {
        this._processPresetValues(params);

        if( !this.validation ) this.validation = ""; // make sure every field has a validation property
    }


    p.getFieldValue = function ( sourceObject ) {
        if( sourceObject ) {
            return this._handleValueAccessor( sourceObject );
        } else if(this.value) {
            return ko.utils.unwrapObservable(this.value);
        } else if( this.source ) {
            return this._handleValueAccessor( this.source );
        } else {
            throw(new Error("Field has no value property defined. If valueAccessor was meant, no sourceObject is set or was given."));
        }
    }


    p.getFormatedFieldValue = function ( sourceObject ) {
        var v = this.getFieldValue( sourceObject );
        if( this.outputFormat ) {
            v = Formater.formatValueToType(v, this.outputFormat);
        }
        return v;
    }


    /**
     * format value for export. e.g. CSV
     * @param sourceObject
     */
    p.getFieldValueForExport = function ( sourceObject ) {
        var v = this.getFormatedFieldValue( sourceObject );
        if (!_.isUndefined(this.exportFormat)) {
            v = this.getFieldValue(sourceObject);
            v = Formater.formatValueToType(v, this.exportFormat);
        }
        if(v==null || v=="null" || v==undefined) v="";
        return v;
    }


    p._handleValueAccessor = function ( sourceObject ) {
        if(!this.valueAccessor) throw( new Error("Field ("+this.name+") must have a valueAccessor defined before trying to get value of a source object") );

        var v = _.get(sourceObject, this.valueAccessor);

        if(ko.isObservable(v)) v = v();
        else if( _.isFunction(v) ) v = v();

        if(v==undefined) {
            if(_.isFunction(this.valueAccessor)) v = this.valueAccessor(sourceObject);
        }

        if(v==undefined) console.warn("Unable to extrac value of field ", this.valueAccessor, sourceObject);

        return v;
    }


    // add a native attribute for every given param
    p._processPresetValues = function ( params ) {
        if( params ) {
            for( var p in params ) {
                this[p] = params[p];
            }
        }

        if(!this.name) {
            console.warn( "The fielddefinition lacks a name property! The name is needed in several conditions, so you better make sure to set one! ", params );
        }
    }


    return Field;

});