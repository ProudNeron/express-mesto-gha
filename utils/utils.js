const linkTemplate = /^https?:\/\/w*\.?[A-Za-z0-9-._~:/?#[\]@!$&'()*+,;=]+\.[a-z]+\/?#?/;
const validateUrl = (url) => {
  if (linkTemplate.test(url)) {
    return url;
  }

  throw new Error('Некорректная ссылка');
};

module.exports = { validateUrl };
