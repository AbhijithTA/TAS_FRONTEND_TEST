import { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import Axios from "../../../Config/axios";

const TaskReminder = () => {
  const [tasks, setTasks] = useState([]);
  const [editedTask, setEditedTask] = useState({ id: null, description: "" });

  const fetchTasks = useCallback(async () => { 
    try {
      const response = await Axios.get("/admin/get-task");
      const sortedTasks = response?.data?.tasks?.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setTasks(sortedTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  const validateTask = (values) => {
    const errors = {};
    if (!values.task) {
      errors.task = "Task Required";
    } else if (values.task.length < 5) {
      errors.task = "Must be 5 characters or more";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      task: "",
      submitDate: new Date().toISOString(),
    },
    validate: validateTask,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editedTask.id !== null) {
          await handleTaskUpdate(editedTask.id, editedTask.description);
        } else {
          await Axios.post("/admin/set-task", {
            task: {
              description: values.task,
              createdAt: values.submitDate,
              status: "pending",
            },
          });
        }
        await fetchTasks();
        resetForm();
        setEditedTask({ id: null, description: "" });
      } catch (error) {
        console.error("Failed to submit task:", error);
      }
    },
  });

  const handleCheckboxChange = async (index) => {
    try {
      const updatedTasks = [...tasks];
      const currentStatus = updatedTasks[index].status;
      updatedTasks[index].status =
        currentStatus === "completed" ? "pending" : "completed";
      await Axios.put("/admin/task/updatetaskStatus", {
        taskId: updatedTasks[index]._id,
        status: updatedTasks[index].status,
      });
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleEditTask = (task) => {
    setEditedTask({ id: task._id, description: task.description });
    formik.setValues({
      ...formik.values,
      task: task.description,
    });
  };

  const handleTaskUpdate = async (taskId, description) => {
    try {
      await Axios.put("/admin/task/edit-task", {
        taskId: taskId,
        description: description,
      });
      await fetchTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await Axios.delete("/admin/task/delete-task", {
        data: { taskId },
      });
      await fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div className="max-w-1/2 h-[402px] overflow-auto mx-auto my-8 p-6 border rounded-md shadow-lg">
      <form
        onSubmit={formik.handleSubmit}
        className="flex w-full mb-4 gap-3 flex-col"
      >
        <input
          type="text"
          name="task"
          className="w-full p-2 border rounded-md focus:outline-none"
          placeholder="Task to remind"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.task}
        />
        {formik.touched.task && formik.errors.task && (
          <div className="text-red-500 text-sm">{formik.errors.task}</div>
        )}
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
          onClick={
            editedTask.id !== null
              ? () => handleTaskUpdate(editedTask.id, formik.values.task)
              : null
          }
        >
          {editedTask.id !== null ? "Update" : "Add"}
        </button>
      </form>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Your Tasks</h2>
        <div className="w-full">
          {tasks.map((task, index) => (
            <div
              key={index}
              className={`py-4 flex justify-between items-center ${
                task.status === "completed"
                  ? "text-green-600 line-through"
                  : "text-gray-800 "
              }`}
            >
              <span>{task.description}</span>
              <div className="flex justify-end items-center">
                <svg
                  className="h-6 w-6 cursor-pointer mr-2"
                  onClick={() => handleEditTask(task)}
                  viewBox="0 0 401.52289 401"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#387ADF"
                >
                  <path d="m370.589844 250.972656c-5.523438 0-10 4.476563-10 10v88.789063c-.019532 16.5625-13.4375 29.984375-30 30h-280.589844c-16.5625-.015625-29.980469-13.4375-30-30v-260.589844c.019531-16.558594 13.4375-29.980469 30-30h88.789062c5.523438 0 10-4.476563 10-10 0-5.519531-4.476562-10-10-10h-88.789062c-27.601562.03125-49.96875 22.398437-50 50v260.59375c.03125 27.601563 22.398438 49.96875 50 50h280.589844c27.601562-.03125 49.96875-22.398437 50-50v-88.792969c0-5.523437-4.476563-10-10-10zm0 0" />
                  <path d="m376.628906 13.441406c-17.574218-17.574218-46.066406-17.574218-63.640625 0l-178.40625 178.40625c-1.222656 1.222656-2.105469 2.738282-2.566406 4.402344l-23.460937 84.699219c-.964844 3.472656.015624 7.191406 2.5625 9.742187 2.550781 2.546875 6.269531 3.527344 9.742187 2.566406l84.699219-23.464843c1.664062-.460938 3.179687-1.34375 4.402344-2.566407l178.402343-178.410156c17.546875-17.585937 17.546875-46.054687 0-63.640625zm-220.257812 184.90625 146.011718-146.015625 47.089844 47.089844-146.015625 146.015625zm-9.40625 18.875 37.621094 37.625-52.039063 14.417969zm227.257812-142.546875-10.605468 10.605469-47.09375-47.09375 10.609374-10.605469c9.761719-9.761719 25.589844-9.761719 35.351563 0l11.738281 11.734375c9.746094 9.773438 9.746094 25.589844 0 35.359375zm0 0" />
                </svg>
                <svg
                  className="h-6 w-6 cursor-pointer mr-2"
                  onClick={() => handleDeleteTask(task._id)}
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#FF0000"
                >
                  <path d="m320.99 435.003 20.021-273.71c.362-4.958 4.688-8.692 9.632-8.319 4.958.362 8.683 4.675 8.319 9.632l-20.021 273.71c-.346 4.734-4.294 8.344-8.966 8.344-.221 0-.442-.008-.666-.024-4.957-.364-8.682-4.676-8.319-9.633zm-155.463 1.312c.346 4.734 4.294 8.344 8.966 8.344.221 0 .443-.008.666-.024 4.958-.362 8.683-4.675 8.319-9.632l-20.021-273.71c-.362-4.957-4.693-8.688-9.632-8.319-4.958.362-8.683 4.675-8.319 9.632zm85.078 8.344c4.971 0 9-4.029 9-9v-275.883c0-4.971-4.029-9-9-9s-9 4.029-9 9v275.883c0 4.971 4.03 9 9 9zm222.237-331.5c-.945 4.924-5.755 8.065-10.536 7.142l-21.601-4.147-36.156 320.514c-2.292 20.321-10.735 39.03-23.773 52.68-13.954 14.607-32.602 22.652-52.511 22.652h-152.061c-19.909 0-38.558-8.045-52.511-22.652-13.038-13.65-21.481-32.358-23.773-52.68l-36.929-327.364c-.287-2.546.524-5.095 2.232-7.006 1.707-1.91 4.148-3.003 6.711-3.003h280.959l-306.593-58.862c-4.881-.938-8.078-5.654-7.142-10.536.937-4.881 5.651-8.076 10.536-7.142l143.697 27.588 4.626-24.094c1.624-8.46 6.466-15.795 13.634-20.653 7.168-4.859 15.777-6.637 24.234-5.016l65.072 12.493c8.46 1.624 15.795 6.466 20.654 13.634 4.858 7.167 6.64 15.773 5.016 24.233l-4.626 24.094 143.699 27.589c4.881.938 8.078 5.654 7.142 10.536zm-50.38 4.136h-340.455l35.8 317.355c3.941 34.944 27.955 59.35 58.397 59.35h152.061c30.442 0 54.456-24.405 58.397-59.35zm-211.393-63.558 93.255 17.904 4.626-24.094c.718-3.738-.077-7.553-2.237-10.74-2.161-3.188-5.41-5.338-9.148-6.056l-65.073-12.493c-3.736-.719-7.553.076-10.74 2.237-3.188 2.16-5.338 5.409-6.056 9.147z" />
                </svg>
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="h-5 w-5 text-green-600"
                      checked={task.status === "completed"}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
        {tasks.length === 0 && (
          <p className="text-center text-gray-500">No tasks added yet</p>
        )}
      </div>
    </div>
  );
};

export default TaskReminder;