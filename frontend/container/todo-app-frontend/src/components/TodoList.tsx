"use client";
import React, { useState, Fragment } from "react";
import Task, { TaskData } from "./todoModules/Task";
import AddTaskButton from "./todoModules/AddTaskButton";

export default function ToDoList() {
  const [tasks, setTasks] = useState<TaskData[]>([
    { id: "1", title: "買い物に行く" },
    { id: "2", title: "勉強する" },
  ]);
  const changeTitle = (id: string, newTitle: string) => {
    setTasks((tasks) => tasks.map((task) => (task.id === id ? { ...task, title: newTitle } : task)));
  };
  const deleteTask = (id: string) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
  };
  const [tasksView, sync] = useState<TaskData[]>([]);
  const update = (tasks: TaskData[]) => sync(tasks);
  return (
    <>
      {tasks.map((task) => (
        <Fragment key={task.id}>
          <Task task={task} changeTitle={changeTitle} />
          <button onClick={() => deleteTask(task.id)}>削除</button>
        </Fragment>
      ))}
      <AddTaskButton setTasks={setTasks} />
      <div onClick={() => update(tasks)}>
        <div>同期:</div>
        {tasksView.map((task) => `${task.id}: ${task.title}`).join(", ")}
      </div>
    </>
  );
}
