export const convertStringToDom = (htmlString: string) => {
  // TODO: 字符串合法性校验
  const docRange = document.createRange();
  const documentFragment = docRange.createContextualFragment(htmlString);
  return documentFragment;
};
