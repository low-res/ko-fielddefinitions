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