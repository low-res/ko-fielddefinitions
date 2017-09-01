define([
    "src/fieldDefinition"
], function (FieldDefinition) {

    describe("Fielddefinition", function(){

        it("should be instantiateable", function(){
            var d = new FieldDefinition();
            expect(d).toEqual(jasmine.any(FieldDefinition));
        });


        it("should be constructable with params", function(){
            var params = {
                table: "users",
                fields: [
                    {
                        name:           "etd",
                        type:           "date",
                        label:          "my Formlabel",
                        outputFormat:   "date"
                    },
                    {
                        name:           "description",
                        type:           "text",
                        label:          "my Formlabel"
                    }
                ],
                collections: [
                    {
                        name: "editform",
                        fields: ["etd","description"]
                    }
                ]
            }
            var d = new FieldDefinition( params );
            expect( d.getTable() ).toEqual("users");
            expect( d.getFields().length ).toEqual(2);
        });


        it("should not accept fielddefinitions without name", function(){
            var params = {
                table: "users",
                fields: [
                    {
                        type:           "date",
                        label:          "my Formlabel",
                        outputFormat:   "date"
                    },
                    {
                        name:           "description",
                        type:           "text",
                        label:          "my Formlabel"
                    }
                ],
                collections: [
                    {
                        name: "editform",
                        fields: ["etd","description"]
                    }
                ]
            }

            expect( function(){
                var d = new FieldDefinition( params );
            }).toThrow();
        });


        it("should be possible to add a field", function() {
            var d = new FieldDefinition();
            d.addField( "name", { type:"text", label:"my label"  } );
            expect( d.getFields().length ).toEqual(1);
        });


        it("should be possible to add field with only params", function(){
            var d = new FieldDefinition();
            d.addField( { name:"xxx", type:"text", label:"my label"  } );
            expect( d.getFields().length ).toEqual(1);
        });


        it("should not be possible to add field without name", function(){
            var d = new FieldDefinition();
            expect( function(){
                d.addField( { type:"text", label:"my label"  } );
            }).toThrow();
            expect( d.getFields().length ).toEqual(0);
        });

        it("should be possible to remove a field", function () {
            var d = new FieldDefinition();
            d.addField( { name:"xxx", type:"text", label:"my label"  } );
            d.addField( { name:"yyy", type:"text", label:"my label"  } );
            expect( d.getFields().length ).toEqual(2);
            d.removeField("xxx");
            expect( d.getFields().length ).toEqual(1);
        });

        it("should be possible to get a fieldcollection", function () {
            var f1 = {
                name:           "etd",
                type:           "date",
                label:          "my Formlabel",
                outputFormat:   "date"
            };
            var params = {
                table: "users",
                fields: [
                    f1,
                    {
                        name:           "description",
                        type:           "text",
                        label:          "my Formlabel"
                    }
                ],
                collections: [
                    {
                        name: "editform",
                        fields: ["etd","description"]
                    }
                ]
            }
            var d = new FieldDefinition( params );
            var col = d.getCollectionFields( "editform" );
            expect(col.length).toEqual(2);
            expect(col[0]).toEqual(f1);
        });

    });

});