import { createRoot } from "react-dom/client";
import "./tokens.css";
import "./styles/animations.css";
import { EnhanceLab } from "./enhance/EnhanceLab";

createRoot(document.getElementById("root")!).render(<EnhanceLab />);
