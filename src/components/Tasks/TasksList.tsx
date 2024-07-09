import { useEffect, useState } from "react";
import { getTasks, createTask } from "../../services/tasksService";
import { Task } from "../../types/Task";
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
                setTasks(data)
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
                <div className="p-4 border bg-slate-200 shadow-md">
                    {tasks.map((task) => (
                        <div>
                            <h1>{task.title}</h1>
                            <p>{task.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
