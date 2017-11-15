define([
    "src/fieldsCollection"
], function ( FieldsCollection ) {

    var collectionDefinition = {
        domain:'mydomain',
        fields:[
            {name:'field1', value:1, validation:'numerical'},
            {name:'field2', value:'xyz', validation:'numerical'}
        ],
        collections:[
            {name:'mycollection', fields:['field1','field2'] }
        ]
    };

    describe("FieldsCollection", function () {

        it('should be constructable', function () {
           var c = new FieldsCollection();
           expect(c).toEqual(jasmine.any(FieldsCollection));
        });

        it('should be instantiateable with params-object', function () {
           var c = new FieldsCollection(collectionDefinition);
            var fields = c.fields;
           expect(fields.length).toEqual(2);
        });

        it('should be possible to add a field with name and params', function () {
            var c = new FieldsCollection();
            var f = c.addField('myfield', { label:'my.label' } );
            expect(f.name).toEqual('myfield');
            expect(f.label).toEqual('my.label');
        });

        it('should be possible to add a field only with params object', function () {
            var c = new FieldsCollection();
            var f = c.addField({ name:'myfield', label:'my.label' } );
            expect(f.name).toEqual('myfield');
            expect(f.label).toEqual('my.label');
        });

        it('should be possible to get all fields', function () {
            var c = new FieldsCollection();
            var f = c.addField({ name:'myfield', labe:'my.label' } );
            var fields = c.getFields();
            expect(fields.length).toEqual(1);
            expect(fields[0]).toEqual(f);
        });

        it('should return a field by name', function () {
            var c = new FieldsCollection(collectionDefinition);
            var f = c.getField('field1');
            expect(f.name).toEqual('field1');
        });

        it('should be possible to remove a field by name', function () {
            var c = new FieldsCollection(collectionDefinition);
            c.removeField('field1');
            var fields = c.getFields();
            expect(fields.length).toEqual(1);
        });

        it('should return all fields of a given collectionname', function () {
            var c = new FieldsCollection(collectionDefinition);
            var fields = c.getCollectionFields('mycollection');
            expect(fields.length).toEqual(2);
        });

        it('should validate all fields of a given collectionname', function () {
            var c = new FieldsCollection(collectionDefinition);
            var res = c.validateCollection('mycollection');
            expect(res).toBeFalsy();
        });

        it('should prepare the values of all fields als plain JS object for sending to sevrer', function () {
            var c = new FieldsCollection(collectionDefinition);
            var d = c.getPostData();
            expect(d.field1).toBeDefined();
            expect(d.field1).toEqual(1);
            expect(d.field2).toBeDefined();
            expect(d.field2).toEqual("xyz");
        });

    })

});