const fetch = require('cross-fetch');

const fileUrl = 'http://127.0.0.1:8081/PROGRESSIVE/9BF9VF6LBPCR22TD181817611688293216669';
const chunkSize = 500000;
const totalFileSize = 284796173;

const downloadFileWithRange = (url, startByte, endByte) => {
    const headers = {
        '_token_': 'ed24e37c7ee84313acf2805a80122f94',
        'Range': `${startByte}-${endByte}`,
        'Authorization': 'Bearer 4f8d523e76874f019f2bcd9959cfa16d.XzIwMjM1'
    };

    return fetch(url, { headers })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Download failed with status ${response.status}`);
            }
            return response.blob();
        })
        .then(blob => {
            const chunkSize = blob.size;
            console.log(`Downloaded chunk size: ${chunkSize} bytes`);
            return blob;
        })
        .catch(error => {
            console.error('Error occurred during download:', error.message);
        });
};

const downloadFileInChunks = async () => {
    let startByte = 0;
    let endByte = chunkSize - 1;

    while (startByte < 5000000) {
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
