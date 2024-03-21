export const encodeToBase64 = (string) => Buffer.from(string).toString('base64');

export const decodeToAscii = (encodedString) =>
    Buffer.from(encodedString, 'base64').toString('ascii');

export const sleep = (ms: number) =>
    new Promise((resolve) => {
        console.log('Sleeping');
        // eslint-disable-next-line no-promise-executor-return
        setTimeout(resolve, ms);
    });

export const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index += 1) {
        // eslint-disable-next-line no-await-in-loop
        await callback(array[index], index, array);
    }
};

export const simplePagination = async (req) => {
    const pagination = {
        page: 0,
        row: 10,
    };

    if (req.query.row !== undefined) {
        pagination.row = req.query.row;
    }

    if (req.query.page !== undefined) {
        pagination.page = (req.query.page - 1) * pagination.row;
    }
    return pagination;
};

export const paginate = async (arr, row = 10, page = 1) => {
    return arr.slice((page - 1) * row, page * row)
};