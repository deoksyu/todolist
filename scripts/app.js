(function(){
  const input = () => Utils.qs('#task-input');
  const addBtn = () => Utils.qs('#add-btn');
  const list = () => Utils.qs('#task-list');
  const hint = () => Utils.qs('#hint');

  function showHint(msg){
    hint().textContent = msg || '';
  }

  function bootstrap(){
    const persisted = StorageAPI.load();
    AppState.init(persisted);
    Renderer.render(AppState.getState());

    // Add handlers
    addBtn().addEventListener('click', onAdd);
    input().addEventListener('keydown', (e)=>{
      if (e.key === 'Enter') onAdd();
    });

    // Delegation on list
    list().addEventListener('click', (e)=>{
      const target = e.target;
      const li = target.closest('.task-item');
      if (!li) return;
      const id = li.dataset.id;

      if (target.classList.contains('delete-btn')){
        AppState.deleteTask(id);
        persistAndRender();
      }
    });

    list().addEventListener('change', (e)=>{
      const target = e.target;
      if (target.classList.contains('toggle')){
        const li = target.closest('.task-item');
        if (!li) return;
        AppState.toggleTask(li.dataset.id);
        persistAndRender();
      }
    });

    // Editing via double-click contenteditable
    list().addEventListener('dblclick', (e)=>{
      const textEl = e.target.closest('.text');
      if (!textEl) return;
      const li = textEl.closest('.task-item');
      if (!li) return;

      enterEdit(textEl, li.dataset.id);
    });
  }

  function onAdd(){
    const value = input().value.trim();
    if (!value){
      showHint('빈 항목은 추가할 수 없습니다.');
      input().focus();
      return;
    }
    showHint('');
    AppState.addTask(value);
    input().value = '';
    persistAndRender();
  }

  function enterEdit(textEl, id){
    const original = textEl.textContent;
    textEl.contentEditable = 'true';
    textEl.focus();

    function cleanup(){
      textEl.contentEditable = 'false';
      textEl.removeEventListener('keydown', onKey);
      textEl.removeEventListener('blur', onBlur);
    }

    function save(){
      const next = textEl.textContent.trim();
      if (!next){
        // revert if empty per PRD
        textEl.textContent = original;
      } else if (next !== original){
        AppState.updateTask(id, next);
        persistAndRender();
      }
      cleanup();
    }

    function cancel(){
      textEl.textContent = original;
      cleanup();
    }

    function onKey(e){
      if (e.key === 'Enter'){
        e.preventDefault();
        save();
      } else if (e.key === 'Escape'){
        e.preventDefault();
        cancel();
      }
    }
    function onBlur(){ save(); }

    textEl.addEventListener('keydown', onKey);
    textEl.addEventListener('blur', onBlur);
    // place caret at end
    const range = document.createRange();
    range.selectNodeContents(textEl);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function persistAndRender(){
    const ok = StorageAPI.save(AppState.getState());
    if (!ok){
      showHint('저장에 실패했습니다. 저장소 용량 또는 권한을 확인하세요.');
    }
    Renderer.render(AppState.getState());
  }

  window.addEventListener('DOMContentLoaded', bootstrap);
})();
