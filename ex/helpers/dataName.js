/**
 * ES6 module that maps the data-name element attribute to the name property on
 * the element object.
 */

export function get(){
    return $(this).attr('data-name');
};

export function set(value){
    $(this).attr('data-name', value);
};