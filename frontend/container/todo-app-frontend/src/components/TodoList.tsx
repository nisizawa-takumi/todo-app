/** @jsxImportSource @emotion/react */
"use client";
import React, { useState, useEffect, Fragment, useRef } from "react";
import TodoItem from "@/components/todoModules/TodoItem";
import AddTaskButton from "@/components/todoModules/AddTaskButton";
import SyncModeToggle from "@/components/todoModules/SyncModeToggle";
import { TodoType } from "@/lib/todo/apiClient";
import LoadingSpinner from "@/components/utilModules/LoadingSpinner";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { css } from "@emotion/react";
import { useTodoCrud } from "@/hooks/todoCrud";
import { fetchTodoList } from "@/lib/todo/apiClient";

const todoTransition = css`
  .todo-appear {
    opacity: 0;
    transform: translateY(20px);
  }
  .todo-appear-active {
    opacity: 1;
    transform: translateY(0);
    transition: 1000ms;
  }
  .todo-enter {
    opacity: 0;
    transform: translateY(20px);
  }
  .todo-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: 1000ms;
  }
  .todo-exit {
    opacity: 1;
    height: 232px; /* TodoItemの高さに合わせて調整 (chromeの検証使うと便利)*/
    overflow: hidden;
    margin-bottom: 16px; /* 必要なら */
    padding: 0 0;
  }
  .todo-exit-active {
    opacity: 0;
    height: 0;
    margin-bottom: 0;
    padding: 0 0;
    transition: 1000ms;
  }
`;

export default function ToDoList() {
  const [error, setError] = useState<string | null>(null);
  const [syncMode, setSyncMode] = useState<"api" | "local">("api");
  const [clientTodoList, setClientTodoList] = useState<TodoType[]>([]);
  const { addOne, updateOne, deleteOne, syncTodos } = useTodoCrud(clientTodoList, setClientTodoList, syncMode);
  const [loading, setLoading] = useState(true);
  const nodeRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement | null> }>({});
  clientTodoList.forEach((todo) => {
    if (!nodeRefs.current[todo.id]) {
      nodeRefs.current[todo.id] = React.createRef<HTMLDivElement>();
    }
  });
  useEffect(() => {
    (async () => {
      const fetched = await fetchTodoList();
      setClientTodoList(fetched);
    })() //※ 即時実行関数(IIFE: Immediately Invoked Function Expression)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []); //※ ここはリロード時に実行(useEffectの第二引数を空配列にするとそうなる)
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
      <SyncModeToggle syncMode={syncMode} setSyncMode={setSyncMode} variant="outlined" />
      <span css={todoTransition}>
        <TransitionGroup component={null}>
          {clientTodoList.map((todo) => (
            <CSSTransition key={todo.id} timeout={1000} classNames="todo" nodeRef={nodeRefs.current[todo.id]} appear>
              <div ref={nodeRefs.current[todo.id]}>
                <TodoItem data={todo} updateOne={updateOne} deleteOne={deleteOne} />
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </span>
      <AddTaskButton addOne={addOne} />
      <div
        onClick={async () => {
          setLoading(true);
          await syncTodos(clientTodoList);
          setLoading(false);
        }}
      >
        <div>DB同期:</div>
      </div>
    </>
  );
}
