var fixHelperModified = function(e, tr) {
    var $originals = tr.children();
    var $helper = tr.clone();
    $helper.children().each(function(index) {
        $(this).width($originals.eq(index).width())
    });
    return $helper;
},
    updateIndex = function(e, ui) {
        $('td.index', ui.item.parent()).each(function (i) {
            $(this).html(i + 1);
        });
    };

$("#sort tbody").sortable({
    helper: fixHelperModified,
    stop: updateIndex
}).disableSelection();

$('#sort tbody').sortable({
                update: () => {
                    let positions = []; 
                    $('#sort tr').each((i, v) => { 
                        positions[i] = $(v).attr('id'); 
                    });
                    console.log(positions);
                    $.ajax({
                        url: '/profile/mylist',
                        data: {positions},
                        type: 'PUT',
                        success: (data) => {
                            location.reload(data);
                        }
                    })
                }
            });