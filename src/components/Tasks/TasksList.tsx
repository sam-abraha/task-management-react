import { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask, updateTaskStatus } from "../../services/tasksService";
import { Task, TaskStatus } from "../../types/Task";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export function TasksList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasks();
                setTasks(data);
            } catch (error) {
                console.log('Failed to fetch tasks', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const newTask = await createTask(title, description);
            setTasks([...tasks, newTask]);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.log('Failed to create task', error);
        }
    }

    const handleTaskDelete = async (id: string) => {
        try {
            await deleteTask(id);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    const getNextStatus = (currentStatus: TaskStatus): TaskStatus => {
        switch (currentStatus) {
            case 'TO_DO':
                return 'IN_PROGRESS';
            case 'IN_PROGRESS':
                return 'DONE';
            case 'DONE':
                return 'DONE';
            default:
                return 'TO_DO';
        }
    };

    const handleStatusUpdate = async (id: string, currentStatus: TaskStatus) => {
        const nextStatus = getNextStatus(currentStatus);
        try {
            const updatedTask = await updateTaskStatus(id, nextStatus);
            console.log('Updated task',updatedTask)
            setTasks(tasks.map(task => task.id === id ? { ...task, status: nextStatus } : task));
        } catch (error) {
            console.log('Failed to update task:', error);
        }
    };

    const statuses: TaskStatus[] = ['TO_DO', 'IN_PROGRESS', 'DONE'];

    const groupedTasks: { [key in TaskStatus]: Task[] } = statuses.reduce((acc, status) => {
        acc[status] = tasks.filter(task => task.status === status);
        return acc;
    }, {} as { [key in TaskStatus]: Task[] });

    return (
        <div className="max-w-4xl mx-auto mt-12">
            <form className="bg-white shadow-md rounded-lg p-6 mb-8" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-4">Create Task</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="rounded-lg text-lg w-full p-4 mb-2 border border-gray-300"
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="rounded-lg text-lg w-full p-4 mb-2 border border-gray-300"
                />
                <button
                    className="rounded-lg text-sm w-full p-4 border mb-2 bg-emerald-500 text-white hover:bg-emerald-700 transition duration-300"
                >
                    Submit
                </button>
            </form>
            {loading ? (
                <div className="min-h-screen text-center flex justify-center items-center">
                    <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                </div>
            ) : (
                <div className="flex space-x-4 overflow-x-auto">
                    {statuses.map((status) => (
                        <div key={status} className="flex-shrink-0 w-80">
                            <h3 className="text-xl font-bold mb-4">{status.replace('_', ' ')}</h3>
                            {groupedTasks[status].length === 0 ? (
                                <p className="text-gray-500 text-sm text-left">Empty.</p>
                            ) : (
                                groupedTasks[status].map((task) => (
                                    <div key={task.id} className="bg-white border border-gray-200 p-4 mb-4 shadow-md rounded-lg hover:shadow-lg transition duration-300">
                                        <div className="flex justify-between">
                                            <h3 className="font-bold text-lg hover:text-xl transition duration-500 ease-in-out ">{task.title}</h3>
                                            <div className="flex space-x-4">
                                                <button className="text-black" onClick={() => handleStatusUpdate(task.id, task.status)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h4.59l-2.1 1.95a.75.75 0 0 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 1 0-1.02 1.1l2.1 1.95H6.75Z" clip-rule="evenodd" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => handleTaskDelete(task.id)} className="text-red-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clip-rule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-600">{task.description}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
