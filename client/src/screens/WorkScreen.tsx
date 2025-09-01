import { useParams } from "react-router-dom";
import Workspace from "../components/Workspace";

const WorkScreen = () => {
  const { boardId } = useParams();

  return (
    <div className="fixed inset-0">
      <Workspace boardId={boardId} />
    </div>
  );
};

export default WorkScreen;
