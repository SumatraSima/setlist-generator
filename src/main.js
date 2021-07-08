let dragSrcEl = null;

function handleDragStart(e) {
    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);

    this.classList.add('dragElem');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    this.classList.add('over');
    e.dataTransfer.dropEffect = 'move';
    return false;
}


function handleDragLeave() {
    this.classList.remove('over');
}

function handleDrop(e) {

    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (dragSrcEl !== this) {
        this.parentNode.removeChild(dragSrcEl);
        const dropHTML = e.dataTransfer.getData('text/html');
        this.insertAdjacentHTML('beforebegin', dropHTML);
        const dropElem = this.previousSibling;
        addDragAndDropHandlers(dropElem);
    }
    this.classList.remove('over');
    this.classList.remove('dragElem')
    return false;
}

function handleDragEnd() {
    this.classList.remove('over');
}

function addDragAndDropHandlers(elem) {
    elem.addEventListener('dragstart', handleDragStart, false);
    elem.addEventListener('dragover', handleDragOver, false);
    elem.addEventListener('dragleave', handleDragLeave, false);
    elem.addEventListener('drop', handleDrop, false);
    elem.addEventListener('dragend', handleDragEnd, false);

}

const cols = document.querySelectorAll('.draggable');
[].forEach.call(cols, addDragAndDropHandlers);

function selectFileForImport() {
    document.getElementById('file-input').click();
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length < 1) {
        alert('select a file...');
        return;
    }
    const file = files[0];
    const reader = new FileReader();
    reader.onload = onFileLoaded;
    //TODO handle invalid file formats
    reader.readAsText(file);
}

function onFileLoaded(e) {
    const content = e.target.result;
    const lines = content.split(getLineSeparator(content));
    const ol = document.querySelector('ol');
    ol.innerHTML = '';
    for (const line of lines) {
        if (line && line.trim().length !== 0) {
            const node = document.createElement("li");
            node.classList.add('draggable');
            if (line.startsWith('---')) {
                node.classList.add('numbering-exclude')
            }
            const attr = document.createAttribute('draggable');
            attr.value = 'true';
            node.setAttributeNode(attr);
            const textNode = document.createTextNode(line);
            node.appendChild(textNode);
            ol.appendChild(node);
            addDragAndDropHandlers(node);
        }
    }
}


const windowsLineSeparator = '\r\n';
const unixLineSeparator = '\n';

function getLineSeparator(content = '') {
    let lineSeparator = unixLineSeparator;
    if (content.includes(windowsLineSeparator)) {
        lineSeparator = windowsLineSeparator;
    }
    return lineSeparator;
}

function download(e) {
    const filename = '' + document.getElementById('setlistName').value + '.txt';
    e.preventDefault();
    const list = document.getElementById('setlist');
    let text = '';
    for (const child of list.children) {
        text += child.textContent + getLineSeparator(text);
    }
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.setAttribute('target', '_blank');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function addNewSong(newItem) {
    const li = document.createElement('li');
    const attr = document.createAttribute('draggable');
    const ol = document.querySelector('ol');
    li.classList.add('draggable');
    attr.value = 'true';
    li.setAttributeNode(attr);
    li.appendChild(document.createTextNode(newItem));
    ol.appendChild(li);
    addDragAndDropHandlers(li);
}

function addNewItem() {
    const songTitle = document.querySelector('.add.input').value;
    if (songTitle !== '') {
        addNewSong(songTitle);
    }
    document.querySelector('.input').value = '';
}

const addInput = document.querySelector('.input.add');
addInput.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        addNewItem();
        event.target.value = '';
    }

});

[
    'Gonna Leave You',
    'Shadow Play',
    'Territorial Pissings',
    'R.A.M.O.N.E.S',
    'In My Head',
    'DD - Cinnamon Girl',
    'Paranoid',
    'Get It On',
    'D - F*!#in\' Up',
    'Hybrid Moments',
    'Where Eagles Dare',
    'City Of Angels',
    'Rockin\' in the Free World',
    'I Got Erection',
    'Das schlimmste ist, wenn das Bier alle ist',
    'Make It Wit Chu',
    'Ich hab\' mit Tocotronic Bier getrunken',
    'True Believers',
    'I Wanna Be Forgotten',
    'Großes Glied',
    'Denim Demon',
    'Murder The Government',
    'Attitude',
    'Halt die Fresse ich will saufen',
    'Today Your Love, Tomorrow The World',
    'Not Ready To Rock',
    'Good Head',
    'Skulls',
    'Roots Radical',
    'Alternative Ulster',
    'Breaking the Law',
    'Get It On',
    'Satisfied',
    'Blood and Booze',
    'Light My Way',
    'Beer, Beer, Beer, Beer',
    'Fell In Love With A Girl'
].forEach(addNewSong);