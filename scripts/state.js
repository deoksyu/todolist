(function(){
  const State = {
    tasks: [],
  };

  function init(initial){
    State.tasks = Array.isArray(initial?.tasks) ? initial.tasks.slice() : [];
  }

  function addTask(text){
    const now = new Date().toISOString();
    const t = { id: Utils.uuid(), text, done: false, createdAt: now, updatedAt: now };
    State.tasks = [t, ...State.tasks];
    return t.id;
  }

  function toggleTask(id){
    const now = new Date().toISOString();
    State.tasks = State.tasks.map(t => t.id === id ? { ...t, done: !t.done, updatedAt: now } : t);
  }

  function updateTask(id, text){
    const now = new Date().toISOString();
    State.tasks = State.tasks.map(t => t.id === id ? { ...t, text, updatedAt: now } : t);
  }

  function deleteTask(id){
    State.tasks = State.tasks.filter(t => t.id !== id);
  }

  function getState(){ return { tasks: State.tasks.slice() }; }

  window.AppState = { init, addTask, toggleTask, updateTask, deleteTask, getState };
})();
