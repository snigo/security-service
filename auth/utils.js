const maskText = (text, leading = 2, trailing = leading) => {
  if (text.length < leading + trailing + 2) return maskText(text, text.length - 2);
  return text.slice(0, leading) + '*'.repeat(text.length - leading - trailing) + text.slice(-trailing);
};

module.exports = {
  maskText,
};
