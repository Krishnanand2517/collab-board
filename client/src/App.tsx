import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="bg-neutral-950 text-white/90 min-h-screen p-6 md:py-10 md:px-20 lg:px-52 2xl:px-80">
      <Outlet />
    </div>
  );
};

export default App;
