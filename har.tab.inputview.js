/* See license.txt for terms of usage */

HAR.ns(function() { with (Domplate) { with (HAR.Lib) {

//-----------------------------------------------------------------------------

/**
 * InputView tab implementation. This object is intended to display input box
 * (text area) for input HAR log.
 */
HAR.Tab.InputView = domplate(
{
    render: function(parentNode)
    {
        HAR.log("har; Render Input tab.");

        var template = HAR.$("InputTabTemplate");
        parentNode.innerHTML = template.innerHTML;

        // Clean up the template so, there are no elements with the same ID
        // (e.g. the "sourceEditor).
        clearNode(template);
    },

    onAppendPreview: function(jsonString)
    {
        HAR.log("har; onAppendPreview");

        var validate = HAR.$("validate").checked; 
        var docNode = document.documentElement;
        var tabPreviewBody = getElementByClass(docNode, "tabPreviewBody");
        var pageList = getElementByClass(tabPreviewBody, "pageList");

        // Parse and validate.
        var inputData = HAR.Rep.Schema.parseInputData(jsonString, pageList, validate);
        if (inputData)
        {
            // Merge new input data with existing data in the model.
            HAR.Model.appendData(inputData);

            // Append new data into the Preview tab. This is optimalization so,
            // the view doesn't have to be entirely refreshed.
            HAR.Tab.Preview.append(inputData, pageList);

            // Clear the source editor now (the Loading... text).
            var sourceEditor = HAR.$("sourceEditor");
            sourceEditor.value = "";

            // DOM tab must be regenerated
            var tabDOMBody = getElementByClass(docNode, "tabDOMBody");
            tabDOMBody.updated = false;
        }

        // Switch to the Preview tab.
        HAR.Viewer.selectTabByName("Preview");
    },

    onDrop: function(event)
    {
        cancelEvent(event);

        try
        {
            this.handleDrop(event.dataTransfer);
        }
        catch (err)
        {
            HAR.log("har; HAR.Tab.InputView.onDrop EXCEPTION", err);
        }
    },

    handleDrop: function(dataTransfer)
    {
        if (!dataTransfer)
            return false;

        var files = dataTransfer.files;
        if (!files)
            return;

        HAR.log("har; HAR.Tab.InputView.handleDrop " + files.length, files);

        for (var i=0; i<files.length; i++)
            this.onAppendPreview(files[i].getAsText(""));
    },

    onAbout: function()
    {
        // Switch to the About tab.
        HAR.Viewer.selectTabByName("Help");
    }
});

//-----------------------------------------------------------------------------
}}});
