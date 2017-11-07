
f this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

//create queryObject
var queryStr = '{"text": "","shortText": "","termVector": [],"language": {"lang": "en"},"entities": [],"onlyNER": false,"resultLanguages": ["de","en"],"nbest": false,"sentence": false,"customisation": "generic"}';
queryJSON = $.parseJSON(queryStr);

var respStr;
var respJSON;;


function setData() {

    //Do not insert entities of some are already existent.
    if ($("input[value='dc_subject_person_1']").length > 0)
    {
        $('#nerd-message').text("Persons alredy existent! Please delete them before starting with lookup.");
        return;
    }

    if ($("input[value='dc_subject_location_1']").length > 0)
    {
        $('#nerd-message').text("Locations alredy existent! Please delete them before starting with lookup.");
        return;

    }
    if ($("input[value='dc_subject_period_1']").length > 0)
    {
        $('#nerd-message').text("Periods alredy existent! Please delete them before starting with lookup.");
        return;

    };



    // Handle only english or german publications
    //language field is multivalued dropdown
    if ($('#aspect_submission_StepTransformer_field_dc_language_iso option:selected').size() == 0)
    {$('#nerd-message').text("No langaguage selected");
        return;
    }

    var langs = [];
    var fieldlang;

    $('#aspect_submission_StepTransformer_field_dc_language_iso option:selected').each(function(){
        langs.push($(this).attr("value"), langs);
    });

    if ($.inArray('eng',langs) > -1) {
        lang = 'en';
        fieldlang = 'eng';
    }
    else if ($.inArray('ger',langs) > -1){
        lang = 'de';
        fieldlang = 'ger';
    }
    else {
        metadata = '';
        $('#nerd-message').text("The selected langaguage is not supported");
        return true;
    }


    var field = "dc_description_abstract" + fieldlang;
    var fieldid = "aspect_submission_StepTransformer_field_" + field;


    //title field is input, abstract fields are textarea
    metadata = $("#aspect_submission_StepTransformer_field_dc_title").attr("value") + $("#" + fieldid).val();

    $("input[value^=" + field + "]").each(function() {
        //alert($(this).next().text());
        metadata = metadata + $(this).next().text();
    });

    metadata.replace(/['"]+/g, '');

    queryJSON.text = metadata;
    queryJSON.language.lang = lang;

}



function insertEntities() {


    var persons = [];
    var locations = [];
    var periods = [];

    for (var i = 0, len = respJSON.entities.length; i < len; ++i) {
        var entity = respJSON.entities[i];
        var value;
        if (entity.wikidataId != null) {
            value = entity.rawName + '::' + entity.wikidataId;
        }
        else {
            vaule =entity.rawName;
        }
        if (entity.type == 'PERSON'){
            if ($.inArray(value,persons) == -1) {

                persons.push(value);

            }
        }
        else if (entity.type == 'LOCATION') {
            if ($.inArray(value,locations) == -1) {

                locations.push(value);

            }
        } else if (entity.type == 'PERIOD') {
            if ($.inArray(value,periods) == -1) {

                periods.push(value);

            }
        } else {

            if ($.inArray(value,persons) == -1) {
                persons.push(value);
            }
            if ($.inArray(value, locations) == -1) {
                locations.push(value);
            }
        }

    }

    var personWrap = $( "<div>");
    var personHide = $( "<div>");
    var personDel = $( "<p>", { html:
        $( "<button>", {"class": "ds-button-field btn btn-default ds-delete-button", "name": "submit", "text": "delete"})
    });
    var personEntries = $( "<div>", { "class": "ds-previous-values" });

    $.each(persons, function(index, value) {

        if( index === 0 )
            return true;
        //create input node with checkbox
        var node =  $( "<div>", { "class": "checkbox", html:
            $( "<label>", { html: [
                $( "<input>", { "name": "dc_subject_person_selected", "type": "checkbox", "value": "dc_subject_person_" + index}),
                $( "<span>", { class: "ds-interpreted-field", "text": value}) ]

            })

        });


        //create hidden input
        var hi = $( "<input>", {"name": "dc_subject_person_" + index, "value": value, "type": "hidden"});

        //insert nodes
        $(personEntries).append(node);
        $(personHide).append(hi);


    });

    $(personWrap).append($(personEntries));
    $(personWrap).append($(personDel));
    $(personWrap).append($(personHide).html());

    $('#aspect_submission_StepTransformer_field_dc_subject_person').after($(personWrap).html());

    var locationWrap = $( "<div>");
    var locationHide = $( "<div>");
    var locationDel = $( "<p>", { html:
        $( "<button>", {"class": "ds-button-field btn btn-default ds-delete-button", "name": "submit", "text": "delete"})
    });
    var locationEntries = $( "<div>", { "class": "ds-previous-values" });

    $.each(locations, function(index, value) {
        if( index === 0 ) {	return true;}
        //create input node with checkbox
        var node =  $( "<div>", { "class": "checkbox", html:
            $( "<label>", { html: [
                $( "<input>", { "name": "dc_subject_location_selected", "type": "checkbox", "value": "dc_subject_location_" + index}),
                $( "<span>", { class: "ds-interpreted-field", "text": value}) ]

            })

        });


        //create hidden input
        var hi = $( "<input>", {"name": "dc_subject_location_" + index, "value": value, "type": "hidden"});

        //insert nodes
        $(locationEntries).append(node);
        $(locationHide).append(hi);


    });


    $(locationWrap).append($(locationEntries));
    $(locationWrap).append($(locationDel));
    $(locationWrap).append($(locationHide).html());
    $('#aspect_submission_StepTransformer_field_dc_subject_location').after($(locationWrap).html());

    var periodWrap = $( "<div>");
    var periodHide = $( "<div>");
    var periodDel = $( "<p>", { html:
        $( "<button>", {"class": "ds-button-field btn btn-default ds-delete-button", "name": "submit", "text": "delete"})
    });
    var periodEntries = $( "<div>", { "class": "ds-previous-values" });

    $.each(periods, function(index, value) {

        if( index === 0 )
            return true;
        //create input node with checkbox
        var node =  $( "<div>", { "class": "checkbox", html:
            $( "<label>", { html: [
                $( "<input>", { "name": "dc_subject_period_selected", "type": "checkbox", "value": "dc_subject_period_" + index}),
                $( "<span>", { class: "ds-interpreted-field", "text": value}) ]

            })

        });


        //create hidden input
        var hi = $( "<input>", {"name": "dc_subject_period_" + index, "value": value, "type": "hidden"});

        //insert nodes
        $(periodEntries).append(node);
        $(periodHide).append(hi);


    });

    $(periodWrap).append($(personEntries));
    $(periodWrap).append($(personDel));
    $(periodWrap).append($(personHide).html());

    $('#aspect_submission_StepTransformer_field_dc_subject_period').after($(periodWrap).html());


}

function askNerd () {

    var formData = new FormData();

    formData.append("query", JSON.stringify(queryJSON));

    $('#nerd-message').text('Loading data from NERD ...');

    $.ajax({
        type: "POST",
        url: 'http://nerd.huma-num.fr/nerd/service/disambiguate',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            respJSON = response;
            alert(response.runtime);
            $('#nerd-message').text('');
            insertEntities();

        },
        error: function(req, status, errThrown){
            $('#nerd-message').text("ERROR: Something went wrong. Try it again later..");
            setTimeout(function() { $('#nerd-message').hide(); }, 5000);
        }

    });


}


(function($) {
    $("#main-container").append('<button id="totop">&uarr;</button>');
    $(window).scroll( function(){
        $(window).scrollTop()>300?($("#totop:hidden").fadeIn(),$("#totop").css("top",$(window).scrollTop()+$(window).height()-100)):$("#totop:visible").fadeOut()
    });
    $("#totop").click(function(){
        $("html, body").animate({scrollTop:0})
    });

    DSpace.getTemplate = function(name) {
        if (DSpace.dev_mode || DSpace.templates === undefined || DSpace.templates[name] === undefined) {
            $.ajax({
                url : DSpace.theme_path + 'templates/' + name + '.hbs',
                success : function(data) {
                    if (DSpace.templates === undefined) {
                        DSpace.templates = {};
                    }
                    DSpace.templates[name] = Handlebars.compile(data);
                },
                async : false
            });
        }
        return DSpace.templates[name];
    };

    var nerdurl = "http://nerd.huma-num.fr/nerd/service/disambiguate";
    var lang;
    var metadata;
    console.log($('#aspect_submission_StepTransformer_field_dc_language_iso option:selected').size() + " Languages");

    var nerdButton = $("<span>", {"id": "entityLookup", "text": "Lookup Entities"});
    $("label[for='aspect_submission_StepTransformer_field_dc_subject_person']").after($(nerdButton));
    $( "#entityLookup" ).css("cursor", "pointer");
    $( "#entityLookup" ).on( "click", function() {
        $(nerdButton).after($("<span>" , {"id": "nerd-message"}));
        setData();
        askNerd();
    });

})(jQuery);



