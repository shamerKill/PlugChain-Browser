const ComConToolsCopy = (copyData: string) => {
  try {
    const inputEle = document.createElement('input');
    inputEle.style.position = 'fixed';
    inputEle.style.left = '-100%';
    inputEle.style.top = '-100%';
    inputEle.value = copyData;
    document.body.appendChild(inputEle);
    inputEle.select();
    document.execCommand('Copy');
    document.body.removeChild(inputEle);
    return true;
  } catch (e) {
    return false;
  }
};

export default ComConToolsCopy;
