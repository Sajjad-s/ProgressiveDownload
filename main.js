const fetch = require('cross-fetch');

const requestUrl = 'http://10.56.16.54:80/register/?token=ed24e37c7ee84313acf2805a80122f94&hashFile=367TLMBI5MQRCT31&security=true&streamType=PROGRESSIVE';

fetch(requestUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const progressiveLink = data.progressiveLink;
        const totalFileSize = data.size;

        console.log('File download initiated');
        console.log('Progressive Link:', progressiveLink);
        console.log('Total File Size:', totalFileSize);

        downloadFileInChunks(progressiveLink, totalFileSize);
    })
    .catch(error => {
        console.error('Error occurred during request:', error);
    });

var counter = 0;
const downloadFileWithRange = (url, startByte, endByte) => {
    const headers = {
        '_token_': 'ed24e37c7ee84313acf2805a80122f94',
        'Range': `${startByte}-${endByte}`,
        'Authorization': 'Bearer 4f8d523e76874f019f2bcd9959cfa16d.XzIwMjM1'
    };

    return fetch(url, {headers})
        .then(response => {
            if (!response.ok) {
                throw new Error(`Download failed with status ${response.status}`);
            }
            return response.blob();
        })
        .then(blob => {
            const chunkSize = blob.size;
            console.log(`Chunk ${counter} - startByte: ${startByte}, endByte: ${endByte}, Downloaded chunk size: ${chunkSize} bytes, Total downloaded `);
            counter++;
            return blob;
        })
        .catch(error => {
            console.error('Error occurred during download:', error.message);
        });
};

const downloadFileInChunks = async (fileUrl, totalFileSize) => {
    const chunkSize = 500000;
    let startByte = 0;
    let endByte = chunkSize;

    const downloadChunk = async () => {
        if (startByte < totalFileSize) {
            await downloadFileWithRange(fileUrl, startByte, endByte);
            startByte += chunkSize;
            endByte = Math.min(startByte + chunkSize, totalFileSize);

            setTimeout(downloadChunk, 300); // Wait for 300 milliseconds before downloading the next chunk
        } else {
            console.log('File download complete');
        }
    };

    await downloadChunk();
};