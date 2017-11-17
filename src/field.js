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
        this.isValid    = ko.observable(true);
        this.errors     = ko.observableArray();
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


    p._handleValueAccessor = function ( sourceObject ) {
        if(!this.valueAccessor) throw( new Error("Field must have a valueAccessor defined before trying to get value of a source object") );

        var v = _.get(sourceObject, this.valueAccessor);

        if(ko.isObservable(v)) v = v();
        else if( _.isFunction(v) ) v = v();

        if(v==undefined) {
            if(_.isFunction(this.valueAccessor)) v = this.valueAccessor(sourceObject);
        }

        if(v==undefined) console.warn("Unable to extrac value of field ", this.valueAccessor, sourceObject);

        return v;
    }


    p.validate = function( validation, sourceObject ) {
        this.errors.removeAll();
        var v = validation || this.validation;

        var res = Validator.validate( this.getFieldValue(sourceObject), v );
        this.isValid( res );
        this.errors( Validator.getLastValidationErrors() );
        this.errors.valueHasMutated();
        return res;
    }


    // add a native attribute for every given param
    p._processPresetValues = function ( params ) {
        if( params ) {
            for( var p in params ) {
                this[p] = params[p];
            }
        }
    }


    return Field;

});