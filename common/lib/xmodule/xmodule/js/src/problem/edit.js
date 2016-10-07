/* global CodeMirror, _, XModule, PrettyPrint */

// Generated by CoffeeScript 1.6.1
(function() {
    'use strict';
    var hasPropsHelper = {}.hasOwnProperty,
        extendsHelper = function(child, parent) {
            var key;
            for (key in parent) { // eslint-disable-line no-restricted-syntax
                if (hasPropsHelper.call(parent, key)) {
                    child[key] = parent[key]; // eslint-disable-line no-param-reassign
                }
            }
            function ctor() {
                this.constructor = child;
            }

            ctor.prototype = parent.prototype;
            child.prototype = new ctor(); // eslint-disable-line no-param-reassign
            child.__super__ = parent.prototype; // eslint-disable-line no-param-reassign, no-underscore-dangle
            return child;
        };

    this.MarkdownEditingDescriptor = (function(_super) {
        extendsHelper(MarkdownEditingDescriptor, _super); // eslint-disable-line no-use-before-define

        MarkdownEditingDescriptor.multipleChoiceTemplate = '( ) ' + // eslint-disable-line no-use-before-define
            (gettext('incorrect')) + '\n( ) ' + (gettext('incorrect')) + '\n(x) ' + (gettext('correct')) + '\n';

        MarkdownEditingDescriptor.checkboxChoiceTemplate = '[x] ' + // eslint-disable-line no-use-before-define
            (gettext('correct')) + '\n[ ] incorrect\n[x] correct\n';

        MarkdownEditingDescriptor.stringInputTemplate = '= ' + // eslint-disable-line no-use-before-define
            (gettext('answer')) + '\n';

        MarkdownEditingDescriptor.numberInputTemplate = '= ' +  // eslint-disable-line no-use-before-define
            (gettext('answer')) + ' +- 0.001%\n';

        MarkdownEditingDescriptor.selectTemplate = '[[' + // eslint-disable-line no-use-before-define
            (gettext('incorrect')) + ', (' + (gettext('correct')) + '), ' + (gettext('incorrect')) + ']]\n';

        MarkdownEditingDescriptor.headerTemplate = '' + // eslint-disable-line no-use-before-define
            (gettext('Header')) + '\n=====\n';

        MarkdownEditingDescriptor.explanationTemplate = '[explanation]\n' + // eslint-disable-line no-use-before-define
            (gettext('Short explanation')) + '\n[explanation]\n';

        function MarkdownEditingDescriptor(element) {
            var that = this;
            this.toggleCheatsheetVisibility = function() {
                return MarkdownEditingDescriptor.prototype.toggleCheatsheetVisibility.apply(that, arguments);
            };
            this.toggleCheatsheet = function() {
                return MarkdownEditingDescriptor.prototype.toggleCheatsheet.apply(that, arguments);
            };
            this.onToolbarButton = function() {
                return MarkdownEditingDescriptor.prototype.onToolbarButton.apply(that, arguments);
            };
            this.onShowXMLButton = function() {
                return MarkdownEditingDescriptor.prototype.onShowXMLButton.apply(that, arguments);
            };
            this.element = element;
            if ($('.markdown-box', this.element).length !== 0) {
                this.markdown_editor = CodeMirror.fromTextArea($('.markdown-box', element)[0], {
                    lineWrapping: true,
                    mode: null
                });
                this.setCurrentEditor(this.markdown_editor);
                this.element.on('click', '.xml-tab', this.onShowXMLButton);
                this.element.on('click', '.format-buttons button', this.onToolbarButton);
                this.element.on('click', '.cheatsheet-toggle', this.toggleCheatsheet);
                $(this.element.find('.xml-box')).hide();
            } else {
                this.createXMLEditor();
            }
        }

        /*
         Creates the XML Editor and sets it as the current editor. If text is passed in,
         it will replace the text present in the HTML template.

         text: optional argument to override the text passed in via the HTML template
         */
        MarkdownEditingDescriptor.prototype.createXMLEditor = function(text) {
            this.xml_editor = CodeMirror.fromTextArea($('.xml-box', this.element)[0], {
                mode: 'xml',
                lineNumbers: true,
                lineWrapping: true
            });
            if (text) {
                this.xml_editor.setValue(text);
            }
            this.setCurrentEditor(this.xml_editor);
            $(this.xml_editor.getWrapperElement()).toggleClass('CodeMirror-advanced');
            return this.xml_editor.refresh();
        };

        /*
         User has clicked to show the XML editor. Before XML editor is swapped in,
         the user will need to confirm the one-way conversion.
         */
        MarkdownEditingDescriptor.prototype.onShowXMLButton = function(e) {
            e.preventDefault();
            if (this.cheatsheet && this.cheatsheet.hasClass('shown')) {
                this.cheatsheet.toggleClass('shown');
                this.toggleCheatsheetVisibility();
            }
            if (this.confirmConversionToXml()) {
                this.createXMLEditor(MarkdownEditingDescriptor.markdownToXml(this.markdown_editor.getValue()));
                this.xml_editor.setCursor(0);
                $(this.element.find('.editor-bar')).hide();
            }
        };

        /*
         Have the user confirm the one-way conversion to XML.
         Returns true if the user clicked OK, else false.
         */


        MarkdownEditingDescriptor.prototype.confirmConversionToXml = function() {
            confirm(gettext('If you use the Advanced Editor, this problem will be converted to XML and you will not be able to return to the Simple Editor Interface.\n\nProceed to the Advanced Editor and convert this problem to XML?')); // eslint-disable-line max-len, no-alert
        };

        /*
         Event listener for toolbar buttons (only possible when markdown editor is visible).
         */
        MarkdownEditingDescriptor.prototype.onToolbarButton = function(e) {
            var revisedSelection, selection;
            e.preventDefault();
            selection = this.markdown_editor.getSelection();
            revisedSelection = null;
            switch ($(e.currentTarget).attr('class')) {
            case 'multiple-choice-button':
                revisedSelection = MarkdownEditingDescriptor.insertMultipleChoice(selection);
                break;
            case 'string-button':
                revisedSelection = MarkdownEditingDescriptor.insertStringInput(selection);
                break;
            case 'number-button':
                revisedSelection = MarkdownEditingDescriptor.insertNumberInput(selection);
                break;
            case 'checks-button':
                revisedSelection = MarkdownEditingDescriptor.insertCheckboxChoice(selection);
                break;
            case 'dropdown-button':
                revisedSelection = MarkdownEditingDescriptor.insertSelect(selection);
                break;
            case 'header-button':
                revisedSelection = MarkdownEditingDescriptor.insertHeader(selection);
                break;
            case 'explanation-button':
                revisedSelection = MarkdownEditingDescriptor.insertExplanation(selection);
                break;
            default:
                break;
            }
            if (revisedSelection !== null) {
                this.markdown_editor.replaceSelection(revisedSelection);
                this.markdown_editor.focus();
            }
        };

        /*
         Event listener for toggling cheatsheet (only possible when markdown editor is visible).
         */
        MarkdownEditingDescriptor.prototype.toggleCheatsheet = function(e) {
            var that = this;
            e.preventDefault();
            if (!$(this.markdown_editor.getWrapperElement()).find('.simple-editor-cheatsheet')[0]) {
                this.cheatsheet = $($('#simple-editor-cheatsheet').html());
                $(this.markdown_editor.getWrapperElement()).append(this.cheatsheet);
            }
            this.toggleCheatsheetVisibility();
            return setTimeout((function() {
                return that.cheatsheet.toggleClass('shown');
            }), 10);
        };

        /*
         Function to toggle cheatsheet visibility.
         */
        MarkdownEditingDescriptor.prototype.toggleCheatsheetVisibility = function() {
            return $('.modal-content').toggleClass('cheatsheet-is-shown');
        };

        /*
         Stores the current editor and hides the one that is not displayed.
         */
        MarkdownEditingDescriptor.prototype.setCurrentEditor = function(editor) {
            if (this.current_editor) {
                $(this.current_editor.getWrapperElement()).hide();
            }
            this.current_editor = editor;
            $(this.current_editor.getWrapperElement()).show();
            return $(this.current_editor).focus();
        };

        /*
         Called when save is called. Listeners are unregistered because editing the block again will
         result in a new instance of the descriptor. Note that this is NOT the case for cancel--
         when cancel is called the instance of the descriptor is reused if edit is selected again.
         */
        MarkdownEditingDescriptor.prototype.save = function() {
            this.element.off('click', '.xml-tab', this.changeEditor);
            this.element.off('click', '.format-buttons button', this.onToolbarButton);
            this.element.off('click', '.cheatsheet-toggle', this.toggleCheatsheet);
            if (this.current_editor === this.markdown_editor) {
                return {
                    data: MarkdownEditingDescriptor.markdownToXml(this.markdown_editor.getValue()),
                    metadata: {
                        markdown: this.markdown_editor.getValue()
                    }
                };
            } else {
                return {
                    data: this.xml_editor.getValue(),
                    nullout: ['markdown']
                };
            }
        };

        MarkdownEditingDescriptor.insertMultipleChoice = function(selectedText) {
            return MarkdownEditingDescriptor.insertGenericChoice(selectedText, '(', ')',
                MarkdownEditingDescriptor.multipleChoiceTemplate
            );
        };

        MarkdownEditingDescriptor.insertCheckboxChoice = function(selectedText) {
            return MarkdownEditingDescriptor.insertGenericChoice(selectedText, '[', ']',
                MarkdownEditingDescriptor.checkboxChoiceTemplate
            );
        };

        MarkdownEditingDescriptor.insertGenericChoice = function(selectedText, choiceStart, choiceEnd, template) {
            var cleanSelectedText, line, lines, revisedLines, i, len;
            if (selectedText.length > 0) {
                cleanSelectedText = selectedText.replace(/\n+/g, '\n').replace(/\n$/, '');
                lines = cleanSelectedText.split('\n');
                revisedLines = '';
                for (i = 0, len = lines.length; i < len; i++) {
                    line = lines[i];
                    revisedLines += choiceStart;
                    if (/^\s*x\s+(\S)/i.test(line)) {
                        line = line.replace(/^\s*x\s+(\S)/i, '$1');
                        revisedLines += 'x';
                    } else {
                        revisedLines += ' ';
                    }
                    revisedLines += choiceEnd + ' ' + line + '\n';
                }
                return revisedLines;
            } else {
                return template;
            }
        };

        MarkdownEditingDescriptor.insertStringInput = function(selectedText) {
            return MarkdownEditingDescriptor.insertGenericInput(selectedText, '= ', '',
                MarkdownEditingDescriptor.stringInputTemplate
            );
        };

        MarkdownEditingDescriptor.insertNumberInput = function(selectedText) {
            return MarkdownEditingDescriptor.insertGenericInput(selectedText, '= ', '',
                MarkdownEditingDescriptor.numberInputTemplate
            );
        };

        MarkdownEditingDescriptor.insertSelect = function(selectedText) {
            return MarkdownEditingDescriptor.insertGenericInput(selectedText, '[[', ']]',
                MarkdownEditingDescriptor.selectTemplate
            );
        };

        MarkdownEditingDescriptor.insertHeader = function(selectedText) {
            return MarkdownEditingDescriptor.insertGenericInput(selectedText, '', '\n====\n',
                MarkdownEditingDescriptor.headerTemplate
            );
        };

        MarkdownEditingDescriptor.insertExplanation = function(selectedText) {
            return MarkdownEditingDescriptor.insertGenericInput(selectedText, '[explanation]\n', '\n[explanation]',
                MarkdownEditingDescriptor.explanationTemplate
            );
        };

        MarkdownEditingDescriptor.insertGenericInput = function(selectedText, lineStart, lineEnd, template) {
            if (selectedText.length > 0) {
                return lineStart + selectedText + lineEnd;
            } else {
                return template;
            }
        };

        MarkdownEditingDescriptor.markdownToXml = function(markdown) {
            var demandHintTags = [],
                finalDemandHints, finalXml, responseTypesMarkdown, responseTypesXML, toXml;
            toXml = function(partialMarkdown) {
                var xml = partialMarkdown,
                    i, splits, makeParagraph, serializer, responseType, $xml, responseTypesSelector,
                    inputtype, beforeInputtype, extractHint, demandhints;
                var responseTypes = [
                    'optionresponse', 'multiplechoiceresponse', 'stringresponse', 'numericalresponse', 'choiceresponse'
                ];

                // fix DOS \r\n line endings to look like \n
                xml = xml.replace(/\r\n/g, '\n');

                // replace headers
                xml = xml.replace(/(^.*?$)(?=\n==+$)/gm, '<h3 class="hd hd-2 problem-header">$1</h3>');
                xml = xml.replace(/\n^==+$/gm, '');

                // extract question and description(optional)
                // >>question||description<< converts to
                // <label>question</label> <description>description</description>
                xml = xml.replace(/>>([^]+?)<</gm, function(match, questionText) {
                    var result = questionText.split('||'),
                        label = '<label>' + result[0] + '</label>\n';

                    // don't add empty <description> tag
                    if (result.length === 1 || !result[1]) {
                        return label;
                    }
                    return label + '<description>' + result[1] + '</description>\n';
                });

                // Pull out demand hints,  || a hint ||
                demandhints = '';
                xml = xml.replace(/(^\s*\|\|.*?\|\|\s*$\n?)+/gm, function(match) {  // $\n
                    var inner,
                        options = match.split('\n');
                    for (i = 0; i < options.length; i += 1) {
                        inner = /\s*\|\|(.*?)\|\|/.exec(options[i]);
                        if (inner) {
                            // safe-lint: disable=javascript-concat-html
                            demandhints += '  <hint>' + inner[1].trim() + '</hint>\n';
                        }
                    }
                    return '';
                });

                // replace \n+whitespace within extended hint {{ .. }}, by a space, so the whole
                // hint sits on one line.
                // This is the one instance of {{ ... }} matching that permits \n
                xml = xml.replace(/{{(.|\n)*?}}/gm, function(match) {
                    return match.replace(/\r?\n( |\t)*/g, ' ');
                });

                // Function used in many places to extract {{ label:: a hint }}.
                // Returns a little hash with various parts of the hint:
                // hint: the hint or empty, nothint: the rest
                // labelassign: javascript assignment of label attribute, or empty
                extractHint = function(inputText, detectParens) {
                    var curly, hint, label, parens, labelassign, labelmatch,
                        text = inputText;
                    curly = /\s*{{(.*?)}}/.exec(text);
                    hint = '';
                    label = '';
                    parens = false;
                    labelassign = '';
                    if (curly) {
                        text = text.replace(curly[0], '');
                        hint = curly[1].trim();
                        labelmatch = /^(.*?)::/.exec(hint);
                        if (labelmatch) {
                            hint = hint.replace(labelmatch[0], '').trim();
                            label = labelmatch[1].trim();
                            labelassign = " label='" + label + "'";
                        }
                    }
                    if (detectParens) {
                        if (text.length >= 2 && text[0] === '(' && text[text.length - 1] === ')') {
                            text = text.substring(1, text.length - 1);
                            parens = true;
                        }
                    }
                    return {
                        nothint: text,
                        hint: hint,
                        label: label,
                        parens: parens,
                        labelassign: labelassign
                    };
                };


                // replace selects
                // [[ a, b, (c) ]]
                // [[
                //     a
                //     b
                //     (c)
                //  ]]
                // <optionresponse>
                //  <optioninput>
                //     <option  correct="True">AAA<optionhint  label="Good Job">
                //          Yes, multiple choice is the right answer.
                //  </optionhint>
                // Note: part of the option-response syntax looks like multiple-choice, so it must be processed first.
                xml = xml.replace(/\[\[((.|\n)+?)\]\]/g, function(match, group1) {
                    var textHint, options, optiontag, correct, lines, optionlines, line, correctstr, hintstr, label;
                    // decide if this is old style or new style
                    if (match.indexOf('\n') === -1) {  // OLD style, [[ .... ]]  on one line
                        options = group1.split(/,\s*/g);
                        optiontag = '  <optioninput options="(';
                        for (i = 0; i < options.length; i += 1) {
                            optiontag += "'" + options[i].replace(/(?:^|,)\s*\((.*?)\)\s*(?:$|,)/g, '$1') + "'" +
                                (i < options.length - 1 ? ',' : '');
                        }
                        optiontag += ')" correct="';
                        correct = /(?:^|,)\s*\((.*?)\)\s*(?:$|,)/g.exec(group1);
                        if (correct) {
                            optiontag += correct[1];
                        }
                        optiontag += '">';
                        return '\n<optionresponse>\n' + optiontag + '</optioninput>\n</optionresponse>\n\n';
                    }

                    // new style  [[ many-lines ]]
                    lines = group1.split('\n');
                    optionlines = '';
                    for (i = 0; i < lines.length; i++) {
                        line = lines[i].trim();
                        if (line.length > 0) {
                            textHint = extractHint(line, true);
                            correctstr = ' correct="' + (textHint.parens ? 'True' : 'False') + '"';
                            hintstr = '';
                            if (textHint.hint) {
                                label = textHint.label;
                                if (label) {
                                    label = ' label="' + label + '"';
                                }
                                hintstr = ' <optionhint' + label + '>' + textHint.hint + '</optionhint>';
                            }
                            optionlines += '    <option' + correctstr + '>' + textHint.nothint + hintstr +
                                '</option>\n';
                        }
                    }
                    return '\n<optionresponse>\n  <optioninput>\n' + optionlines +
                        '  </optioninput>\n</optionresponse>\n\n';
                });

                // multiple choice questions
                //
                xml = xml.replace(/(^\s*\(.{0,3}\).*?$\n*)+/gm, function(match) {
                    var choices, shuffle, options, value, inparens, correct, fixed, hint, result;
                    choices = '';
                    shuffle = false;
                    options = match.split('\n');
                    for (i = 0; i < options.length; i++) {
                        options[i] = options[i].trim();                   // trim off leading/trailing whitespace
                        if (options[i].length > 0) {
                            value = options[i].split(/^\s*\(.{0,3}\)\s*/)[1];
                            inparens = /^\s*\((.{0,3})\)\s*/.exec(options[i])[1];
                            correct = /x/i.test(inparens);
                            fixed = '';
                            if (/@/.test(inparens)) {
                                fixed = ' fixed="true"';
                            }
                            if (/!/.test(inparens)) {
                                shuffle = true;
                            }

                            hint = extractHint(value);
                            if (hint.hint) {
                                value = hint.nothint;
                                value = value + ' <choicehint' + hint.labelassign + '>' + hint.hint + '</choicehint>';
                            }
                            choices += '    <choice correct="' + correct + '"' + fixed + '>' + value + '</choice>\n';
                        }
                    }
                    result = '<multiplechoiceresponse>\n';
                    if (shuffle) {
                        result += '  <choicegroup type="MultipleChoice" shuffle="true">\n';
                    } else {
                        result += '  <choicegroup type="MultipleChoice">\n';
                    }
                    result += choices;
                    result += '  </choicegroup>\n';
                    result += '</multiplechoiceresponse>\n\n';
                    return result;
                });

                // group check answers
                // [.] with {{...}} lines mixed in
                xml = xml.replace(/(^\s*((\[.?\])|({{.*?}})).*?$\n*)+/gm, function(match) {
                    var groupString = '<choiceresponse>\n',
                        options, value, correct, abhint, endHints, hintbody, hint, inner, select, unselected, hints;

                    groupString += '  <checkboxgroup>\n';
                    options = match.split('\n');

                    endHints = '';  // save these up to emit at the end

                    for (i = 0; i < options.length; i += 1) {
                        if (options[i].trim().length > 0) {
                            // detect the {{ ((A*B)) ...}} case first
                            // emits: <compoundhint value="A*B">AB hint</compoundhint>

                            abhint = /^\s*{{\s*\(\((.*?)\)\)(.*?)}}/.exec(options[i]);
                            if (abhint) {
                                // lone case of hint text processing outside of extractHint, since syntax here is unique
                                hintbody = abhint[2];
                                hintbody = hintbody.replace('&lf;', '\n').trim();
                                endHints += '    <compoundhint value="' + abhint[1].trim() + '">' + hintbody +
                                    '</compoundhint>\n';
                                continue;  // bail
                            }

                            value = options[i].split(/^\s*\[.?\]\s*/)[1];
                            correct = /^\s*\[x\]/i.test(options[i]);
                            hints = '';
                            //  {{ selected: You’re right that apple is a fruit. },
                            // {unselected: Remember that apple is also a fruit.}}
                            hint = extractHint(value);
                            if (hint.hint) {
                                inner = '{' + hint.hint + '}';  // parsing is easier if we put outer { } back

                                // include \n since we are downstream of extractHint()
                                select = /{\s*(s|selected):((.|\n)*?)}/i.exec(inner);

                                // checkbox choicehints get their own line, since there can be two of them
                                // <choicehint selected="true">You’re right that apple is a fruit.</choicehint>
                                if (select) {
                                    hints += '\n      <choicehint selected="true">' + select[2].trim() +
                                        '</choicehint>';
                                }
                                unselected = /{\s*(u|unselected):((.|\n)*?)}/i.exec(inner);
                                if (unselected) {
                                    hints += '\n      <choicehint selected="false">' + select[2].trim() +
                                        '</choicehint>';
                                }

                                // Blank out the original text only if the specific "selected" syntax is found
                                // That way, if the user types it wrong, at least they can see it's not processed.
                                if (hints) {
                                    value = hint.nothint;
                                }
                            }
                            groupString += '    <choice correct="' + correct + '">' + value + hints + '</choice>\n';
                        }
                    }

                    groupString += endHints;
                    groupString += '  </checkboxgroup>\n';
                    groupString += '</choiceresponse>\n\n';

                    return groupString;
                });


                // replace string and numerical, numericalresponse, stringresponse
                // A fine example of the function-composition programming style.
                xml = xml.replace(/(^s?=\s*(.*?$)(\n*(or|not)=\s*(.*?$))*)+/gm, function(match, p) {
                    // Line split here, trim off leading xxx= in each function
                    var answersList = p.split('\n'),

                        processNumericalResponse = function(val) {
                            var params, answer, string, textHint, hintLine, value;
                            // Numeric case is just a plain leading = with a single answer
                            value = val.replace(/^=\s*/, '');

                            textHint = extractHint(value);
                            hintLine = '';
                            if (textHint.hint) {
                                value = textHint.nothint;
                                hintLine = '  <correcthint' + textHint.labelassign + '>' + textHint.hint +
                                    '</correcthint>\n';
                            }

                            if (_.contains(['[', '('], value[0]) && _.contains([']', ')'], value[value.length - 1])) {
                                // [5, 7) or (5, 7), or (1.2345 * (2+3), 7*4 ]  - range tolerance case
                                // = (5*2)*3 should not be used as range tolerance
                                string = '<numericalresponse answer="' + value + '">\n';
                                string += '  <formulaequationinput />\n';
                                string += hintLine;
                                string += '</numericalresponse>\n\n';
                                return string;
                            }

                            if (isNaN(parseFloat(value))) {
                                return false;
                            }

                            // Tries to extract parameters from string like 'expr +- tolerance'
                            params = /(.*?)\+\-\s*(.*?$)/.exec(value);

                            if (params) {
                                answer = params[1].replace(/\s+/g, ''); // support inputs like 5*2 +- 10
                                string = '<numericalresponse answer="' + answer + '">\n';
                                string += '  <responseparam type="tolerance" default="' + params[2] + '" />\n';
                            } else {
                                answer = value.replace(/\s+/g, ''); // support inputs like 5*2
                                string = '<numericalresponse answer="' + answer + '">\n';
                            }

                            string += '  <formulaequationinput />\n';
                            string += hintLine;
                            string += '</numericalresponse>\n\n';

                            return string;
                        },

                        processStringResponse = function(values) {
                            var firstAnswer, textHint, typ, string, orMatch, notMatch;
                            // First string case is s?=
                            firstAnswer = values.shift();
                            firstAnswer = firstAnswer.replace(/^s?=\s*/, '');
                            textHint = extractHint(firstAnswer);
                            firstAnswer = textHint.nothint;
                            typ = ' type="ci"';
                            if (firstAnswer[0] === '|') { // this is regexp case
                                typ = ' type="ci regexp"';
                                firstAnswer = firstAnswer.slice(1).trim();
                            }
                            string = '<stringresponse answer="' + firstAnswer + '"' + typ + ' >\n';
                            if (textHint.hint) {
                                string += '  <correcthint' + textHint.labelassign + '>' + textHint.hint +
                                    '</correcthint>\n';
                            }

                            // Subsequent cases are not= or or=
                            for (i = 0; i < values.length; i += 1) {
                                textHint = extractHint(values[i]);
                                notMatch = /^not=\s*(.*)/.exec(textHint.nothint);
                                if (notMatch) {
                                    string += '  <stringequalhint answer="' + notMatch[1] + '"' +
                                        textHint.labelassign + '>' + textHint.hint + '</stringequalhint>\n';
                                    continue;
                                }
                                orMatch = /^or=\s*(.*)/.exec(textHint.nothint);
                                if (orMatch) {
                                    // additional_answer with answer= attribute
                                    string += '  <additional_answer answer="' + orMatch[1] + '">';
                                    if (textHint.hint) {
                                        string += '<correcthint' + textHint.labelassign + '>' +
                                            textHint.hint + '</correcthint>';
                                    }
                                    string += '</additional_answer>\n';
                                }
                            }

                            string += '  <textline size="20"/>\n</stringresponse>\n\n';

                            return string;
                        };

                    return processNumericalResponse(answersList[0]) || processStringResponse(answersList);
                });


                // replace explanations
                xml = xml.replace(/\[explanation\]\n?([^\]]*)\[\/?explanation\]/gmi, function(match, p1) {
                    return '<solution>\n<div class="detailed-solution">\n' +
                        gettext('Explanation') + '\n\n' + p1 + '\n</div>\n</solution>';
                });

                // replace code blocks
                xml = xml.replace(/\[code\]\n?([^\]]*)\[\/?code\]/gmi, function(match, p1) {
                    return '<pre><code>' + p1 + '</code></pre>';
                });

                // split scripts and preformatted sections, and wrap paragraphs
                splits = xml.split(/(<\/?(?:script|pre|label|description).*?>)/g);

                // Wrap a string by <p> tag when line is not already wrapped by another tag
                // true when line is not already wrapped by another tag false otherwise
                makeParagraph = true;

                for (i = 0; i < splits.length; i += 1) {
                    if (/<(script|pre|label|description)/.test(splits[i])) {
                        makeParagraph = false;
                    }

                    if (makeParagraph) {
                        splits[i] = splits[i].replace(/(^(?!\s*<|$).*$)/gm, '<p>$1</p>');
                    }

                    if (/<\/(script|pre|label|description)/.test(splits[i])) {
                        makeParagraph = true;
                    }
                }

                xml = splits.join('');

                // rid white space
                xml = xml.replace(/\n\n\n/g, '\n');

                // if we've come across demand hints, wrap in <demandhint> at the end
                if (demandhints) {
                    demandHintTags.push(demandhints);
                }

                // make selector to search responsetypes in xml
                responseTypesSelector = responseTypes.join(', ');

                // make temporary xml
                // safe-lint: disable=javascript-concat-html
                $xml = $($.parseXML('<prob>' + xml + '</prob>'));
                responseType = $xml.find(responseTypesSelector);

                // convert if there is only one responsetype
                if (responseType.length === 1) {
                    inputtype = responseType[0].firstElementChild;
                    // used to decide whether an element should be placed before or after an inputtype
                    beforeInputtype = true;

                    _.each($xml.find('prob').children(), function(child) {
                        // we don't want to add the responsetype again into new xml
                        if (responseType[0].nodeName === child.nodeName) {
                            beforeInputtype = false;
                            return;
                        }

                        if (beforeInputtype) {
                            // safe-lint: disable=javascript-jquery-insert-into-target
                            responseType[0].insertBefore(child, inputtype);
                        } else {
                            responseType[0].appendChild(child);
                        }
                    });
                    serializer = new XMLSerializer();

                    xml = serializer.serializeToString(responseType[0]);

                    // remove xmlns attribute added by the serializer
                    xml = xml.replace(/\sxmlns=['"].*?['"]/gi, '');

                    // XMLSerializer messes the indentation of XML so add newline
                    // at the end of each ending tag to make the xml looks better
                    xml = xml.replace(/(<\/.*?>)(<.*?>)/gi, '$1\n$2');
                }

                // remove class attribute added on <p> tag for question title
                xml = xml.replace(/\sclass='qtitle'/gi, '');
                return xml;
            };
            responseTypesXML = [];
            responseTypesMarkdown = markdown.split(/\n\s*---\s*\n/g);
            _.each(responseTypesMarkdown, function(responseTypeMarkdown) {
                if (responseTypeMarkdown.trim().length > 0) {
                    responseTypesXML.push(toXml(responseTypeMarkdown));
                }
            });
            finalDemandHints = '';
            if (demandHintTags.length) {
                finalDemandHints = '\n<demandhint>\n' + demandHintTags.join('') + '</demandhint>';
            }
            finalXml = '<problem>' + responseTypesXML.join('\n\n') + finalDemandHints + '</problem>';
            return PrettyPrint.xml(finalXml);
        };

        return MarkdownEditingDescriptor;
    }(XModule.Descriptor));
}).call(this);
