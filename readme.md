ko-fielddefinitions

formal description of for parameters of single form fields. It is intended for use with 
ko-formengine and ko.sortabletable.

A field can have several properties. Most important are:

Field
`
{
    name:"uid",
    label:"my label",
    type:"boolean",
    output_format:"float",
    ...
}
`

name:           Name of the field

label:          the label (e.g. in forms)

type: datatype: boolean, text, relation, string, number

output_format:  how to display the fieldvalue

value_accessor: optional name of function (or function-object) that returns the fieldvalue

options:        if type is "relation" options hold the options the user can choose from
