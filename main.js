const windowsLineSeparator = '\r\n';
const unixLineSeparator = '\n';

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

// TODO do event handling on document level?
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
            addNewSong(line);
        }
    }
}

function getLineSeparator(content = '') {
    let lineSeparator = unixLineSeparator;
    if (content.includes(windowsLineSeparator)) {
        lineSeparator = windowsLineSeparator;
    }
    return lineSeparator;
}

function download(e) {
    const filename = '' + document.getElementById('setlist-file-name-input').value + '.txt';
    e.preventDefault();
    const songTitleNodes = document.querySelectorAll('.song-title');
    let text = '';
    for (const child of songTitleNodes) {
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

function deleteSongFromList() {
    this.closest('li').remove();
}

function createButton() {
    return document.createElement('button');
}

function moveSongUp() {
    const listElement = this.closest('li');
    if (listElement.previousElementSibling) {
        listElement.parentNode.insertBefore(listElement, listElement.previousElementSibling);
    }
}

function moveSongDown() {
    const listElement = this.closest('li');
    if (listElement.nextElementSibling) {
        listElement.parentNode.insertBefore(listElement.nextElementSibling, listElement);
    }
}

function createDeleteNode(parent) {
    const deleteNode = createButton();
    deleteNode.classList.add('material-icons', 'delete-song-button', 'print-invisible', 'list-item-buttons');
    deleteNode.appendChild(document.createTextNode('clear'));
    deleteNode.addEventListener('click', deleteSongFromList)
    parent.appendChild(deleteNode);
}

function createUpAndDownNode(parent) {
    const upNode = createButton();
    upNode.classList.add('material-icons', 'move-song-up-button', 'print-invisible', 'list-item-buttons');
    upNode.appendChild(document.createTextNode('expand_less'));
    upNode.addEventListener('click', moveSongUp)
    parent.appendChild(upNode);
    const downNode = createButton();
    downNode.classList.add('material-icons', 'move-song-down-button', 'print-invisible', 'list-item-buttons');
    downNode.appendChild(document.createTextNode('expand_more'));
    downNode.addEventListener('click', moveSongDown)
    parent.appendChild(downNode);

}

function createSongTitleNode(parent, songTitle) {
    const songNode = document.createElement('span');
    const attr = document.createAttribute('draggable');
    attr.value = 'true';
    songNode.setAttributeNode(attr);
    songNode.classList.add('draggable', 'song-title');
    const textNode = document.createTextNode(songTitle);
    songNode.appendChild(textNode);
    parent.appendChild(songNode);
}

function createListItemContainer(parent) {
    const container = document.createElement('div');
    container.classList.add('list-item-container');
    parent.appendChild(container);
    return container;
}

function createListElement(songTitle) {
    const newListElement = document.createElement('li');
    if (songTitle.startsWith('---')) {
        newListElement.classList.add('numbering-exclude')
    }
    const container = createListItemContainer(newListElement);
    createSongTitleNode(container, songTitle);
    createUpAndDownNode(container);
    createDeleteNode(container);
    return newListElement;
}

function addNewSong(songTitle) {
    const listNode = document.querySelector('ol');
    const newListElement = createListElement(songTitle);
    listNode.appendChild(newListElement);
    addDragAndDropHandlers(newListElement);
}

document.getElementById('setlist-name-input').addEventListener("keyup", function (event) {
    const inputValue = event.target.value;
    if (event.code === 'Enter' && inputValue !== '') {
        addNewSong(inputValue);
        event.target.value = '';
    }
});

document.getElementById('select-file-button')
    .addEventListener('click', selectFileForImport);

document.getElementById('file-input')
    .addEventListener('change', handleFileSelect);

document.getElementById('download-form')
    .addEventListener('submit', download);

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
