ko-fielddefinitions

formal description for parameters of single form fields. It is intended for use with 
ko-formengine and ko.sortabletable.

### Definition
`
<pre>
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
</pre>
`


A field can have several properties. Most important are:

### Field
`
<pre>
{
    name:"uid",
    label:"my label",
    type:"boolean",
    output_format:"float",
    ...
}
</pre>
`

name:           Name of the field

label:          the label (e.g. in forms)

type: datatype: boolean, text, relation, string, number

output_format:  how to display the fieldvalue

value_accessor: optional name of function (or function-object) that returns the fieldvalue

options:        if type is "relation" options hold the options the user can choose from

validation:     function that returns true/false

### Collection

A collection is any combination of defined field. A collection typically defines what to display in a form for example.

To get the fields of an collection use:

`d.getCollectionFields("editform")`