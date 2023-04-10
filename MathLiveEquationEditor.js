tinymce.PluginManager.add('MathLiveEquationEditor', function (editor, url) {
    var openDialog = function () {
        const range = editor.selection.getRng();
        const selection = editor.selection.getSel();

        let needToAddPair = false;

        // Check if there is a /( /) pair in the selection
        let startPair = range.startContainer.textContent.indexOf('/(', range.startOffset)
        let endPair = range.endContainer.textContent.lastIndexOf('/)', range.endOffset)
        // If there is a pair, then select the content between the pair
        if (startPair !== -1 && endPair !== -1 && startPair <= endPair) {
            range.setStart(range.startContainer, startPair + 2)
            range.setEnd(range.endContainer, endPair)
        } else {
            if (startPair !== -1) {
                // Only the start pair is selected
                // We need to find the last pair after the selection
                endPair = range.endContainer.textContent.indexOf('/)', range.endOffset)
            } else if (endPair !== -1) {
                // Only the end pair is selected
                // We need to find the first pair before the selection
                startPair = range.startContainer.textContent.lastIndexOf('/(', range.startOffset)
            } else {
                // There is no pair, then select the content between the last pair before the selection and the first pair after the selection
                startPair = range.startContainer.textContent.lastIndexOf('/(', range.startOffset)
                endPair = range.endContainer.textContent.indexOf('/)', range.endOffset)
            }
            if (startPair !== -1 && endPair !== -1) {
                range.setStart(range.startContainer, startPair + 2)
                range.setEnd(range.endContainer, endPair)
            }
            else {
                // We will add /( and /) around the selected text
                needToAddPair = true;
            }
        }
        if (startPair !== -1 && endPair !== -1) {
            if (range.toString().startsWith(' ')) {
                range.setStart(range.startContainer, startPair + 3)
            }
            if (range.toString().endsWith(' ')) {
                range.setEnd(range.endContainer, endPair - 1)
            }
        }
        selection.removeAllRanges()
        selection.addRange(range)


        return editor.windowManager.open({
            title: 'Maths Live Equation Editor',
            body: {
                type: 'panel',
                items: [
                    {
                        type: 'htmlpanel',
                        html: '<math-field id="tinyMCE-MathLiveEquationEditor">' + editor.selection.getContent({ format: 'text' }) + '</math-field><style>.ML__keyboard{z-index:1301;}</style>'
                    }
                ]
            },
            buttons: [
                {
                    type: 'cancel',
                    text: 'Close'
                },
                {
                    type: 'submit',
                    text: 'Save',
                    primary: true
                }
            ],
            onSubmit: function (api) {
                let text = document.getElementById('tinyMCE-MathLiveEquationEditor').getValue();
                if (needToAddPair) {
                    text = ' /( ' + text + ' /) ';
                }
                editor.selection.setContent(text, { format: 'text' })
                api.close();
            }
        });
    };
    /* Add a button that opens a window */
    editor.ui.registry.addButton('MathLiveEquationEditor', {
        text: 'Equation Editor',
        onAction: function () {
            /* Open window */
            openDialog();
        }
    });
    /* Adds a menu item, which can then be included in any menu via the menu/menubar configuration */
    editor.ui.registry.addMenuItem('MathLiveEquationEditor', {
        // text: editor.translate('Equation Editor'),
        text: 'Equation Editor',
        onAction: function () {
            /* Open window */
            openDialog();
        }
    });

    var scriptLoader = new tinymce.dom.ScriptLoader();
    scriptLoader.add("https://unpkg.com/mathlive");
    scriptLoader.loadQueue();

    /* Return the metadata for the help plugin */
    return {
        getMetadata: function () {
            return {
                name: 'MathLiveEquationEditor',
                url: 'https://github.com/DegrangeM/MathLiveEquationEditor'
            };
        }
    };
});
// tinymce.PluginManager.requireLangPack('MathLiveEquationEditor', 'fr_FR');