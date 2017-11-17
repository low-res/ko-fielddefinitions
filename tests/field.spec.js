define([
    "knockout",
    "src/field"
], function ( ko, Field ) {
    describe("Field", function () {

        it('should be constructable', function () {
            var f = new Field();
            expect(f).toEqual(jasmine.any(Field));
        });


        it('should determine the Field value directly from the Filed object', function () {
           var f = new Field({
               value: 42
           });
           expect(f.getFieldValue()).toEqual(42);
        });


        it('should determine the Fieldvalue from a give "source object"', function () {
            var sourceObject = {
                myproperty: 42
            }
            var f = new Field({
                valueAccessor:'myproperty'
            });
            expect(f.getFieldValue(sourceObject)).toEqual(42);
        });


        it('should determine the Fieldvalue from a give "source object" even if nested object values', function () {
            var sourceObject = {
                myproperty: {
                    subobject : {
                        prop: 303
                    }
                }
            }
            var f = new Field({
                valueAccessor:'myproperty.subobject.prop'
            });
            expect(f.getFieldValue(sourceObject)).toEqual(303);
        });


        it('should determine the Fieldvalue from a given "source object" if the valueAccessor is a function', function () {
            var sourceObject = {
                myproperty: function () {
                    return 42;
                },
                myobservable: ko.observable(303)
            }
            var f1 = new Field({
                valueAccessor:'myproperty'
            });
            expect(f1.getFieldValue(sourceObject)).toEqual(42);

            var f2 = new Field({
                valueAccessor:'myobservable'
            });
            expect(f2.getFieldValue(sourceObject)).toEqual(303);
        });


        it('should throw an error if the value could not be determined', function () {
            var sourceObject = {
                myproperty: 42
            }
            var f = new Field();
            expect( function () {
                f.getFieldValue();
            }) .toThrow();

            expect( function () {
                f.getFieldValue(sourceObject);
            }) .toThrow();
        });


        it('should have an observable that indicates if the current value is valid', function () {
           var f = new Field({
               value: "xyz"
           });
           expect(f.isValid()).toBeTruthy();
           f.validate('numerical');
            expect(f.isValid()).toBeFalsy();
        });


        it('should have an observablearray that holds the current errors', function () {
            var f = new Field({
                value: "xyz"
            });
            expect(f.isValid()).toBeTruthy();
            f.validate('numerical');
            expect(f.errors().length).toEqual(1);
        });


        it('should use valdation property for validate() if no validation is given', function () {
            var f = new Field({
                value: "xyz",
                validation:'numerical'
            });
            f.validate();
            expect(f.isValid()).toBeFalsy();
        });


        it('should validate the value of the given sourceobject if field has no value', function () {
            var f = new Field({
                valueAccessor: "field1",
            });
            var sourceObject = {
                field1:"xyz"
            }
            f.validate('numerical',sourceObject);
            expect(f.isValid()).toBeFalsy();
        });


        it('should validate the value of the given sourceobject if field has no value and validation is set', function () {
            var f = new Field({
                valueAccessor: "field1",
                validation:'numerical'
            });
            var sourceObject = {
                field1:"xyz"
            }
            f.validate(null,sourceObject);
            expect(f.isValid()).toBeFalsy();
        });


        it('should validate the value of the given sourceobject if field has no value, validation is set and sourceobject is given', function () {
            var sourceObject = {
                field1:"xyz"
            }
            var f = new Field({
                valueAccessor: "field1",
                validation:'numerical',
                source:sourceObject
            });

            f.validate();
            expect(f.isValid()).toBeFalsy();
        });


        it('should get fieldvalue if a sourceobject was given', function () {
            var sourceObject = {
                field1:"xyz"
            }

            var f = new Field({
                valueAccessor: "field1",
                source: sourceObject
            });

            expect(f.getFieldValue()).toEqual("xyz");

        });
    })
});