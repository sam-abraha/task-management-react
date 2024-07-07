import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Layout from "./components/Layout"
import SignIn from "./pages/SigninPage"
import SignUp from "./pages/SignupPage"

function App() {

  return (
    <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Route>
    </Routes>
  )
}

export default App
