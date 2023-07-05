const fetch = require('cross-fetch');

const requestUrl = 'http://10.56.16.54:80/register/?token=ed24e37c7ee84313acf2805a80122f94&hashFile=367TLMBI5MQRCT31&security=true&streamType=PROGRESSIVE';
var counter = 0;
const chunkSize = 500000;
let startByte = 0;
let endByte = chunkSize;


const headers = {
    '_token_': 'ed24e37c7ee84313acf2805a80122f94',
    'Range': `${startByte}-${endByte}`,
    'Authorization': 'Bearer 4f8d523e76874f019f2bcd9959cfa16d.XzIwMjM1'
};

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

        console.log('\x1b[32m%s\x1b[0m', 'File download initiated');
        console.log('\x1b[32m%s\x1b[0m', 'Progressive Link:', progressiveLink);
        console.log('\x1b[32m%s\x1b[0m', 'Total File Size:', totalFileSize);

        downloadFileInChunks(progressiveLink, totalFileSize);
    })
    .catch(error => {
        console.error('Error occurred during request:', error);
    });

const downloadFileWithRange = (url, startByte, endByte) => {


    return fetch(url, {headers})
        .then(response => {
            if (!response.ok) {
                throw new Error(`Download failed with status ${response.status}`);
            }
            return response.blob();
        })
        .then(blob => {
            const downloadedSize = blob.size;
            console.log('\x1b[32m%s\x1b[0m',`Chunk ${counter} - startByte: ${startByte}, endByte: ${endByte}, Downloaded chunk size: ${chunkSize} bytes, Total downloaded: ${downloadedSize}`);
            if (downloadedSize !== chunkSize)
            {
                console.log(`Error in counter: ${counter}, downloaded size of this chunk: ${downloadedSize}`);
            }
                counter++;
            return blob;
        })
        .catch(error => {
            console.error('Error occurred during download:', error.message);
        });
};

const downloadFileInChunks = async (fileUrl, totalFileSize) => {
    const downloadChunk = async () => {
        if (startByte < totalFileSize) {
            await downloadFileWithRange(fileUrl, startByte, endByte);
            startByte += chunkSize;
            endByte = Math.min(startByte + chunkSize, totalFileSize);

            setTimeout(downloadChunk, 300); // Wait for 300 milliseconds before downloading the next chunk
        } else {
            console.log('\x1b[32m%s\x1b[0m', 'File download complete');
        }
    };

    await downloadChunk();
};