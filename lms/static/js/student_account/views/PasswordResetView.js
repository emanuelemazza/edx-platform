var edx = edx || {};

(function($, _, Backbone, gettext) {
    'use strict';

    edx.student = edx.student || {};
    edx.student.account = edx.student.account || {};

    edx.student.account.PasswordResetView = Backbone.View.extend({
        tagName: 'form',

        el: '#password-reset-wrapper',

        tpl: '#password_reset-tpl',

        fieldTpl: $('#form_field-tpl').html(),

        events: {
            'click .js-reset': 'submitForm'
        },

        errors: [],

        mode: {},

        $form: {},

        initialize: function() {
            var fields = this.buildForm([{
                label: 'E-mail',
                instructions: 'This is the e-mail address you used to register with edX',
                name: 'email',
                required: true,
                type: 'email',
                restrictions: []
            }]);

            this.tpl = $(this.tpl).html();
            this.initModel();
            this.render( fields );
        },

        // Renders the form.
        render: function( html ) {
            var fields = html || '';

            $(this.el).html( _.template( this.tpl, {
                fields: fields
            }));

            this.postRender();

            return this;
        },

        postRender: function() {
            var $container = $(this.el);

            this.$form = $container.find('form');
            this.$errors = $container.find('.error-msg');

            this.listenTo( this.model, 'success', this.resetComplete) ;
        },

        initModel: function() {
            this.model = new edx.student.account.PasswordResetModel();

            this.listenTo( this.model, 'error', function( error ) {
                console.log(error.status, ' error: ', error.responseText);
            });
        },

        buildForm: function( data ) {
            var html = [],
                i,
                len = data.length,
                fieldTpl = this.fieldTpl;

            for ( i=0; i<len; i++ ) {
                html.push( _.template( fieldTpl, $.extend( data[i], {
                    form: 'reset-password'
                }) ) );
            }

            return html.join('');
        },

        getFormData: function() {

            var obj = {},
                $form = this.$form,
                elements = $form[0].elements,
                i,
                len = elements.length,
                $el,
                key = '',
                errors = [];

            for ( i=0; i<len; i++ ) {

                $el = $( elements[i] );
                key = $el.attr('name') || false;

                if ( key ) {
                    if ( this.validate( elements[i] ) ) {
                        obj[key] = $el.attr('type') === 'checkbox' ? $el.is(':checked') : $el.val();
                        $el.css('border', '1px solid #ccc');
                    } else {
                        errors.push( key );
                        $el.css('border', '2px solid red');
                    }
                }
            }

            this.errors = errors;

            return obj;
        },

        resetComplete: function() {
            var $el = $(this.el);

            $el.find('#password-reset-form').addClass('hidden');
            $el.find('.js-reset-success').removeClass('hidden');
        },

        submitForm: function( event ) {
            var data = this.getFormData();

            event.preventDefault();

            if ( !this.errors.length ) {
                console.log('save me');
                this.model.set( data );
                this.model.save();
                this.toggleErrorMsg( false );
            } else {
                console.log('here are the errors ', this.errors);
                this.toggleErrorMsg( true );
            }
        },

        toggleErrorMsg: function( show ) {
            if ( show ) {
                this.$errors.removeClass('hidden');
            } else {
                this.$errors.addClass('hidden');
            }
        },

        validate: function( $el ) {
            return edx.utils.validate( $el );
        }
    });

})(jQuery, _, Backbone, gettext);