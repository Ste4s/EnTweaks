// Description: This script is used to fix empty code blocks after pasting content into Evernote Web.
// The script listens for the 'Ctrl' + 'V' key combination, then waits for the paste operation to complete.
// After the paste operation, it searches for empty code blocks and appends a <br> element to them.
// This ensures that empty code blocks are visible in Evernote Web.
// ---------------------------------------------------------------------

document.removeEventListener('keydown', handleFixedCodeblockPaste);
function handleFixedCodeblockPaste(event) {
    if (event.ctrlKey && event.key === 'v') {
        let attempts = 0;
        console.log('Paste event detected');

        // Delay execution to let the native paste complete
        setTimeout(function() {
            // Access the content after the paste has completed
            var content = document.querySelector('#editable-div').innerHTML;
            console.log('Content after paste:', content);

            // Here you can manipulate the content as needed
            // For example, scanning for certain text patterns or cleaning the data
        }, 0); // A timeout of 0 ms ensures the function runs after the current call stack has cleared

        console.log('Document is:', document);

        // find all iframes on the page
        var iframes = document.querySelectorAll('iframe');
        console.log('Found ' + iframes.length + ' iframes');
        // iterate iframes looking for one that contains element with id 'en-note'
        var noteRoot = null;
        for (var i = 0; i < iframes.length; i++) {
            var iframe = iframes[i];
            console.log('  Checking iframe:', iframe);
            var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            noteRoot = iframeDoc.getElementById('en-note');
            if (noteRoot) {
                console.log('  Found note root:', noteRoot);
                break;  // stop looking after finding the first note root
            }
        }

        console.log ("This is the note root I found: " + noteRoot)

        // delay execution to let the native paste complete
        setTimeout(function() {
            // access the content after the paste has completed
            var content = noteRoot.innerHTML;
            console.log('Content after paste:', content);

            // here you can manipulate the content as needed
            // for example, scanning for certain text patterns or cleaning the data

            // var noteRoot = document.getElementById('en-note');
            // console.log('Found note root:', noteRoot);

            if (!noteRoot) {
                console.log('Note root not found');
                return;
            }

            var codeBlocks = noteRoot.querySelectorAll('en-codeblock');
            console.log('  Found ' + codeBlocks.length + ' code blocks');

            // iterate found code blocks
            codeBlocks.forEach(function(codeBlock) {
                console.log('    Code block:', codeBlock);
                // find all div elements with the attribute data-plaintext="true"
                var divs = codeBlock.querySelectorAll('div');
                console.log('    Found ' + divs.length + ' div(s)');
                // iterate over found div elements
                divs.forEach(function(div) {
                    console.log('      Div:', div);

                    try {
                        console.log('      Inner HTML:', div.innerHTML);
                        // check if the div is empty and does not contain a <br> element
                        if (div.innerHTML.trim() === '' && !div.querySelector('br')) {
                            console.log('      *** Empty div (fixing it now) ***: ', div);

                            // clear the div content
                            div.innerHTML = '';

                            var br = document.createElement('br');
                            br.className = 'ProseMirror-trailingBreak';
                            div.appendChild(br);
                            div.innerHTML = div.innerHTML;  // Update the innerHTML of the div
                            console.log('      Fixed div:', div);
                        }
                    }
                    catch (e) {
                        console.log('      No innerHTML:', e);
                    }
                });
            });
        }, 0); // a timeout of 0 ms ensures the function runs after the current call stack has cleared 
    }
}

// Add listener
document.addEventListener('keydown', handleFixedCodeblockPaste);

// Remove listener
//document.removeEventListener('keydown', handleFixedCodeblockPaste);
