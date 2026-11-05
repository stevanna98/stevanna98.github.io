const projects = {
  '1': {title: 'A research question', intro: 'A place for your first project: the question that started it, the process behind it, and the ideas it led to.'},
  '2': {title: 'Another way of seeing', intro: 'A second project can reveal a different side of your practice, an unexpected approach, or a fruitful collaboration.'},
  '3': {title: 'Connecting the dots', intro: 'Use this space for a flagship project. Bring together the problem, the methods, and the story behind the outcome.'}
};
const dialog = document.querySelector('#project-dialog');
let projectTrigger = null;
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.dataset.project;
    const project = projects[key];
    if (!project) return;
    projectTrigger = button;
    document.querySelector('#dialog-number').textContent = `PROJECT / 0${key}`;
    document.querySelector('#dialog-title').textContent = project.title;
    document.querySelector('#dialog-intro').textContent = project.intro;
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('modal-open');
    document.querySelector('.dialog-close').focus();
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  projectTrigger?.focus({preventScroll:true});
});
