(function () {
    //Setting white-space to normal to override gridster's inherited value
    freeboard.addStyle('table.list-table', "width: 100%; white-space: normal !important; ");
    freeboard.addStyle('table.list-table td, table.list-table th', "padding: 2px 2px 2px 2px; vertical-align: top; ");
    freeboard.addStyle('table.list-table tr', "display: table-row; vertical-align: inherit; border-color: inherit;");
    freeboard.addStyle('table.list-table tr.highlight', "background-color:#656565; color:#FFFFFF");
    freeboard.addStyle('table.list-table tr.red td', "color: red;");
    freeboard.addStyle('table.list-table tr.yellow td', "color: yellow;");
    //freeboard.addStyle('table.list-table tr.black td', "background-color: black;");
    //document.querySelectorAll("#mytable1 > tbody > tr").forEach((el) => {
    //    if (parseInt(el.cells[2].innerText, 10) >= 30) el.style.color = 'blue'});

    var tableWidget = function (settings) {

        var self = this;

        var titleElement = $('<h2 class="section-title"></h2>');
        var stateElement = $('<div><table id="my" class="list-table"><thead/></table></div>');

        var currentSettings = settings;
        //store our calculated values in an object
        var stateObject = {};

        function updateState() {
            stateElement.find('thead').empty();
            stateElement.find('tbody').remove();
            var bodyHTML = $('<tbody/>');
            var classObject = {};
            var classCounter = 0;

            var replaceValue = (_.isUndefined(currentSettings.replace_value) ? '' : currentSettings.replace_value);

            console.log(stateObject);

            //only proceed if we have a valid JSON object
            if (true) {
                var headerRow = $('<tr/>');
                var templateRow = $('<tr/>');
                var rowHTML;

                //Loop through the 'header' array, building up our header row and also a template row
                try {
                    $.each(stateObject.value.header[0], function (headerKey, headerName) {
                        classObject[headerName] = 'td-' + classCounter;
                        headerRow.append($('<th/>').html(headerName));
                        templateRow.append($('<td/>').addClass('td-' + classCounter).html(replaceValue));
                        classCounter++;
                    })
                } catch (e) {
                    console.log(e);
                }

                //Loop through each 'data' object, cloning the templateRow and using the class to set the value in the correct <td>
                try {
                    $.each(stateObject.value.data, function (k, v) {

                        rowHTML = templateRow.clone();
                        $.each(v, function (dataKey, dataValue) {
                            rowHTML.find('.' + classObject[dataKey]).html(dataValue);
                            if (dataValue < 80 && dataKey == "SLA" ) rowHTML.addClass('red');
                            if (dataValue > 80 && dataValue < 85 && dataKey == "SLA" ) rowHTML.addClass('yellow');
                            console.log(rowHTML);
                        })
                        bodyHTML.append(rowHTML);
                    })

                } catch (e) {
                    console.log(e)
                }

                //http://stackoverflow.com/questions/22906760/jquery-sort-table-data
                bodyHTML.find('tr').sort(function (a, b) {
                    var tda = $(a).find('td:eq(1)').text();
                    var tdb = $(b).find('td:eq(1)').text();
                    // if a < b return 1
                    return tda < tdb ? 1
                        // else if a > b return -1
                        : tda > tdb ? -1
                            // else they are equal - return 0
                            : 0;

                }).appendTo(bodyHTML);

                //Append the header and body
                stateElement.find('thead').append(headerRow);
                stateElement.find('table').append(bodyHTML);

                //show or hide the header based on the setting
                if (currentSettings.show_header) {
                    stateElement.find('thead').show();
                } else {
                    stateElement.find('thead').hide();
                }
            }
        }

        this.render = function (element) {
            $(element).append(titleElement).append(stateElement);
        }

        this.onSettingsChanged = function (newSettings) {
            currentSettings = newSettings;
            titleElement.html((_.isUndefined(newSettings.title) ? "" : newSettings.title));
            updateState();
        }

        this.onCalculatedValueChanged = function (settingName, newValue) {
            //whenver a calculated value changes, stored them in the variable 'stateObject'
            stateObject[settingName] = newValue;
            updateState();
        }

        this.onDispose = function () {
        }

        this.getHeight = function () {
            /*var height = Math.ceil(stateElement.height() / 55);
            return (height > 0 ? height : 1);*/
            return 3;
        }

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "list",
        display_name: "Table",
        settings: [
            {
                name: "title",
                display_name: "Title",
                type: "text"
            },
            {
                name: "show_header",
                display_name: "Show Headers",
                default_value: true,
                type: "boolean"
            },
            {
                name: "replace_value",
                display_name: "Replace blank values",
                type: "text"
            },
            {
                name: "value",
                display_name: "Value",
                type: "calculated"
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new tableWidget(settings));
        }
    });
}());	
