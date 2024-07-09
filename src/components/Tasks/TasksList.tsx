import { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask } from "../../services/tasksService";
import { Task, TaskStatus } from "../../types/Task";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";


export function TasksList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);


    const standardizeStatus = (status: TaskStatus) => {
        switch (status.toUpperCase()) {
            case 'TO DO':
                return 'To Do';
            case 'IN_PROGRESS':
                return 'In Progress';
            case 'DONE':
                return 'Done';
            default:
                return 'To Do';
        }
    };

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasks();
                const standardizedTasks = data.map((task) => ({
                    ...task,
                    status: standardizeStatus(task.status) as TaskStatus,
                }));
                console.log("Fetched tasks:", standardizedTasks);
                setTasks(standardizedTasks);
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
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
            console.log("Created new task:", newTask);
            setTasks([...tasks,newTask]);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.log('Failed to create task', error);
        }
    }
    
    const handleTaskDelete =  async (e : React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.getAttribute('data-id');
        if(id) {
            try {
                await deleteTask(id);
                setTasks(tasks.filter(task => task.id !== id));
            } catch(error) {
                console.error(error)
            }
        }

    }

    const statuses : TaskStatus[] = ['To Do', 'In Progress', 'Done']
    const groupedTasks: { [key in TaskStatus]: Task[] } = {
        'To Do': tasks.filter(task => task.status === 'To Do'),
        'In Progress': tasks.filter(task => task.status === 'In Progress'),
        'Done': tasks.filter(task => task.status === 'Done'),
    };

    console.log("Grouped tasks:", groupedTasks);

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
                             <h3 className="text-xl font-bold mb-4">{status}</h3>
                             {groupedTasks[status].length === 0 ? (
                                <p className="text-gray-500 text-sm">Empty</p>
                             ) : (
                                groupedTasks[status].map((task) => (
                                    <div key={task.id} className="bg-white border border-gray-200 p-4 mb-4 shadow-md rounded-lg hover:shadow-lg transition duration-300">
                                        <div className="flex justify-between">
                                            <h3 className="font-bold text-lg hover:text-xl transition duration-500 ease-in-out ">{task.title}</h3>
                                            <div className="flex space-x-4">
                                            <button>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-black">
                                                <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                                                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
                                                </svg>
                                            </button>
                                            <button data-id={task.id} onClick={handleTaskDelete} className="text-red-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
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
