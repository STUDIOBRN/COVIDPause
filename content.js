let condition = node => (node.tagName == 'ARTICLE');
let host = window.location.host;
if (host == 'www.facebook.com') {
    condition = node => (
        node.getAttribute('role') == 'article' ||
        node.getAttribute('data-type') == 'type_facebook_app');
} else if (host == 'news.yahoo.com') {
    condition = node => (
        node.classList.contains('js-stream-content') ||
        node.classList.contains('Cf'));
} else if (host == 'news.google.com') {
    condition = node => (
        node.tagName == 'ARTICLE' ||
        node.getAttribute('aria-label') == 'COVID-19' ||
        (node.getAttribute('jsdata') && node.getAttribute('jsdata').indexOf('covid') != -1))
} else if (host == 'https://www.internethaber.com/') {
    condition = node => (
        node.classList.contains('card'))
      } else if (host == 'https://www.internethaber.com/') {
          condition = node => (
              node.classList.contains('card'))
            } else if (host == 'https://www.sabah.com.tr/') {
                condition = node => (
                    node.classList.contains('card'))
                  } else if (host == 'https://www.milliyet.com.tr/') {
                      condition = node => (
                          node.classList.contains('card'))
                        } else if (host == 'https://www.sozcu.com.tr/') {
                            condition = node => (
                                node.classList.contains('card'))
                              } else if (host == 'https://www.haberler.com/') {
                                  condition = node => (
                                      node.classList.contains('card'))
                                    } else if (host == 'http://www.haber7.com/') {
                                        condition = node => (
                                            node.classList.contains('card'))
                                          } else if (host == 'https://www.ensonhaber.com/') {
                                              condition = node => (
                                                  node.classList.contains('card'))
                                                } else if (host == 'https://www.cnnturk.com/') {
                                                    condition = node => (
                                                        node.classList.contains('card'))
                                                      } else if (host == 'https://tr.sputniknews.com/') {
                                                          condition = node => (
                                                              node.classList.contains('card'))
} else if (host == 'www.hurriyet.com.tr/') {
    condition = node => (
        node.getAttribute('moat-id'))
} else if (host == 'www.theguardian.com') {
    condition = node => (
        node.classList.contains('fc-item'))
} else if (host == 'www.youtube.com') {
    condition = node => (
        node.tagName == 'YTD-VIDEO-RENDERER' ||
        node.tagName == 'YTD-GRID-VIDEO-RENDERER')
} else if (host == 'www.reddit.com') {
    condition = node => (
        node.classList.contains('Post'))
}

function findParentArticle(node, original=node) {
    if (condition(node)) {
        return node;
    }
    let parent = node.parentElement;
    if (parent == null) {
        return original;
    }
    return findParentArticle(parent, original);
}

var sheet = document.createElement('style');
document.body.appendChild(sheet);

function hideNode(node) {
    let parent = findParentArticle(node.parentElement);
    parent.classList.add('covidpause');
}

function fixNode(node, denylist) {
    denylist.forEach(word => {
        if (node.nodeValue.indexOf(word) != -1) {
            hideNode(node);
        }
    })
}

function fixElements(elements, denylist) {
    Array.from(elements).forEach(element => {
        Array.from(element.childNodes).forEach(node => {
            if (node.nodeType === 3) {
                fixNode(node, denylist);
            }
        })
    })
}

let observer;
function setup() {
    // optimized for speed, not accuracy
    // removed first letters to ignore Title Capitalization
    let denylist = [
        'OVID',
        'ovid',
        'algın',
        'ayyip',
        'orona',
        'irus',
        'uarantin',
        'aglik',
        'vaka',
        'rdogan',
        'andemik',
        'esafe',
        'aranatina',
        'ockdown',
        'andemic'
    ];

    sheet.innerHTML = ".covidpause {display: none !important}";

    fixElements(document.getElementsByTagName('*'), denylist);

    observer = new MutationObserver(mutations => {
        // would be great to limit these updates only to the modified elements
        // but i haven't found a way to do that consistently
        fixElements(document.getElementsByTagName('*'), denylist);
    });

    var config = {
        childList: true,
        subtree: true,
        characterData: true
    };

    observer.observe(document.body, config);
    console.log('connect')
}

function teardown() {
    sheet.innerHTML = ".covidpause {}";
    if (observer) {
        observer.disconnect();
        console.log('disconnect')
    }
}

chrome.storage.local.get(['enabled'], result => {
    if (result.enabled) {
        setup();
    }
})

chrome.storage.onChanged.addListener(storage => {
    let enabled = storage.enabled.newValue;
    if (enabled) {
        setup();
    } else {
        teardown();
    }
})
