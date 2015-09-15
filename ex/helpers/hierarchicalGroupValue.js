/**
 * ES6 module that defines the setter and getter for elements that contain
 * sub-controls, such as the fieldset[is="control-group"] and the 
 * form[is="hierarchical-control"]. These getters return an object of key-value
 * pairs where the key is the name of the control and the value is it's value, 
 * which may be elementary (in the case of things like input, textarea and 
 * select) or complex (such as an object of sub-controls from 
 * fieldset[is="control-group"] or array from of instances of the control group
 * from fieldset[is="multi-value-control"]).
 */

var processableFields = ['input', 'textarea', 'select', 'fieldset[is="control-group"]','fieldset[is="multi-group-control"]'],
    processableSelector = processableFields.join(', '),
    exclusionSelector = processableFields
        .map(function(f){ return 'fieldset[is="control-group"] '+f+', fieldset[is="multi-group-control"] '+f; })
        .join(', ');

export function get(){

    var values = {}

    $(this).find(processableSelector) // get elements that have a value we want to capture
           .not($(this).find(exclusionSelector)) // don't take elements contained within a structure that we're also capturing
           .each(function(){
        var name = this.name;
        if(name && this.value !== undefined){
            values[name] = this.value;
        }
    });

    return values;
};

export function set(value){

    $(this).find(processableSelector) // get elements that have a value we want to capture
           .not($(this).find(exclusionSelector)) // don't take elements contained within a structure that we're also capturing
           .each(function(){
        var name = this.name;
        if(value[name])
            this.value = value[name]
    });

};