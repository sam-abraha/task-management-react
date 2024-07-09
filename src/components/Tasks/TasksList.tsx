import { useEffect, useState } from "react";
import { getTasks, createTask } from "../../services/tasksService";
import { Task, TaskStatus } from "../../types/Task";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";


export function TasksList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);


    const standardizeStatus = (status : TaskStatus) => {
        switch(status.toUpperCase()) {
            case 'TO DO':
                return 'Done';
            case 'IN_PROGRESS':
                return 'In Progress';
            case 'DONE' :
                return 'In Progress';
            default : return 'TO DO';
        }
    }

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasks();
                // Standardize task status
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
                                <p className="text-gray-500">Empty</p>
                             ) : (
                                groupedTasks[status].map((task) => (
                                    <div key={task.id} className="bg-white border border-gray-200 p-4 mb-4 shadow-md rounded-lg hover:shadow-lg transition duration-300">
                                        <h3 className="font-bold text-xl">{task.title}</h3>
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
