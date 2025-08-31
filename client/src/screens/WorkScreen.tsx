import { useParams } from "react-router-dom";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

const WorkScreen = () => {
  const { boardId } = useParams();

  return (
    <div className="fixed inset-0">
      <Tldraw persistenceKey={boardId || "collabboardpersistence"} />
    </div>
  );
};

export default WorkScreen;
