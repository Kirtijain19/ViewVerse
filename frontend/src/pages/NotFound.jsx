import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-900 bg-slate-900/70 p-8 text-center">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-slate-400">The page you are looking for doesn’t exist.</p>
        <Link to="/" className="mt-6 inline-flex">
          <Button>Back to home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
