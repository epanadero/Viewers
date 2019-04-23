import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';
import { TAPi18n } from 'meteor/tap:i18n';


Template.measureFlow.onCreated(() => {
    const instance = Template.instance();

    instance.value = instance.data.currentValue || '';

    instance.state = new ReactiveVar('closed');
    instance.description = new ReactiveVar(instance.data.currentDescription || '');
    instance.descriptionEdit = new ReactiveVar(false);

    const items = [
        TAPi18n.__('organ.abdomen'),
        TAPi18n.__('organ.adrenal'),
        TAPi18n.__('organ.bladder'),
        TAPi18n.__('organ.bone'),
        TAPi18n.__('organ.brain'),
        TAPi18n.__('organ.breast'),
        TAPi18n.__('organ.colon'),
        TAPi18n.__('organ.esophagus'),
        TAPi18n.__('organ.extremities'),
        TAPi18n.__('organ.gallbladder'),
        TAPi18n.__('organ.kidney'),
        TAPi18n.__('organ.liver'),
        TAPi18n.__('organ.lung'),
        TAPi18n.__('organ.lymph'),
        TAPi18n.__('organ.mediastinum'),
        TAPi18n.__('organ.muscle'),
        TAPi18n.__('organ.neck'),
        TAPi18n.__('organ.softTissue'),
        TAPi18n.__('organ.ovary'),
        TAPi18n.__('organ.pancreas'),
        TAPi18n.__('organ.pelvis'),
        TAPi18n.__('organ.peritoneum'),
        TAPi18n.__('organ.prostate'),
        TAPi18n.__('organ.retroperitoneum'),
        TAPi18n.__('organ.bowel'),
        TAPi18n.__('organ.spleen'),
        TAPi18n.__('organ.stomach'),
        TAPi18n.__('organ.subcutaneous')

    ];

    instance.items = [];
    _.each(items, item => {
        instance.items.push({
            label: item,
            value: item
        });
    });

    const commonItems = [
        'Abdomen/Chest Wall',
        'Lung',
        'Lymph Node',
        'Liver',
        'Mediastinum/Hilum',
        'Pelvis',
        'Peritoneum/Omentum',
        'Retroperitoneum'
    ];

    instance.commonItems = [];
    _.each(commonItems, item => {
        instance.commonItems.push({
            label: item,
            value: item
        });
    });
});

Template.measureFlow.onRendered(() => {
    const instance = Template.instance();
    const $measureFlow = instance.$('.measure-flow');
    const $btnAdd = instance.$('.btn-add');

    // Make the measure flow bounded by the window borders
    $measureFlow.bounded();

    $btnAdd.focus();

    if (instance.data.autoClick) {
        $btnAdd.trigger('click', {
            clientX: instance.data.position.x,
            clientY: instance.data.position.Y
        });
    } else {
        if (instance.data.direction) {
            const direction = instance.data.direction;
            let { left, top } = $measureFlow.offset();

            left = direction.x === -1 ? left -= $btnAdd.outerWidth() : left;
            top = direction.y === -1 ? top -= $btnAdd.outerHeight() : top;

            const distance = 5;
            left += direction.x * distance;
            top += direction.y * distance;

            $measureFlow.css({
                left,
                top
            });
        }

        // Display the button after reposition it
        $btnAdd.css('opacity', 1);
    }
});

Template.measureFlow.events({
    'click, mousedown, mouseup'(event, instance) {
        event.stopPropagation();
    },

    'click .measure-flow .btn-add, click .measure-flow .btn-rename'(event, instance) {
        const $measureFlow = instance.$('.measure-flow');

        // Set the open state for the component
        instance.state.set('open');

        // Wait template rerender before rendering the selectTree
        Tracker.afterFlush(() => {
            // Get the click  or rendering position
            let position;
            if (_.isUndefined(event.clientX)) {
                position = {
                    left: instance.data.position.x,
                    top: instance.data.position.y,
                };
            } else {
                position = {
                    left: event.clientX,
                    top: event.clientY,
                };
            }

            // Define the data for selectTreeComponent
            const data = {
                key: 'label',
                items: instance.items,
                commonItems: instance.commonItems,
                hideCommon: instance.data.hideCommon,
                label: 'Assign label',
                searchPlaceholder: 'Search labels',
                // storageKey: 'measureLabelCommon',
                threeColumns: instance.data.threeColumns,
                position
            };

            // Define in which element the selectTree will be rendered in
            const parentElement = $measureFlow[0];

            // Render the selectTree element
            instance.selectTreeView = Blaze.renderWithData(Template.selectTree, data, parentElement);

            // Focus the measure flow to handle closing
            $measureFlow.focus();
        });
    },

    'click .measure-flow .btn-description'(event, instance) {
        // Fade out the action buttons
        instance.$('.measure-flow .actions').addClass('fadeOut');

        // Set the description edit mode
        instance.descriptionEdit.set(true);

        // Wait for DOM re-rendering, resize and focus the description textarea
        Tracker.afterFlush(() => {
            const $textarea = instance.$('textarea');
            $textarea.trigger('input').focus().select();
        });
    },

    'input textarea, change textarea'(event, instance) {
        const element = event.currentTarget;
        const $element = $(element);

        // Resize the textarea based on its content length
        $element.css('max-height', 0);
        $element.height(element.scrollHeight);
        $element.css('max-height', '');

        // Reposition the measure flow if needed
        const $measureFlow = instance.$('.measure-flow');
        $element.one('transitionend', () => $measureFlow.trigger('spatialChanged'));
    },

    'keydown textarea'(event, instance) {
        // Unset the description edit mode if ENTER or ESC was pressed
        if (event.which === 13 || event.which === 27) {
            instance.$('.measure-flow .actions').removeClass('fadeOut');
            instance.descriptionEdit.set(false);
            instance.$('.measure-flow').focus();
        }

        // Keep the current description if ENTER was pressed
        if (event.which === 13) {
            event.preventDefault();
            instance.description.set($(event.currentTarget).val());
        }
    },

    'blur textarea'(event, instance) {
        instance.$('.measure-flow .actions').removeClass('fadeOut');
        instance.descriptionEdit.set(false);
        instance.description.set($(event.currentTarget).val());
    },

    'click .select-tree-common label'(event, instance) {
        // Set the common section clicked flag
        instance.commonClicked = event.currentTarget;
    },

    'change .select-tree-root'(event, instance) {
        // Stop here if it's an inner input event
        if (event.target !== event.currentTarget) {
            return;
        }

        // Store the selectTree component value before it's removed from DOM
        const $treeRoot = $(event.currentTarget);
        instance.value = $treeRoot.data('component').value();
    },

    'click .tree-leaf input'(event, instance) {
        const $target = $(event.currentTarget);
        let $label = $target.closest('label');
        const $treeRoot = $label.closest('.select-tree-root');
        const $container = $treeRoot.find('.tree-options:first');
        let labelOffset;

        // Check if the clicked target was a label inside common section
        if (instance.commonClicked) {
            $label = $(instance.commonClicked);
            labelOffset = $label.data('offset');
        } else {
            labelOffset = $label.offset();
        }

        // Change the measure flow state to selected
        instance.state.set('selected');

        // Wait for the DOM re-rendering
        Tracker.afterFlush(() => {
            // Get the measure flow div
            const $measureFlow = instance.$('.measure-flow');

            // Adjust the label position
            if (instance.commonClicked) {
                labelOffset.top -= 10;
                labelOffset.left -= 12;
            } else {
                labelOffset.top -= 10;
            }

            // Reposition the measure flow based on the clicked label position
            $measureFlow.css(labelOffset);

            // Resize the copied label with same width of the clicked one
            // $measureFlow.children('.tree-leaf').width($label.outerWidth());
            $measureFlow.children('.tree-leaf').width(212);

            // Reset the flag to avoid wrong positioning when clicking normal labels again
            instance.commonClicked = false;

            instance.data.updateCallback(instance.value.value, instance.description.get());

            Meteor.defer(() => !$measureFlow.is(':hover') && $measureFlow.trigger('close'));
        });

        // Wait the fade-out transition and remove the selectTree component
        $container.one('transitionend', event => Blaze.remove(instance.selectTreeView));
    },

    'blur .measure-flow'(event, instance) {
        const $measureFlow = $(event.currentTarget);
        const element = $measureFlow[0];
        Meteor.defer(() => {
            const focused = $(':focus')[0];
            if (element !== focused && !$.contains(element, focused)) {
                $measureFlow.trigger('close');
            }
        });
    },

    'mouseleave .measure-flow'(event, instance) {
        const $measureFlow = $(event.currentTarget);
        const canClose = instance.state.get() === 'selected' && !instance.descriptionEdit.get();
        if (canClose && !$.contains($measureFlow[0], event.toElement)) {
            $measureFlow.trigger('close');
        }
    },

    'mouseenter .measure-flow'(event, instance) {
        // Prevent from closing if user go out and in too fast
        clearTimeout(instance.closingTimeout);
        $(event.currentTarget).off('animationend').removeClass('fadeOut');
    },

    'close .measure-flow'(event, instance) {
        const $measureFlow = $(event.currentTarget);

        // Clear the timeout to prevent executing the close process twice
        clearTimeout(instance.closingTimeout);

        instance.closingTimeout = setTimeout(() => {
            const animationEndHandler = event => {
                // Prevent closing if the animation is coming from actions panel
                if (event.target !== $measureFlow[0]) {
                    $measureFlow.one('animationend', animationEndHandler);
                    return;
                }

                instance.data.doneCallback();
            };

            $measureFlow.one('animationend', animationEndHandler).addClass('fadeOut');
        }, 300);
    }
});
