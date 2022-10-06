const uniqid = require('uniqid');

const generateUniqueString = (prefix = '') => uniqid(prefix);

const passwordValidation = (value) => {
    // eslint-disable-next-line no-useless-escape
    const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
    return re.test(value);
};
const jwtResetPasswdSecretSalt = 'G!gAVu$@123';

const paymentMethodObj = Object.freeze({
    1: 'DebitCard',
    2: 'CreditCard',
    3: 'Netbanking',
    4: 'upi',
    5: 'cash',
    6: 'others',
});

const paymentGatewayObj = Object.freeze({
    1: 'razorPay',
    2: 'cash',
});

const storageTypeObj = Object.freeze({
    1: 'server',
    2: 'aws',
    // 3: 'Netbanking',
    // 4: 'upi',
    // 5: 'others',
});

const chatSecret = 'HYDRA!@#$meet$#@!';

const stopWords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
    'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its',
    'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this',
    'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
    'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because',
    'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out',
    'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where',
    'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
    'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just',
    'don', 'should', 'now'];

module.exports = {
    generateUniqueString,
    passwordValidation,
    jwtResetPasswdSecretSalt,
    paymentMethodObj,
    paymentGatewayObj,
    chatSecret,
    stopWords,
    storageTypeObj,
};