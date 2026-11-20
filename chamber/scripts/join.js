const timestampField = document.querySelector('#timestamp');
if (timestampField) {
  timestampField.value = new Date().toISOString();
}

document.querySelectorAll('[data-benefits]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const dialogId = link.dataset.benefits;
    const dialog = document.getElementById(dialogId);
    if (dialog?.showModal) {
      dialog.showModal();
    }
  });
});

document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

const thankYouFields = document.querySelector('#thank-you-fields');
if (thankYouFields) {
  const params = new URLSearchParams(window.location.search);
  const fields = [
    ['First name', 'firstName'],
    ['Last name', 'lastName'],
    ['Email', 'email'],
    ['Mobile phone', 'mobile'],
    ['Organization', 'organization'],
    ['Membership', 'membership'],
    ['Submitted at', 'timestamp'],
  ];

  thankYouFields.innerHTML = fields.map(([label, name]) => {
    let value = params.get(name)?.trim();
    if (name === 'timestamp' && value) {
      const submittedAt = new Date(value);
      if (!Number.isNaN(submittedAt.getTime())) {
        value = submittedAt.toLocaleString();
      }
    }
    return value ? `<dt>${label}</dt><dd>${value.replace(/[&<>'"]/g, (character) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":"&#39;",'"':'&quot;'}[character]))}</dd>` : '';
  }).join('');
}
