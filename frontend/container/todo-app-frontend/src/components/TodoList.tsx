/** @jsxImportSource @emotion/react */
"use client";
import React, { useState, useEffect, Fragment, useRef } from "react";
import TodoItem from "@/components/todoModules/TodoItem";
import AddTaskButton from "@/components/todoModules/AddTaskButton";
import { fetchTodoList, TodoType } from "@/lib/todo/apiClient";
import { MOCK_syncTodoListWithDB } from "../../mocks/expandedJsonServerApi";
import LoadingSpinner from "@/components/utilModules/LoadingSpinner";
//import "./todoTransition.css";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { css } from "@emotion/react";

const todoTransition = css`
  .todo-enter {
    opacity: 0;
    transform: translateY(20px);
  }
  .todo-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 1000ms, transform 1000ms;
  }
  .todo-exit {
    opacity: 1;
    height: 232px; /* TodoItemの高さに合わせて調整 */
    overflow: hidden;
    margin-bottom: 16px; /* 必要なら */
    padding: 0 0;
  }
  .todo-exit-active {
    opacity: 0;
    height: 0;
    margin-bottom: 0;
    padding: 0 0;
    transition: opacity 1000ms, height 1000ms, margin 1000ms, padding 1000ms;
  }
`;

export default function ToDoList() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientTodoList, updateTodoLocal] = useState<TodoType[]>([]);
  const nodeRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement | null> }>({});
  clientTodoList.forEach((todo) => {
    if (!nodeRefs.current[todo.id]) {
      nodeRefs.current[todo.id] = React.createRef<HTMLDivElement>();
    }
  });
  const updateOneLocal = (newTodo: TodoType) => {
    //react内のtodoListステートを変更する。DBと同期していないことに注意
    updateTodoLocal((todoList) => todoList.map((todo) => (todo.id === newTodo.id ? { ...newTodo } : todo)));
  };
  const addTodoLocal = (newTodo: TodoType) => {
    //react内のtodoListステートを変更する。DBと同期していないことに注意
    updateTodoLocal((todoList) => [...todoList, newTodo]);
  };
  const deleteOneLocal = (id: string) => {
    //react内のtodoListステートを変更する。DBと同期していないことに注意
    updateTodoLocal((tasks) => tasks.filter((task) => task.id !== id));
  };
  const [remoteTodoList, syncRemoteTodoList] = useState<TodoType[]>([]);
  const updateRemoteView = (tasks: TodoType[]) => syncRemoteTodoList(tasks);
  useEffect(() => {
    (async () => {
      const todos = await fetchTodoList();
      updateTodoLocal(todos);
    })() //※ 即時実行関数(IIFE: Immediately Invoked Function Expression)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []); //※ ここはリロード時に実行(useEffectの第二引数に空配列を置くとそうなる)
  if (error) {
    return (
      <>
        <div>申し訳ありません。ToDo表示においてエラーが発生しました。</div>
        <div>問題はページの更新によって解決する場合があります。</div>
        <div>詳しくは以下のエラーメッセージを参照してください: </div>
        <div>{error}</div>
      </>
    );
  } else if (loading) {
    return <LoadingSpinner variant="cute" />;
  }
  return (
    <>
      {/* {clientTodoList.map((todo) => (
        <Fragment key={todo.id}>
          <TodoItem data={todo} updateOneLocal={updateOneLocal} deleteOneLocal={deleteOneLocal} />
        </Fragment>
      ))} */}
      <span css={todoTransition}>
        <TransitionGroup component={null}>
          {clientTodoList.map((todo) => (
            <CSSTransition key={todo.id} timeout={1000} classNames="todo" nodeRef={nodeRefs.current[todo.id]}>
              <div ref={nodeRefs.current[todo.id]}>
                <TodoItem data={todo} updateOneLocal={updateOneLocal} deleteOneLocal={deleteOneLocal} />
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </span>
      <AddTaskButton addTodoLocal={addTodoLocal} />
      <div
        onClick={async () => {
          updateRemoteView(clientTodoList);
          updateTodoLocal(await MOCK_syncTodoListWithDB(clientTodoList));
        }}
      >
        <div>DB同期:</div>
        履歴{remoteTodoList.map((todo) => `${todo.id}: ${todo.title}`).join("\n")}
      </div>
    </>
  );
}
