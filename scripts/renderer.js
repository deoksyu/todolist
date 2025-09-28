(function(){
  const listEl = () => Utils.qs('#task-list');

  function render(state){
    const ul = listEl();
    ul.innerHTML = '';
    const frag = document.createDocumentFragment();
    state.tasks.forEach(task => frag.appendChild(renderTaskItem(task)));
    ul.appendChild(frag);
  }

  function renderTaskItem(task){
    const li = document.createElement('li');
    li.className = 'task-item' + (task.done ? ' done' : '');
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'toggle';
    checkbox.checked = task.done;
    checkbox.setAttribute('aria-label', '완료 체크');

    const label = document.createElement('label');
    label.htmlFor = 'cb-' + task.id;

    const text = document.createElement('div');
    text.className = 'text';
    text.textContent = task.text;

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = '삭제';
    del.setAttribute('aria-label', '항목 삭제');

    // connect checkbox id + label
    checkbox.id = 'cb-' + task.id;
    label.appendChild(checkbox);
    label.appendChild(text);

    li.appendChild(label);
    li.appendChild(del);

    return li;
  }

  window.Renderer = { render, renderTaskItem };
})();
