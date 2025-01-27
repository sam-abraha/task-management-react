import { Link } from "react-router-dom";

export default function Header() {
    return (
        <div className="flex justify-between px-4 py-4 bg-stone-600 text-white font-sans">
            <div className="flex items-center font-bold">
            <Link to="/">Task Manager</Link>
            </div>
            <div className="flex items-center space-x-4 font-bold">
                <Link to="/signin">Sign In</Link>
                <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    )
}
