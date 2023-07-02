const fetch = require('cross-fetch');

const fileUrl = 'http://sandbox-offline-stream.pod.ir/PROGRESSIVE/367TLMBI5MQRCT31181817611688281643145';
const chunkSize = 500000;
const totalFileSize = 284796173;

const downloadFileWithRange = (url, startByte, endByte) => {
    const headers = {
        '_token_': 'ed24e37c7ee84313acf2805a80122f94',
        'Range': `bytes=${startByte}-${endByte}`,
        'Authorization': 'Bearer 4f8d523e76874f019f2bcd9959cfa16d.XzIwMjM1'
    };

    return fetch(url, { headers })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Download failed with status ${response.status}`);
            }
            return response.blob();
        })
        .catch(error => {
            console.error('Error occurred during download:', error.message);
            // Handle the error gracefully, e.g., retry, log, or display an error message to the user
        });
};

const downloadFileInChunks = async () => {
    let startByte = 0;
    let endByte = chunkSize - 1;

    while (startByte < totalFileSize) {
        await downloadFileWithRange(fileUrl, startByte, endByte);

        startByte += chunkSize;
        endByte = Math.min(startByte + chunkSize - 1, totalFileSize - 1);
    }
};

downloadFileInChunks()
    .then(() => {
        console.log('File download complete');
    })
    .catch(error => {
        console.error('Error occurred during download:', error);
    });
