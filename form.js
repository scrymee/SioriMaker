var room = 1;
function education_fields() {

    room++;
    var objTo = document.getElementById('sort_area')
    var divtest = document.createElement("div");
    divtest.setAttribute("class", "form-group removeclass" + room);

    //最後の要素を取得
    const contents = document.getElementsByClassName('contentlist')
    const baseContent = contents[contents.length - 1]
    const content = baseContent.cloneNode(true)
    content.id = 'content' + room


    content.querySelector('.time').value = baseContent.querySelector('.time').value
    content.querySelector('.headline').value = ''
    content.querySelector('.text').value = ''

    content.querySelector('.addBtn').classList.remove('btn-success')
    content.querySelector('.addBtn').classList.add('btn-danger')
    content.querySelector('.addBtn').setAttribute('onclick', 'remove_education_fields(' + room + ')')
    content.querySelector('.glyphicon').classList.remove('glyphicon-plus')
    content.querySelector('.glyphicon').classList.add('glyphicon-minus')
    console.log(content)
    divtest.appendChild(content)


    objTo.appendChild(divtest)
}
function remove_education_fields(rid) {
    $('.removeclass' + rid).remove();
}