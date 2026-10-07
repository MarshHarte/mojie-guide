(() => {
  const notice = document.querySelector('#notice');
  let dismiss;
  function announce(message) {
    clearTimeout(dismiss);
    notice.textContent = message;
    notice.hidden = false;
    dismiss = setTimeout(() => { notice.hidden = true; }, 6500);
  }
  async function copy(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const field = document.createElement('textarea');
        field.value = text;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.left = '-9999px';
        document.body.append(field);
        field.select();
        const ok = document.execCommand('copy');
        field.remove();
        if (!ok) throw new Error('Copy unavailable');
      }
      announce('链接已复制，可以粘贴保存。');
    } catch {
      announce('未能自动复制，请手动选择并复制链接：' + text);
    }
  }
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', () => copy(button.dataset.copy));
  });
  document.querySelectorAll('[data-bookmark]').forEach(button => {
    button.addEventListener('click', () => {
      const mobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
      const mac = /Mac/i.test(navigator.platform);
      announce(mobile ? '打开浏览器菜单，选择“添加书签”或“添加到主屏幕”。' : `按 ${mac ? '⌘' : 'Ctrl'} + D 收藏本页，也可从浏览器菜单添加书签。`);
    });
  });
  document.querySelector('[data-copy-page]').addEventListener('click', () => {
    const current = new URL(location.href);
    if (current.protocol === 'file:' || ['localhost', '127.0.0.1', '::1', '[::1]'].includes(current.hostname)) {
      announce('这是本地预览。部署后再复制本页链接，方便在其他设备访问。');
      return;
    }
    current.hash = '';
    current.search = '';
    copy(document.querySelector('link[rel="canonical"]')?.href || current.href);
  });
})();
