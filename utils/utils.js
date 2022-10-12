const linkTemplate = require('./regExpForValidation');

function validateUrl(url) {
  if (linkTemplate.test(url)) {
    return url;
  }

  throw new Error('Некорректная ссылка');
}

module.exports = { validateUrl };
