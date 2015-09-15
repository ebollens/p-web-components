/**
 * This is a messy all-in-one example of the hierarchical form definitions,
 * intended to demonstrate why HTML Imports make this so much cleaner.
 */

(function(){
    
    var processableFields = ['input', 'textarea', 'select', 'fieldset[is="control-group"]'],
        processableSelector = processableFields.join(', '),
        exclusionSelector = processableFields
            .map(function(f){ return 'fieldset[is="control-group"] '+f; })
            .join(', ');
    
    var HierarchicalGroupValueProperties = {
        value: {
            get: function(){
                
                var values = {}

                $(this).find(processableSelector)
                       .not($(this).find(exclusionSelector))
                       .each(function(){
                    var name = this.name;
                    if(name && this.value !== undefined){
                        values[name] = this.value;
                    }
                });

                return values;
            },
            set: function(value){
                
                $(this).find(processableSelector)
                       .not($(this).find(exclusionSelector))
                       .each(function(){
                    var name = this.name;
                    if(value[name])
                        this.value = value[name]
                });
                
            }
        }
    }
    
    window.HierarchicalFormElement = document.registerElement('hierarchical-form', {
        extends: 'form',
        prototype: Object.create(HTMLFormElement.prototype, $.extend({}, HierarchicalGroupValueProperties, {
            attachedCallback: {
                value: function(){
                    var form = this;
                    $(this).submit(function(e){
                        e.preventDefault();
                        $.ajax({
                            url: $(form).attr('action') ? $(form).attr('action') : '#',
                            method: $(form).attr('method') ? $(form).attr('method') : 'GET',
                            data: JSON.stringify(form.value),
                            contentType: 'application/json; charset=utf-8',
                            success: function(){ 
                                if($(form).attr('data-success'))
                                    window.location = $(form).attr('data-success'); 
                            },
                            error: function(){ 
                                console.log(arguments)
                                if($(form).attr('data-error'))
                                    window.location = $(form).attr('data-error'); 
                            }
                        })
                    })
                }
            }
        }))
    });

    window.ControlGroupElement = document.registerElement('control-group', {
        extends: 'fieldset',
        prototype: Object.create(HTMLFieldSetElement.prototype, $.extend({}, HierarchicalGroupValueProperties, {
            name: {
                get: function(){
                    return $(this).attr('data-name');
                },
                set: function(value){
                    $(this).attr('data-name', value);
                }
            }
        }))
    });

    window.InputTypeLatElement = document.registerElement('type-lat', {
        extends: 'input',
        prototype: Object.create(HTMLInputElement.prototype, $.extend({}, {
            attachedCallback: {
                value: function(){
                    var self = this;
                    self.type = 'number';
                    self.min = -90;
                    self.max = 90;
                    self.step = 'any';
                    navigator.geolocation.getCurrentPosition(function(position){
                        self.value = position.coords.latitude;
                    });
                }
            }
        }))
    });

    window.InputTypeLngElement = document.registerElement('type-lng', {
        extends: 'input',
        prototype: Object.create(HTMLInputElement.prototype, $.extend({}, {
            attachedCallback: {
                value: function(){
                    var self = this;
                    self.type = 'number';
                    self.min = -180;
                    self.max = 180;
                    self.step = 'any';
                    navigator.geolocation.getCurrentPosition(function(position){
                        self.value = position.coords.longitude;
                    });
                }
            }
        }))
    });
    
    window.ControlGroupElement = document.registerElement('multi-group-control', {
        extends: 'fieldset',
        prototype: Object.create(HTMLDivElement.prototype, {
            name: dataName,
            attachedCallback: {
                value: function(){
                    var control = this,
                        shadowContainer = document.createElement('div'),
                        shadow = shadowContainer.createShadowRoot();

                    $(this).append(shadowContainer);

                    this.template = $(this).children('template').get()[0];
                    this.container = shadow;
                    this.$button = $('<button>').attr('type', 'button')
                                 .text('+')
                                 .click(function(){
                                     control.addControlGroup();
                                  })
                                 .appendTo(this);
                }
            },
            addControlGroup: {
                value: function(value){
                    var clone = document.importNode(this.template.content, true),
                        $newGroup = $('<fieldset is="control-group">');

                    $newGroup.append(clone);
                    this.container.appendChild($newGroup.get()[0]);

                    if(value !== undefined)
                        $newGroup.get()[0].value = value;
                }
            },
            value: {
                get: function(){
                    var groups = [];
                    $(this.container).children().each(function(){
                        groups.push(this.value);
                    });
                    return groups;
                },
                set: function(values){
                    values.forEach(function(value){
                        this.addControlGroup(value);
                    }, this);
                }
            }
        })
    });
    
})()